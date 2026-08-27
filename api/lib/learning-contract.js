import crypto from 'node:crypto';

import { ApiError } from './http.js';
import { getLearningMap, getSkillBundleSource } from './skill-files.js';
import { validateSkillSlug } from './skills.js';
import { StateStoreConflictError } from './learner-state-store.js';

const MAX_NODES = 500;
const MAX_OUTCOMES = 50;
const MAX_LIST_ITEMS = 100;
const NODE_ID = /^[a-z0-9][a-z0-9._-]{0,127}$/;
const STAGES = new Set(['prerequisite', 'core', 'advanced', 'application']);
const MASTERY_LEVELS = ['0', '1', '2', '3', '4'];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value, field, { max = 2000, pattern } = {}) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new ApiError(`${field} must be a non-empty string of at most ${max} characters`, 422);
  }
  if (pattern && !pattern.test(value)) {
    throw new ApiError(`${field} has an invalid format`, 422);
  }
  return value.trim();
}

function stringList(
  value,
  field,
  { minItems = 0, maxItems = MAX_LIST_ITEMS, itemMax = 1000 } = {}
) {
  if (!Array.isArray(value) || value.length < minItems || value.length > maxItems) {
    throw new ApiError(
      `${field} must be an array with ${minItems}-${maxItems} items`,
      422
    );
  }
  return value.map((item, index) =>
    requireString(item, `${field}[${index}]`, { max: itemMax })
  );
}

function normalizeSignals(value, field) {
  if (!isPlainObject(value)) throw new ApiError(`${field} must be an object`, 422);
  return {
    strong: stringList(value.strong ?? [], `${field}.strong`, { itemMax: 500 }),
    weak: stringList(value.weak ?? [], `${field}.weak`, { itemMax: 500 })
  };
}

function normalizeMastery(value, field) {
  if (!isPlainObject(value)) throw new ApiError(`${field} must be an object`, 422);
  const mastery = {};
  for (const level of MASTERY_LEVELS) {
    mastery[level] = requireString(value[level], `${field}.${level}`, { max: 1000 });
  }
  return mastery;
}

function normalizeNode(node, index, readableFiles) {
  const field = `nodes[${index}]`;
  if (!isPlainObject(node)) throw new ApiError(`${field} must be an object`, 422);
  const id = requireString(node.id, `${field}.id`, { max: 128, pattern: NODE_ID });
  if (!STAGES.has(node.stage)) {
    throw new ApiError(`${field}.stage must be prerequisite, core, advanced, or application`, 422);
  }
  if (!Array.isArray(node.source_anchors) || node.source_anchors.length === 0 ||
      node.source_anchors.length > MAX_LIST_ITEMS) {
    throw new ApiError(`${field}.source_anchors must contain 1-${MAX_LIST_ITEMS} items`, 422);
  }
  const sourceAnchors = node.source_anchors.map((anchor, anchorIndex) => {
    const anchorField = `${field}.source_anchors[${anchorIndex}]`;
    if (!isPlainObject(anchor)) throw new ApiError(`${anchorField} must be an object`, 422);
    const file = requireString(anchor.file, `${anchorField}.file`, { max: 500 });
    if (!readableFiles.has(file)) {
      throw new ApiError(`${anchorField}.file is not a readable file in the Skill: ${file}`, 422);
    }
    return {
      file,
      concept: requireString(anchor.concept, `${anchorField}.concept`, { max: 500 })
    };
  });

  if (!isPlainObject(node.diagnose)) throw new ApiError(`${field}.diagnose must be an object`, 422);
  if (!isPlainObject(node.challenge)) throw new ApiError(`${field}.challenge must be an object`, 422);

  return {
    id,
    title: requireString(node.title, `${field}.title`, { max: 200 }),
    stage: node.stage,
    capability: requireString(node.capability, `${field}.capability`),
    prerequisites: stringList(node.prerequisites ?? [], `${field}.prerequisites`, {
      itemMax: 128
    }),
    source_anchors: sourceAnchors,
    weaknesses: stringList(node.weaknesses ?? [], `${field}.weaknesses`, {
      maxItems: 30,
      itemMax: 500
    }),
    mastery: normalizeMastery(node.mastery, `${field}.mastery`),
    diagnose: {
      prompt_pattern: requireString(
        node.diagnose.prompt_pattern,
        `${field}.diagnose.prompt_pattern`
      ),
      signals: normalizeSignals(node.diagnose.signals ?? {}, `${field}.diagnose.signals`)
    },
    challenge: {
      task_pattern: requireString(
        node.challenge.task_pattern,
        `${field}.challenge.task_pattern`
      ),
      novelty_constraints: stringList(
        node.challenge.novelty_constraints ?? [],
        `${field}.challenge.novelty_constraints`,
        { minItems: 1, itemMax: 500 }
      )
    }
  };
}

