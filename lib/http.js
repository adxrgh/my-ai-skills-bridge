import crypto from 'node:crypto';

export class ApiError extends Error {
  constructor(message, statusCode = 400, code = 'bad_request') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function setPublicApiHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

export function setStateApiHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://chatgpt.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

export function requireBearer(req, expectedKey) {
  if (!expectedKey) {
    throw new ApiError(
      'Learner-state API is not configured',
      503,
      'state_not_configured'
    );
  }
  const authorization = req.headers?.authorization || '';
  const prefix = 'Bearer ';
  if (!authorization.startsWith(prefix)) {
    throw new ApiError('Bearer authentication required', 401, 'unauthorized');
  }
  const provided = authorization.slice(prefix.length);
  const expected = Buffer.from(expectedKey);
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    throw new ApiError('Invalid bearer token', 401, 'unauthorized');
  }
}

export async function readJsonBody(req, maxBytes = 256 * 1024) {
  if (req.body !== undefined) {
    const value = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (Buffer.byteLength(JSON.stringify(value), 'utf8') > maxBytes) {
      throw new ApiError('Request body is too large', 413, 'payload_too_large');
    }
    return value;
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      throw new ApiError('Request body is too large', 413, 'payload_too_large');
    }
    chunks.push(chunk);
  }
  if (!chunks.length) throw new ApiError('JSON body is required', 400);
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new ApiError('Request body must be valid JSON', 400, 'invalid_json');
  }
}

export function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  if (statusCode === 401) {
    res.setHeader('WWW-Authenticate', 'Bearer');
  }
  const payload = {
    error: error.message || 'Internal server error',
    code: error.code || 'internal_error'
  };
  return res.status(statusCode).json(payload);
}
