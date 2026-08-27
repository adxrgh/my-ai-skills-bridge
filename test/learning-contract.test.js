import assert from 'node:assert/strict';
import test from 'node:test';

import { createLearningContractHandler } from '../api/learning-contract.js';
import { createLearnerStateHandler } from '../api/learner-state.js';
import { ApiError } from '../lib/http.js';
import {
  createLearningContractLoader,
  learningContractKey,
  loadLearningContract,
  saveLearningContract
} from '../lib/learning-contract.js';
import { createMemoryStateStore } from '../lib/learner-state-store.js';

const source = {
  skill: 'ordinary-skill',
  source_revision: 'sha256:source-rev-1',
  readable_files: ['SKILL.md', 'references/domain.md'],
  truncated: false
};
const skillSourceLoader = async skill => {
  if (skill !== source.skill) throw new ApiError('Skill not found', 404);
  return source;
};

function contractInput(overrides = {}) {
  return {
    schema_version: 1,
    skill: source.skill,
    source_revision: source.source_revision,
    outcomes: ['Independently diagnose and apply the Skill in an unfamiliar situation.'],
    nodes: [{
      id: 'core-judgment',
      title: 'Make the core judgment',
      stage: 'core',
      capability: 'Diagnose the governing relationship and justify a suitable action.',
      prerequisites: [],
      source_anchors: [{ file: 'SKILL.md', concept: 'core operating rule' }],
      weaknesses: ['Names a term without explaining causality.'],
      mastery: {
        '0': 'Cannot identify a relevant relationship.',
        '1': 'Recognizes the term but cannot explain it.',
        '2': 'Explains the relationship in a familiar example.',
        '3': 'Applies the relationship and justifies an action.',
        '4': 'Transfers the relationship to an unfamiliar constraint.'
      },
      diagnose: {
        prompt_pattern: 'Present one high-information situation and ask for the first judgment.',
        signals: {
          strong: ['Explains cause and consequence.'],
          weak: ['Only names a variable.']
        }
      },
      challenge: {
        task_pattern: 'Change the medium and require prediction, action, and justification.',
        novelty_constraints: ['Do not reuse the diagnostic example.']
      }
    }],
    expected_etag: null,
    ...overrides
  };
}

function mockResponse() {
  return {
    headers: {},
    statusCode: 200,
    payload: null,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.payload = value; return this; },
    end() { return this; }
  };
}

test('creates, reads, and conditionally updates a dynamic Learning Contract', async () => {
  const store = createMemoryStateStore();
  const ownerId = 'private-owner';

  const absent = await loadLearningContract({
    store,
    ownerId,
    skill: source.skill,
    skillSourceLoader
  });
  assert.equal(absent.found, false);
  assert.equal(absent.source_revision, source.source_revision);

  const created = await saveLearningContract({
    store,
    ownerId,
    input: contractInput(),
    skillSourceLoader
  });
  assert.equal(created.saved, true);
  assert.equal(created.contract.nodes[0].id, 'core-judgment');

  const loaded = await loadLearningContract({
    store,
    ownerId,
    skill: source.skill,
    skillSourceLoader
  });
  assert.equal(loaded.found, true);
  assert.equal(loaded.revision_matches, true);
  assert.equal(loaded.etag, created.etag);

  const updated = await saveLearningContract({
    store,
    ownerId,
    input: contractInput({
      outcomes: ['A revised observable outcome.'],
      expected_etag: loaded.etag
    }),
    skillSourceLoader
  });
  assert.notEqual(updated.etag, loaded.etag);
  assert.equal(updated.contract.created_at, created.contract.created_at);

  await assert.rejects(
    saveLearningContract({
      store,
      ownerId,
      input: contractInput({ expected_etag: loaded.etag }),
      skillSourceLoader
    }),
    error => error instanceof ApiError && error.code === 'contract_conflict'
  );
});

