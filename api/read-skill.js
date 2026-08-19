import { getSkillDetail } from './lib/skills.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name, slug } = req.query;
  const target = slug || name;

  if (!target) {
    return res.status(400).json({ error: 'Missing required query parameter: name or slug' });
  }

  try {
    const skill = getSkillDetail(target);
    if (!skill) {
      return res.status(404).json({ error: `Skill "${target}" not found` });
    }
    return res.status(200).json(skill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
