import { getAllSkills } from './lib/skills.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const skills = getAllSkills();
    return res.status(200).json({
      total: skills.length,
      skills
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
