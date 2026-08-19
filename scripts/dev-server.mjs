import http from 'node:http';
import url from 'node:url';

import indexHandler from '../api/index.js';
import skillsHandler from '../api/skills.js';
import readSkillHandler from '../api/read-skill.js';
import openapiHandler from '../api/openapi.js';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  req.query = parsedUrl.query;

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
