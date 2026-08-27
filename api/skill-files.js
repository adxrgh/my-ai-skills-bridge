import { listSkillFiles } from './lib/skill-files.js';
import { sendError, setPublicApiHeaders } from './lib/http.js';

export default function handler(req, res) {
  setPublicApiHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'method_not_allowed' });
  }

  const { slug, prefix = '' } = req.query;
  if (!slug) {
    return res.status(400).json({ error: 'Missing required query parameter: slug' });
  }
  try {
    const result = listSkillFiles(slug, { prefix });
    if (!result) return res.status(404).json({ error: `Skill "${slug}" not found` });
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}
