import { getAllSkills } from './lib/skills.js';
import { sendError, setPublicApiHeaders } from './lib/http.js';

export default function handler(req, res) {
  setPublicApiHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'method_not_allowed' });
  }

  try {
    const skills = getAllSkills();
    return res.status(200).json({
      total: skills.length,
      skills
    });
  } catch (error) {
    return sendError(res, error);
  }
}
