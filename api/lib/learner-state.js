import crypto from 'node:crypto';

import { ApiError } from './http.js';
import { StateStoreConflictError } from './learner-state-store.js';

const MAX_NODES = 500;
const MAX_EVIDENCE_PER_NODE = 100;
const MAX_WEAKNESSES_PER_NODE = 30;
const PHASES = new Set(['idle', 'diagnose', 'route', 'learn', 'challenge', 'retrieval']);
const EVIDENCE_KINDS = new Set([
  'diagnostic', 'explanation', 'application', 'transfer', 'retrieval'
]);
const EVIDENCE_RESULTS = new Set(['pass', 'partial', 'fail']);

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value, field, { max = 200, nullable = false } = {}) {
  if (nullable && value === null) return null;
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new ApiError(`${field} must be a non-empty string of at most ${max} characters`, 422);
  }
  return value;
}

function optionalTimestamp(value, field) {
  if (value === null || value === undefined) return null;
  requireString(value, field, { max: 64 });
  if (Number.isNaN(Date.parse(value))) {
    throw new ApiError(`${field} must be an ISO-8601 timestamp`, 422);
  }
  return value;
}

function requiredTimestamp(value, field) {
  requireString(value, field, { max: 64 });
  if (Number.isNaN(Date.parse(value))) {
    throw new ApiError(`${field} must be an ISO-8601 timestamp`, 422);
  }
  return value;
}

function validateSession(session, nodeIds) {
  if (!isPlainObject(session)) throw new ApiError('session must be an object', 422);
  const currentNode = session.current_node ?? null;
  if (currentNode !== null && !nodeIds.has(currentNode)) {
    throw new ApiError(`session.current_node is not in the learning map: ${currentNode}`, 422);
  }
  const phase = session.phase ?? 'idle';
  if (!PHASES.has(phase)) throw new ApiError(`Invalid session phase: ${phase}`, 422);

  let pendingQuestion = null;
  if (session.pending_question !== null && session.pending_question !== undefined) {
    const pending = session.pending_question;
    if (!isPlainObject(pending)) {
      throw new ApiError('session.pending_question must be an object or null', 422);
    }
    pendingQuestion = {
      question_id: requireString(pending.question_id, 'pending_question.question_id'),
      prompt_summary: requireString(
        pending.prompt_summary,
        'pending_question.prompt_summary',
        { max: 2000 }
      ),
      asked_at: requiredTimestamp(pending.asked_at, 'pending_question.asked_at')
    };
  }

  return {
    current_node: currentNode,
    phase,
    pending_question: pendingQuestion
  };
}

function validateEvidence(evidence, field) {
  if (!isPlainObject(evidence)) throw new ApiError(`${field} must be an object`, 422);
  if (!EVIDENCE_KINDS.has(evidence.kind)) {
    throw new ApiError(`${field}.kind is invalid`, 422);
  }
  if (!EVIDENCE_RESULTS.has(evidence.result)) {
    throw new ApiError(`${field}.result is invalid`, 422);
  }
  return {
    kind: evidence.kind,
    result: evidence.result,
    response_summary: requireString(
      evidence.response_summary,
      `${field}.response_summary`,
      { max: 2000 }
    ),
    recorded_at: requiredTimestamp(evidence.recorded_at, `${field}.recorded_at`)
  };
}

function evidenceSupportsMastery(mastery, evidence) {
  const passedKinds = new Set(
    evidence.filter(item => item.result === 'pass').map(item => item.kind)
  );
  if (mastery >= 4) return passedKinds.has('transfer');
  if (mastery >= 3) return passedKinds.has('application') || passedKinds.has('transfer');
  if (mastery >= 2) {
    return passedKinds.has('explanation') || passedKinds.has('application') ||
      passedKinds.has('transfer');
  }
  if (mastery >= 1) return evidence.length > 0;
  return true;
}

function validateNodeState(nodeId, value) {
  if (!isPlainObject(value)) throw new ApiError(`nodes.${nodeId} must be an object`, 422);
  const mastery = value.mastery;
  if (!Number.isInteger(mastery) || mastery < 0 || mastery > 4) {
    throw new ApiError(`nodes.${nodeId}.mastery must be an integer from 0 to 4`, 422);
  }
  if (!Array.isArray(value.evidence) || value.evidence.length > MAX_EVIDENCE_PER_NODE) {
    throw new ApiError(
      `nodes.${nodeId}.evidence must contain at most ${MAX_EVIDENCE_PER_NODE} items`,
      422
    );
  }
  const evidence = value.evidence.map((item, index) =>
    validateEvidence(item, `nodes.${nodeId}.evidence[${index}]`)
  );
  if (!evidenceSupportsMastery(mastery, evidence)) {
    throw new ApiError(`nodes.${nodeId}.mastery is not supported by recorded evidence`, 422);
  }
  if (!Array.isArray(value.weaknesses) || value.weaknesses.length > MAX_WEAKNESSES_PER_NODE) {
    throw new ApiError(
      `nodes.${nodeId}.weaknesses must contain at most ${MAX_WEAKNESSES_PER_NODE} items`,
      422
    );
  }
  const weaknesses = value.weaknesses.map((item, index) =>
    requireString(item, `nodes.${nodeId}.weaknesses[${index}]`, { max: 500 })
  );
  return {
    mastery,
    evidence,
    weaknesses,
    last_retrieved_at: optionalTimestamp(
      value.last_retrieved_at,
      `nodes.${nodeId}.last_retrieved_at`
    ),
    next_review_at: optionalTimestamp(
      value.next_review_at,
      `nodes.${nodeId}.next_review_at`
    )
  };
}

