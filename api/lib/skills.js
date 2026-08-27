import fs from 'node:fs';
import path from 'node:path';

const VALID_SLUG = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export class SkillAccessError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'SkillAccessError';
    this.statusCode = statusCode;
    this.code = 'skill_access_error';
  }
}

export function getSkillsDir() {
  return path.join(process.cwd(), 'skills');
}

export function getSkillsDirs() {
  return [getSkillsDir(), path.join(process.cwd(), 'bridge-skills')]
    .filter(directory => fs.existsSync(directory));
}

export function validateSkillSlug(slug) {
  if (typeof slug !== 'string' || !VALID_SLUG.test(slug)) {
    throw new SkillAccessError('Invalid skill slug', 400);
  }
  return slug;
}

export function getSkillRoot(slug) {
  validateSkillSlug(slug);
  for (const directory of getSkillsDirs()) {
    const skillsDir = fs.realpathSync(directory);
    const candidate = path.join(skillsDir, slug);
    if (!fs.existsSync(candidate)) continue;
    const realCandidate = fs.realpathSync(candidate);
    const relative = path.relative(skillsDir, realCandidate);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new SkillAccessError('Skill path escapes the skills directory', 400);
    }
    if (fs.statSync(realCandidate).isDirectory()) return realCandidate;
  }
  return null;
}

export function parseFrontmatter(content) {
  const result = { name: '', description: '' };
  if (!content.startsWith('---')) {
    return result;
  }
  const parts = content.split('---');
  if (parts.length < 3) return result;
  
  const frontmatter = parts[1];
  
  const nameMatch = frontmatter.match(/^name:\s*["']?(.*?)["']?\s*$/m);
  if (nameMatch) result.name = nameMatch[1].trim();
  
  const descMatch = frontmatter.match(/^description:\s*["']?(.*?)["']?\s*$/m);
  if (descMatch) result.description = descMatch[1].trim();
  
  return result;
}

export function getAllSkills() {
  const skills = new Map();
  for (const skillsDir of getSkillsDirs()) {
    const entries = fs.readdirSync(skillsDir);
    for (const entry of entries) {
      if (skills.has(entry)) continue;
      if (!VALID_SLUG.test(entry)) continue;
      const entryPath = path.join(skillsDir, entry);
      if (fs.lstatSync(entryPath).isSymbolicLink()) continue;
      const skillMdPath = path.join(skillsDir, entry, 'SKILL.md');
      if (fs.existsSync(skillMdPath)) {
        try {
          const content = fs.readFileSync(skillMdPath, 'utf-8');
          const fm = parseFrontmatter(content);
          skills.set(entry, {
            name: fm.name || entry,
            slug: entry,
            description: fm.description || 'No description provided.'
          });
        } catch (err) {
          console.error(`Error reading ${skillMdPath}:`, err);
        }
      }
    }
  }
  return [...skills.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getSkillDetail(slug) {
  const skillPath = getSkillRoot(slug);
  if (!skillPath) return null;
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  
  if (!fs.existsSync(skillMdPath)) {
    return null;
  }
  
  const content = fs.readFileSync(skillMdPath, 'utf-8');
  const fm = parseFrontmatter(content);
  
  return {
    name: fm.name || slug,
    slug,
    description: fm.description,
    content
  };
}