function validateGraph(nodes) {
  const ids = new Set(nodes.map(node => node.id));
  if (ids.size !== nodes.length) throw new ApiError('Learning Contract has duplicate node IDs', 422);
  for (const node of nodes) {
    const seen = new Set();
    for (const prerequisite of node.prerequisites) {
      if (!NODE_ID.test(prerequisite) || !ids.has(prerequisite)) {
        throw new ApiError(`Node ${node.id} has an unknown prerequisite: ${prerequisite}`, 422);
      }
      if (prerequisite === node.id) {
        throw new ApiError(`Node ${node.id} cannot depend on itself`, 422);
      }
      if (seen.has(prerequisite)) {
        throw new ApiError(`Node ${node.id} repeats prerequisite: ${prerequisite}`, 422);
      }
      seen.add(prerequisite);
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const byId = new Map(nodes.map(node => [node.id, node]));
  function visit(id) {
    if (visiting.has(id)) throw new ApiError('Learning Contract prerequisites must form a DAG', 422);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const prerequisite of byId.get(id).prerequisites) visit(prerequisite);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of ids) visit(id);
}

export function learningContractKey(ownerId, skill) {
  const ownerHash = crypto.createHash('sha256').update(ownerId).digest('hex');
  return `learning-contract/v1/${ownerHash}/${skill}.json`;
}

export function normalizeLearningContract(input, source, previous = null) {
  if (!isPlainObject(input)) throw new ApiError('Request body must be an object', 422);
  if (input.schema_version !== 1) {
    throw new ApiError('schema_version must be 1', 422);
  }
  const skill = validateSkillSlug(requireString(input.skill, 'skill', { max: 128 }));
  if (skill !== source.skill) throw new ApiError('skill does not match the requested Skill', 422);
  const sourceRevision = requireString(input.source_revision, 'source_revision', { max: 200 });
  if (sourceRevision !== source.source_revision) {
    throw new ApiError(
      'The Skill changed while the Learning Contract was being generated; read it again',
      409,
      'source_revision_conflict'
    );
  }
  if (!Array.isArray(input.nodes) || input.nodes.length === 0 || input.nodes.length > MAX_NODES) {
    throw new ApiError(`nodes must contain 1-${MAX_NODES} capability nodes`, 422);
  }
  const readableFiles = new Set(source.readable_files);
  const nodes = input.nodes.map((node, index) => normalizeNode(node, index, readableFiles));
  validateGraph(nodes);
  const now = new Date().toISOString();
  return {
    expectedEtag: input.expected_etag ?? null,
    contract: {
      schema_version: 1,
      skill,
      source_revision: sourceRevision,
      outcomes: stringList(input.outcomes ?? [], 'outcomes', {
        minItems: 1,
        maxItems: MAX_OUTCOMES,
        itemMax: 1000
      }),
      nodes,
      created_at: previous?.created_at ?? now,
      updated_at: now
    }
  };
}

function defaultSkillSourceLoader(skill) {
  const source = getSkillBundleSource(skill);
  if (!source) throw new ApiError(`Skill "${skill}" not found`, 404, 'skill_not_found');
  if (source.truncated) {
    throw new ApiError('Skill bundle is too large to establish a complete source revision', 422);
  }
  return source;
}

export async function loadLearningContract({
  store,
  ownerId,
  skill,
  skillSourceLoader = defaultSkillSourceLoader
}) {
  validateSkillSlug(skill);
  const source = await skillSourceLoader(skill);
  const stored = await store.read(learningContractKey(ownerId, skill));
  if (!stored) {
    return {
      found: false,
      skill,
      source_revision: source.source_revision,
      revision_matches: true,
      contract: null,
      etag: null
    };
  }
  let contract;
  try {
    contract = JSON.parse(stored.content);
  } catch {
    throw new ApiError('Stored Learning Contract is invalid JSON', 500, 'corrupt_contract');
  }
  return {
    found: true,
    skill,
    source_revision: source.source_revision,
    revision_matches: contract.source_revision === source.source_revision,
    contract,
    etag: stored.etag
  };
}

export async function saveLearningContract({
  store,
  ownerId,
  input,
  skillSourceLoader = defaultSkillSourceLoader
}) {
  if (!isPlainObject(input)) throw new ApiError('Request body must be an object', 422);
  const skill = validateSkillSlug(requireString(input.skill, 'skill', { max: 128 }));
  const source = await skillSourceLoader(skill);
  const key = learningContractKey(ownerId, skill);
  const existing = await store.read(key);
  let previous = null;
  if (existing) {
    try {
      previous = JSON.parse(existing.content);
    } catch {
      throw new ApiError('Stored Learning Contract is invalid JSON', 500, 'corrupt_contract');
    }
  }
  const { expectedEtag, contract } = normalizeLearningContract(input, source, previous);
  if (expectedEtag !== null && typeof expectedEtag !== 'string') {
    throw new ApiError('expected_etag must be a string or null', 422);
  }
  if (existing && !expectedEtag) {
    throw new ApiError(
      'Learning Contract already exists; reload it and provide expected_etag',
      409,
      'contract_conflict'
    );
  }
  if (!existing && expectedEtag) {
    throw new ApiError('Learning Contract no longer exists; reload before updating', 409, 'contract_conflict');
  }
  if (existing && existing.etag !== expectedEtag) {
    throw new ApiError('Learning Contract changed; reload it before updating', 409, 'contract_conflict');
  }
  try {
    const written = await store.write(key, JSON.stringify(contract), {
      expectedEtag,
      createOnly: !existing
    });
    return { saved: true, contract, etag: written.etag };
  } catch (error) {
    if (error instanceof StateStoreConflictError) {
      throw new ApiError(error.message, 409, 'contract_conflict');
    }
    throw error;
  }
}

export function createLearningContractLoader({
  store,
  ownerId,
  skillSourceLoader = defaultSkillSourceLoader
}) {
  return async function learningContractLoader(skill) {
    const stored = await loadLearningContract({ store, ownerId, skill, skillSourceLoader });
    if (stored.found) {
      if (!stored.revision_matches) {
        throw new ApiError(
          `Learning Contract for "${skill}" is stale; regenerate it from the current Skill`,
          409,
          'learning_contract_stale'
        );
      }
      return stored.contract;
    }

    const legacy = getLearningMap(skill);
    if (legacy?.nodes?.length) return legacy;
    throw new ApiError(
      `Learning Contract for "${skill}" has not been generated yet`,
      422,
      'learning_contract_missing'
    );
  };
}
