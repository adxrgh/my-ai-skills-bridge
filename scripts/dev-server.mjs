import http from 'node:http';

import indexHandler from '../api/index.js';
import skillsHandler from '../api/skills.js';
import readSkillHandler from '../api/read-skill.js';
import skillFilesHandler from '../api/skill-files.js';
import readSkillFileHandler from '../api/read-skill-file.js';
import learnerStateHandler from '../api/learner-state.js';
import openapiHandler from '../api/openapi.js';

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  req.query = Object.fromEntries(parsedUrl.searchParams.entries());

  // Mock Vercel res helper
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data, null, 2));
  };
  res.send = (data) => {
    res.end(data);
  };

  const pathname = parsedUrl.pathname;
  console.log(`${req.method} ${pathname}`);

  if (pathname === '/' || pathname === '/index.html') {
    return indexHandler(req, res);
  } else if (pathname === '/api/skills' || pathname === '/skills') {
    return skillsHandler(req, res);
  } else if (pathname === '/api/read-skill' || pathname === '/read-skill') {
    return readSkillHandler(req, res);
  } else if (pathname === '/api/skill-files' || pathname === '/skill-files') {
    return skillFilesHandler(req, res);
  } else if (pathname === '/api/read-skill-file' || pathname === '/read-skill-file') {
    return readSkillFileHandler(req, res);
  } else if (pathname === '/api/learner-state' || pathname === '/learner-state') {
    return learnerStateHandler(req, res);
  } else if (pathname === '/api/openapi' || pathname === '/openapi.json') {
    return openapiHandler(req, res);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Development server running at http://localhost:${PORT}`);
});