test('rejects stale source revisions, bad anchors, and cyclic graphs', async () => {
  const store = createMemoryStateStore();
  await assert.rejects(
    saveLearningContract({
      store,
      ownerId: 'owner',
      input: contractInput({ source_revision: 'sha256:stale' }),
      skillSourceLoader
    }),
    error => error instanceof ApiError && error.code === 'source_revision_conflict'
  );

  const badAnchor = contractInput();
  badAnchor.nodes[0].source_anchors[0].file = 'references/missing.md';
  await assert.rejects(
    saveLearningContract({
      store,
      ownerId: 'owner',
      input: badAnchor,
      skillSourceLoader
    }),
    /not a readable file/
  );

  const cyclic = contractInput();
  const second = structuredClone(cyclic.nodes[0]);
  cyclic.nodes[0].prerequisites = ['second-node'];
  second.id = 'second-node';
  second.prerequisites = ['core-judgment'];
  cyclic.nodes.push(second);
  await assert.rejects(
    saveLearningContract({
      store,
      ownerId: 'owner',
      input: cyclic,
      skillSourceLoader
    }),
    /must form a DAG/
  );
});

test('marks a stored contract stale and refuses it for learner-state validation', async () => {
  const store = createMemoryStateStore();
  const ownerId = 'owner';
  await saveLearningContract({
    store,
    ownerId,
    input: contractInput(),
    skillSourceLoader
  });
  source.source_revision = 'sha256:source-rev-2';
  try {
    const stale = await loadLearningContract({
      store,
      ownerId,
      skill: source.skill,
      skillSourceLoader
    });
    assert.equal(stale.revision_matches, false);
    const loader = createLearningContractLoader({ store, ownerId, skillSourceLoader });
    await assert.rejects(loader(source.skill), error =>
      error instanceof ApiError && error.code === 'learning_contract_stale'
    );
  } finally {
    source.source_revision = 'sha256:source-rev-1';
  }
});

test('hashes the owner identifier in the private Learning Contract pathname', () => {
  const key = learningContractKey('bo-yao-private-id', source.skill);
  assert.match(key, /^learning-contract\/v1\/[a-f0-9]{64}\/ordinary-skill\.json$/);
  assert.doesNotMatch(key, /bo-yao/);
});

test('Learning Contract Action requires Bearer auth and persists a contract', async () => {
  const store = createMemoryStateStore();
  const handler = createLearningContractHandler({
    env: {
      LEARNER_STATE_API_KEY: 'secret-key',
      LEARNER_STATE_OWNER_ID: 'owner'
    },
    storeFactory: () => store,
    skillSourceLoader
  });

  const unauthorized = mockResponse();
  await handler({ method: 'GET', headers: {}, query: { skill: source.skill } }, unauthorized);
  assert.equal(unauthorized.statusCode, 401);

  const headers = { authorization: 'Bearer secret-key' };
  const putResponse = mockResponse();
  await handler({ method: 'PUT', headers, query: {}, body: contractInput() }, putResponse);
  assert.equal(putResponse.statusCode, 200);
  assert.equal(putResponse.payload.saved, true);

  const getResponse = mockResponse();
  await handler({ method: 'GET', headers, query: { skill: source.skill } }, getResponse);
  assert.equal(getResponse.statusCode, 200);
  assert.equal(getResponse.payload.found, true);
});

test('learner-state resolves the stored dynamic contract without modifying the Skill', async () => {
  const store = createMemoryStateStore();
  const env = {
    LEARNER_STATE_API_KEY: 'secret-key',
    LEARNER_STATE_OWNER_ID: 'owner'
  };
  await saveLearningContract({
    store,
    ownerId: env.LEARNER_STATE_OWNER_ID,
    input: contractInput(),
    skillSourceLoader
  });
  const handler = createLearnerStateHandler({
    env,
    storeFactory: () => store,
    skillSourceLoader
  });
  const response = mockResponse();
  await handler({
    method: 'PUT',
    headers: { authorization: 'Bearer secret-key' },
    query: {},
    body: {
      skill: source.skill,
      skill_revision: source.source_revision,
      session: {
        current_node: 'core-judgment',
        phase: 'diagnose',
        pending_question: null
      },
      nodes: {
        'core-judgment': {
          mastery: 0,
          evidence: [],
          weaknesses: [],
          last_retrieved_at: null,
          next_review_at: null
        }
      },
      suggested_next: 'core-judgment',
      expected_etag: null
    }
  }, response);
  assert.equal(response.statusCode, 200);
  assert.equal(response.payload.state.skill, source.skill);
});
