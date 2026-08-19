import fs from 'node:fs';
import path from 'node:path';

export function getSkillsDir() {
  return path.join(process.cwd(), 'skills');
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
  const skillsDir = getSkillsDir();
  if (!fs.existsSync(skillsDir)) return [];
  
  const entries = fs.readdirSync(skillsDir);
  const skills = [];
  
  for (const entry of entries) {
    const skillMdPath = path.join(skillsDir, entry, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      try {
        const content = fs.readFileSync(skillMdPath, 'utf-8');
        const fm = parseFrontmatter(content);
        skills.push({
          name: fm.name || entry,
          slug: entry,
          description: fm.description || 'No description provided.'
        });
      } catch (err) {
        console.error(`Error reading ${skillMdPath}:`, err);
      }
    }
  }
  
  return skills;
}

export function getSkillDetail(slug) {
  const skillsDir = getSkillsDir();
  const skillPath = path.join(skillsDir, slug);
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
