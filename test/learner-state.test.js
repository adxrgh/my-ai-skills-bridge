import assert from 'node:assert/strict';
import test from 'node:test';

import { createLearnerStateHandler } from '../api/learner-state.js';
import { ApiError } from '../api/lib/http.js';
import {
  learnerStateKey,
  loadLearnerState,
  saveLearnerState
} from '../api/lib/learner-state.js';
import { createMemoryStateStore } from '../api/lib/learner-state-store.js';

const learningMap = {
  schema_version: 1,
  skill: 'typography-learning',
  skill_revision: 'rev-1',
  nodes: [
    { id: 'contrast', prerequisites: [] },
    { id: 'hierarchy', prerequisites: ['contrast'] }
  ]
};
const learningContractLoader = skill => {
  if (skill !== learningMap.skill) throw new ApiError('Skill not found', 404);
  return learningMap;
};

function updateInput(overrides = {}) {
  return {
    skill: learningMap.skill,
    skill_revision: learningMap.skill_revision,
    session: {
      current_node: 'hierarchy',
      phase: 'challenge',
      pending_question: null
    },
    nodes: {
      hierarchy: {
        mastery: 3,
        evidence: [{
          kind: 'application',
          result: 'pass',
          response_summary: 'Diagnosed the hierarchy conflict and justified a repair.',
          recorded_at: '2026-08-27T10:00:00.000Z'
        }],
        weaknesses: ['Overweights font size'],
        last_retrieved_at: null,
        next_review_at: null
      }
    },
    suggested_next: 'hierarchy',
    expected_etag: null,
    ...overrides
  };
}

test('creates, reads, and conditionally updates learner state', async () => {
  const store = createMemoryStateStore();
  const ownerId = 'private-owner';
  const created = await saveLearnerState({
    store,
    ownerId,
    input: updateInput(),
    learningContractLoader
  });
  assert.equal(created.saved, true);
  assert.equal(created.state.learner_id, ownerId);
  assert.equal(created.state.nodes.hierarchy.mastery, 3);

  const loaded = await loadLearnerState({
    store,
    ownerId,
    skill: learningMap.skill,
    learningContractLoader
  });
  assert.equal(loaded.found, true);
  assert.equal(loaded.etag, created.etag);
  assert.equal(loaded.skill_revision, learningMap.skill_revision);
  assert.equal(loaded.revision_matches, true);

  const updated = await saveLearnerState({
    store,
    ownerId,
    input: updateInput({ expected_etag: loaded.etag, suggested_next: 'contrast' }),
    learningContractLoader
  });
  assert.notEqual(updated.etag, loaded.etag);
  assert.equal(updated.state.suggested_next, 'contrast');

  await assert.rejects(
    saveLearnerState({
      store,
      ownerId,
      input: updateInput({ expected_etag: loaded.etag }),
      learningContractLoader
    }),
    error => error instanceof ApiError && error.statusCode === 409
  );
});

test('requires mastery evidence and known learning-map nodes', async () => {
  const store = createMemoryStateStore();
  const unsupportedTransfer = updateInput();
  unsupportedTransfer.nodes.hierarchy.mastery = 4;
  await assert.rejects(
    saveLearnerState({
      store,
      ownerId: 'owner',
      input: unsupportedTransfer,
      learningContractLoader
    }),
    /mastery is not supported by recorded evidence/
  );

  const unknownNode = updateInput({
    nodes: {
      invented: {
        mastery: 0,
        evidence: [],
        weaknesses: [],
        last_retrieved_at: null,
        next_review_at: null
      }
    }
  });
  await assert.rejects(
    saveLearnerState({
      store,
      ownerId: 'owner',
      input: unknownNode,
      learningContractLoader
    }),
    /unknown node/
  );

  const unsupportedFamiliarity = updateInput();
  unsupportedFamiliarity.nodes.hierarchy.mastery = 1;
  unsupportedFamiliarity.nodes.hierarchy.evidence = [];
  await assert.rejects(
    saveLearnerState({
      store,
      ownerId: 'owner',
      input: unsupportedFamiliarity,
      learningContractLoader
    }),
    /mastery is not supported by recorded evidence/
  );
});

test('hashes the owner identifier in the private Blob pathname', () => {
  const key = learnerStateKey('bo-yao-private-id', learningMap.skill);
  assert.match(key, /^learner-state\/v1\/[a-f0-9]{64}\/typography-learning\.json$/);
  assert.doesNotMatch(key, /bo-yao/);
});

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

test('learner-state Action requires Bearer authentication', async () => {
  const handler = createLearnerStateHandler({
    env: {
      LEARNER_STATE_API_KEY: 'secret-key',
      LEARNER_STATE_OWNER_ID: 'owner'
    },
    storeFactory: () => createMemoryStateStore(),
    learningContractLoader
  });
  const response = mockResponse();
  await handler({ method: 'GET', headers: {}, query: { skill: learningMap.skill } }, response);
  assert.equal(response.statusCode, 401);
  assert.equal(response.payload.code, 'unauthorized');
  assert.equal(response.headers['www-authenticate'], 'Bearer');
});

test('learner-state Action creates and reads state with the configured owner', async () => {
  const store = createMemoryStateStore();
  const handler = createLearnerStateHandler({
    env: {
      LEARNER_STATE_API_KEY: 'secret-key',
      LEARNER_STATE_OWNER_ID: 'owner-from-server'
    },
    storeFactory: () => store,
    learningContractLoader
  });
  const headers = {
    authorization: 'Bearer secret-key',
    'content-type': 'application/json'
  };
  const putResponse = mockResponse();
  await handler({
    method: 'PUT',
    headers,
    query: {},
    body: updateInput()
  }, putResponse);
  assert.equal(putResponse.statusCode, 200);
  assert.equal(putResponse.payload.state.learner_id, 'owner-from-server');

  const getResponse = mockResponse();
  await handler({
    method: 'GET',
    headers,
    query: { skill: learningMap.skill }
  }, getResponse);
  assert.equal(getResponse.statusCode, 200);
  assert.equal(getResponse.payload.found, true);
  assert.equal(getResponse.payload.etag, putResponse.payload.etag);
});
