import { getSkillDetail } from './lib/skills.js';
import { sendError, setPublicApiHeaders } from './lib/http.js';

export default function handler(req, res) {
  setPublicApiHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'method_not_allowed' });
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
    return sendError(res, error);
  }
}
