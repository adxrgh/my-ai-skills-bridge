import { ApiError, readJsonBody, requireBearer, sendError, setStateApiHeaders } from './lib/http.js';
import { loadLearnerState, saveLearnerState } from './lib/learner-state.js';
import { createBlobStateStore, StateStoreError } from './lib/learner-state-store.js';

export function createLearnerStateHandler({
  env = process.env,
  storeFactory = () => createBlobStateStore({ token: env.BLOB_READ_WRITE_TOKEN }),
  learningContractLoader
} = {}) {
  return async function handler(req, res) {
    setStateApiHeaders(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
      requireBearer(req, env.LEARNER_STATE_API_KEY);
      const ownerId = env.LEARNER_STATE_OWNER_ID;
      if (!ownerId) {
        throw new ApiError(
          'LEARNER_STATE_OWNER_ID is not configured',
          503,
          'state_not_configured'
        );
      }
      const store = storeFactory();

      if (req.method === 'GET') {
        const { skill } = req.query;
        if (!skill) throw new ApiError('Missing required query parameter: skill', 400);
        return res.status(200).json(
          await loadLearnerState({ store, ownerId, skill, learningContractLoader })
        );
      }

      if (req.method === 'PUT') {
        const input = await readJsonBody(req);
        return res.status(200).json(
          await saveLearnerState({ store, ownerId, input, learningContractLoader })
        );
      }

      return res.status(405).json({ error: 'Method not allowed', code: 'method_not_allowed' });
    } catch (error) {
      if (error instanceof SyntaxError) {
        return sendError(res, new ApiError('Request body must be valid JSON', 400, 'invalid_json'));
      }
      if (error instanceof StateStoreError) {
        return sendError(
          res,
          new ApiError(error.message, 503, error.code || 'state_store_error')
        );
      }
      return sendError(res, error);
    }
  };
}

export default createLearnerStateHandler();
