import fs from 'node:fs';
import path from 'node:path';

import { getSkillRoot, SkillAccessError } from './skills.js';

const TEXT_EXTENSIONS = new Set([
  '.c', '.cc', '.cpp', '.css', '.csv', '.h', '.hpp', '.html', '.ini', '.java',
  '.js', '.json', '.jsx', '.kt', '.md', '.mjs', '.mm', '.org', '.php', '.plist',
  '.properties', '.py', '.rb', '.rs', '.sh', '.sql', '.svg', '.swift', '.toml',
  '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml', '.zsh'
]);
const TEXT_BASENAMES = new Set(['LICENSE', 'NOTICE', 'Makefile']);
const SKIPPED_DIRECTORIES = new Set(['.git', 'node_modules', '__pycache__']);
const MAX_FILES = 1000;
const MAX_TEXT_FILE_BYTES = 2 * 1024 * 1024;
const DEFAULT_LINE_COUNT = 300;
const MAX_LINE_COUNT = 800;

function isTextFile(filePath) {
  return TEXT_BASENAMES.has(path.basename(filePath)) ||
    TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function normalizeRelativePath(input, { allowEmpty = false } = {}) {
  if (typeof input !== 'string' || input.includes('\0') || path.isAbsolute(input)) {
    throw new SkillAccessError('Invalid skill file path', 400);
  }
  const normalized = input.replaceAll('\\', '/').replace(/^\.\//, '');
  const parts = normalized.split('/');
  if ((!allowEmpty && !normalized) || parts.some(part => part === '..' || part === '.')) {
    throw new SkillAccessError('Invalid skill file path', 400);
  }
  return normalized;
}

function resolveFileWithinSkill(slug, relativePath) {
  const root = getSkillRoot(slug);
  if (!root) return null;
  const normalized = normalizeRelativePath(relativePath);
  const candidate = path.join(root, ...normalized.split('/'));
  if (!fs.existsSync(candidate)) return null;
  const stats = fs.lstatSync(candidate);
  if (stats.isSymbolicLink() || !stats.isFile()) return null;
  const realCandidate = fs.realpathSync(candidate);
  const relative = path.relative(root, realCandidate);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new SkillAccessError('Skill file path escapes the Skill directory', 400);
  }
  return { root, filePath: realCandidate, relativePath: normalized, stats };
}

export function listSkillFiles(slug, { prefix = '' } = {}) {
  const root = getSkillRoot(slug);
  if (!root) return null;
  const normalizedPrefix = normalizeRelativePath(prefix, { allowEmpty: true });
  const files = [];
  let truncated = false;

  function walk(directory) {
    if (truncated) return;
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (files.length >= MAX_FILES) {
        truncated = true;
        return;
      }
      if (entry.name === '.DS_Store') continue;
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRECTORIES.has(entry.name)) walk(absolute);
        continue;
      }
      if (!entry.isFile()) continue;
      if (normalizedPrefix) {
        const prefixWithSlash = normalizedPrefix.endsWith('/')
          ? normalizedPrefix
          : `${normalizedPrefix}/`;
        if (relative !== normalizedPrefix && !relative.startsWith(prefixWithSlash)) continue;
      }
      const stats = fs.statSync(absolute);
      files.push({
        path: relative,
        size: stats.size,
        readable: isTextFile(relative) && stats.size <= MAX_TEXT_FILE_BYTES
      });
    }
  }

  walk(root);
  return { slug, prefix: normalizedPrefix, files, truncated };
}

export function readSkillFile(
  slug,
  relativePath,
  { startLine = 1, lineCount = DEFAULT_LINE_COUNT } = {}
) {
  const resolved = resolveFileWithinSkill(slug, relativePath);
  if (!resolved) return null;
  if (!isTextFile(resolved.relativePath)) {
    throw new SkillAccessError('This file type is not readable as text', 415);
  }
  if (resolved.stats.size > MAX_TEXT_FILE_BYTES) {
    throw new SkillAccessError('Skill text file exceeds the 2 MB read limit', 413);
  }

  const safeStart = Number.parseInt(startLine, 10);
  const safeCount = Number.parseInt(lineCount, 10);
  if (!Number.isInteger(safeStart) || safeStart < 1) {
    throw new SkillAccessError('start_line must be a positive integer', 400);
  }
  if (!Number.isInteger(safeCount) || safeCount < 1 || safeCount > MAX_LINE_COUNT) {
    throw new SkillAccessError(`line_count must be between 1 and ${MAX_LINE_COUNT}`, 400);
  }

  const text = fs.readFileSync(resolved.filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const startIndex = Math.min(safeStart - 1, lines.length);
  const selected = lines.slice(startIndex, startIndex + safeCount);
  const endLine = selected.length ? startIndex + selected.length : startIndex;

  return {
    slug,
    path: resolved.relativePath,
    start_line: safeStart,
    end_line: endLine,
    total_lines: lines.length,
    has_more: endLine < lines.length,
    content: selected.join('\n')
  };
}

export function getLearningMap(slug) {
  const resolved = resolveFileWithinSkill(slug, 'references/learning-map.json');
  if (!resolved) return null;
  if (resolved.stats.size > MAX_TEXT_FILE_BYTES) {
    throw new SkillAccessError('The Skill learning map exceeds the 2 MB read limit', 413);
  }
  try {
    return JSON.parse(fs.readFileSync(resolved.filePath, 'utf8'));
  } catch {
    throw new SkillAccessError('The Skill learning map is not valid JSON', 422);
  }
}
