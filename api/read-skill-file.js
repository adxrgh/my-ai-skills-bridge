import { readSkillFile } from './lib/skill-files.js';
import { sendError, setPublicApiHeaders } from './lib/http.js';

export default function handler(req, res) {
  setPublicApiHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'method_not_allowed' });
  }

  const { slug, path, start_line = 1, line_count = 300 } = req.query;
  if (!slug || !path) {
    return res.status(400).json({
      error: 'Missing required query parameters: slug and path'
    });
  }
  try {
    const result = readSkillFile(slug, path, {
      startLine: start_line,
      lineCount: line_count
    });
    if (!result) {
      return res.status(404).json({ error: `Skill file "${slug}/${path}" not found` });
    }
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}
