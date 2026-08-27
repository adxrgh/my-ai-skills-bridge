import crypto from 'node:crypto';

import {
  BlobPreconditionFailedError,
  get as getBlob,
  put as putBlob
} from '@vercel/blob';

export class StateStoreError extends Error {
  constructor(message, code = 'state_store_error') {
    super(message);
    this.name = 'StateStoreError';
    this.code = code;
  }
}

export class StateStoreConflictError extends StateStoreError {
  constructor(message = 'Learner state changed; reload it before updating') {
    super(message, 'state_conflict');
    this.name = 'StateStoreConflictError';
  }
}

function contentEtag(content) {
  return `"${crypto.createHash('sha256').update(content).digest('hex')}"`;
}

export function createMemoryStateStore() {
  const values = new Map();
  return {
    async read(key) {
      return values.get(key) || null;
    },
    async write(key, content, { expectedEtag = null, createOnly = false } = {}) {
      const existing = values.get(key) || null;
      if (createOnly && existing) throw new StateStoreConflictError();
      if (expectedEtag && existing?.etag !== expectedEtag) {
        throw new StateStoreConflictError();
      }
      if (expectedEtag && !existing) throw new StateStoreConflictError();
      const value = { content, etag: contentEtag(content) };
      values.set(key, value);
      return { etag: value.etag };
    }
  };
}

export function createBlobStateStore({ token = process.env.BLOB_READ_WRITE_TOKEN } = {}) {
  if (!token) {
    throw new StateStoreError(
      'BLOB_READ_WRITE_TOKEN is not configured',
      'state_store_not_configured'
    );
  }
  return {
    async read(key) {
      const result = await getBlob(key, {
        access: 'private',
        token,
        useCache: false
      });
      if (!result) return null;
      if (result.statusCode !== 200 || !result.stream) {
        throw new StateStoreError('Unexpected private Blob response');
      }
      const content = await new Response(result.stream).text();
      return { content, etag: result.blob.etag };
    },
    async write(key, content, { expectedEtag = null, createOnly = false } = {}) {
      try {
        const result = await putBlob(key, content, {
          access: 'private',
          token,
          contentType: 'application/json; charset=utf-8',
          addRandomSuffix: false,
          allowOverwrite: !createOnly,
          ...(expectedEtag ? { ifMatch: expectedEtag } : {})
        });
        return { etag: result.etag };
      } catch (error) {
        if (
          error instanceof BlobPreconditionFailedError ||
          error?.statusCode === 409 ||
          /already exists|precondition/i.test(error?.message || '')
        ) {
          throw new StateStoreConflictError();
        }
        throw error;
      }
    }
  };
}