export function learnerStateKey(ownerId, skill) {
  const ownerHash = crypto.createHash('sha256').update(ownerId).digest('hex');
  return `learner-state/v1/${ownerHash}/${skill}.json`;
}

export function normalizeLearnerStateUpdate(
  input,
  ownerId,
  { learningContractLoader } = {}
) {
  if (typeof learningContractLoader !== 'function') {
    throw new ApiError('Learning Contract loader is not configured', 503, 'state_not_configured');
  }
  return normalizeLearnerStateUpdateAsync(input, ownerId, learningContractLoader);
}

async function normalizeLearnerStateUpdateAsync(input, ownerId, learningContractLoader) {
  if (!isPlainObject(input)) throw new ApiError('Request body must be an object', 422);
  const skill = requireString(input.skill, 'skill', { max: 128 });
  const map = await learningContractLoader(skill);
  const nodeIds = new Set(map.nodes.map(node => node.id));
  if (nodeIds.has(undefined) || nodeIds.size !== map.nodes.length) {
    throw new ApiError('The Skill learning map has invalid or duplicate node IDs', 422);
  }
  const nodesInput = input.nodes ?? {};
  if (!isPlainObject(nodesInput) || Object.keys(nodesInput).length > MAX_NODES) {
    throw new ApiError(`nodes must be an object with at most ${MAX_NODES} entries`, 422);
  }
  const nodes = {};
  for (const [nodeId, value] of Object.entries(nodesInput)) {
    if (!nodeIds.has(nodeId)) {
      throw new ApiError(`Learner state contains an unknown node: ${nodeId}`, 422);
    }
    nodes[nodeId] = validateNodeState(nodeId, value);
  }
  const suggestedNext = input.suggested_next ?? null;
  if (suggestedNext !== null && !nodeIds.has(suggestedNext)) {
    throw new ApiError(`suggested_next is not in the learning map: ${suggestedNext}`, 422);
  }
  const mapRevision = String(map.source_revision ?? map.skill_revision ?? '');
  const skillRevision = requireString(input.skill_revision, 'skill_revision', { max: 200 });
  if (mapRevision !== skillRevision) {
    throw new ApiError(
      `skill_revision does not match the current Learning Contract (${mapRevision})`,
      409,
      'skill_revision_conflict'
    );
  }

  return {
    expectedEtag: input.expected_etag ?? null,
    state: {
      schema_version: 1,
      learner_id: ownerId,
      skill,
      skill_revision: skillRevision,
      session: validateSession(input.session ?? {}, nodeIds),
      nodes,
      suggested_next: suggestedNext,
      updated_at: new Date().toISOString()
    }
  };
}

export async function loadLearnerState({
  store,
  ownerId,
  skill,
  learningContractLoader
}) {
  if (typeof learningContractLoader !== 'function') {
    throw new ApiError('Learning Contract loader is not configured', 503, 'state_not_configured');
  }
  const map = await learningContractLoader(skill);
  const currentRevision = String(map.source_revision ?? map.skill_revision ?? '');
  const stored = await store.read(learnerStateKey(ownerId, skill));
  if (!stored) {
    return {
      found: false,
      learner_id: ownerId,
      skill,
      skill_revision: currentRevision,
      revision_matches: true,
      state: null,
      etag: null
    };
  }
  let state;
  try {
    state = JSON.parse(stored.content);
  } catch {
    throw new ApiError('Stored learner state is invalid JSON', 500, 'corrupt_state');
  }
  return {
    found: true,
    learner_id: ownerId,
    skill,
    skill_revision: currentRevision,
    revision_matches: String(state.skill_revision) === currentRevision,
    state,
    etag: stored.etag
  };
}

export async function saveLearnerState({
  store,
  ownerId,
  input,
  learningContractLoader
}) {
  const { expectedEtag, state } = await normalizeLearnerStateUpdate(
    input,
    ownerId,
    { learningContractLoader }
  );
  if (expectedEtag !== null && typeof expectedEtag !== 'string') {
    throw new ApiError('expected_etag must be a string or null', 422);
  }
  const key = learnerStateKey(ownerId, state.skill);
  const existing = await store.read(key);
  if (existing && !expectedEtag) {
    throw new ApiError(
      'Learner state already exists; reload it and provide expected_etag',
      409,
      'state_conflict'
    );
  }
  if (!existing && expectedEtag) {
    throw new ApiError(
      'Learner state no longer exists; reload before updating',
      409,
      'state_conflict'
    );
  }
  if (existing && existing.etag !== expectedEtag) {
    throw new ApiError(
      'Learner state changed; reload it before updating',
      409,
      'state_conflict'
    );
  }
  try {
    const written = await store.write(key, JSON.stringify(state), {
      expectedEtag,
      createOnly: !existing
    });
    return { saved: true, state, etag: written.etag };
  } catch (error) {
    if (error instanceof StateStoreConflictError) {
      throw new ApiError(error.message, 409, 'state_conflict');
    }
    throw error;
  }
}
