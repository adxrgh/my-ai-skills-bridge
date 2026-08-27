import assert from 'node:assert/strict';
import test from 'node:test';

import { buildOpenApiSpec } from '../api/openapi.js';
import { getSkillBundleSource, listSkillFiles, readSkillFile } from '../lib/skill-files.js';
import { getAllSkills, SkillAccessError } from '../lib/skills.js';

test('lists complete Skill bundles and marks binary assets unreadable', () => {
  assert(getAllSkills().some(skill => skill.slug === 'make-skill-learnable'));
  const typography = listSkillFiles('lupton-thinking-with-type');
  assert.equal(typography.slug, 'lupton-thinking-with-type');
  assert.equal(typography.truncated, false);
  assert(typography.files.some(file => file.path === 'chapters/ch01-letter-humans-and-machines.md'));

  const video = listSkillFiles('website-to-video', { prefix: 'assets/' });
  const audio = video.files.find(file => file.path.endsWith('.mp3'));
  assert(audio);
  assert.equal(audio.readable, false);
});

test('reads text files with line pagination', () => {
  const first = readSkillFile('lupton-thinking-with-type', 'SKILL.md', {
    startLine: 1,
    lineCount: 10
  });
  assert.equal(first.start_line, 1);
  assert.equal(first.end_line, 10);
  assert.equal(first.has_more, true);
  assert.match(first.content, /name: lupton-thinking-with-type/);

  const second = readSkillFile('lupton-thinking-with-type', 'SKILL.md', {
    startLine: 11,
    lineCount: 10
  });
  assert.equal(second.start_line, 11);
  assert.notEqual(second.content, first.content);
});

test('rejects path traversal, invalid slugs, and binary reads', () => {
  assert.throws(
    () => readSkillFile('lupton-thinking-with-type', '../package.json'),
    SkillAccessError
  );
  assert.throws(
    () => listSkillFiles('../lupton-thinking-with-type'),
    SkillAccessError
  );
  assert.throws(
    () => readSkillFile('website-to-video', 'assets/sfx/click.mp3'),
    error => error instanceof SkillAccessError && error.statusCode === 415
  );
});

test('computes a stable source revision from an ordinary Skill bundle', () => {
  const first = getSkillBundleSource('lupton-thinking-with-type');
  const second = getSkillBundleSource('lupton-thinking-with-type');
  assert.match(first.source_revision, /^sha256:[a-f0-9]{64}$/);
  assert.equal(first.source_revision, second.source_revision);
  assert(first.readable_files.includes('SKILL.md'));
});

test('OpenAPI advertises dynamic contracts, learner state, and Bearer auth', () => {
  const spec = buildOpenApiSpec('https://example.test');
  assert.equal(spec.openapi, '3.1.0');
  assert.equal(spec.info.version, '3.0.0');
  assert.equal(spec.paths['/api/skill-files'].get.operationId, 'listSkillFiles');
  assert.equal(spec.paths['/api/read-skill-file'].get.operationId, 'readSkillFile');
  assert.equal(spec.paths['/api/learning-contract'].get.operationId, 'getLearningContract');
  assert.equal(spec.paths['/api/learning-contract'].put.operationId, 'updateLearningContract');
  assert.equal(spec.components.schemas.LearningContractUpdate.type, 'object');
  assert.equal(spec.components.schemas.LearningContractUpdate.allOf, undefined);
  assert.equal(spec.paths['/api/learner-state'].get.operationId, 'getLearnerState');
  assert.equal(spec.paths['/api/learner-state'].put.operationId, 'updateLearnerState');
  assert.equal(spec.components.securitySchemes.bearerAuth.scheme, 'bearer');
});
