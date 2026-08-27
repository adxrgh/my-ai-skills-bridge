import { getAllSkills } from './lib/skills.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const skills = getAllSkills();
  const host = req.headers.host || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Agent Skills Vercel Bridge</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #333; }
    h1 { color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .card { background: #f9f9f9; padding: 15px 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e5e5; }
    code { background: #eee; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    ul { padding-left: 20px; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>⚡️ Agent Skills API Bridge</h1>
  <p>成功部署！本服务让 ChatGPT 直接读取普通 Skill，并在聊天时动态生成私有 Learning Contract 与 Learner State。</p>
  
  <div class="card">
    <h3>🔗 快速接口链接</h3>
    <ul>
      <li><b>OpenAPI 规范 (ChatGPT Actions 用)</b>: <a href="${baseUrl}/api/openapi" target="_blank"><code>${baseUrl}/api/openapi</code></a></li>
      <li><b>所有技能列表</b>: <a href="${baseUrl}/api/skills" target="_blank"><code>${baseUrl}/api/skills</code></a></li>
      <li><b>读取单个技能</b>: <a href="${baseUrl}/api/read-skill?slug=font-craft" target="_blank"><code>${baseUrl}/api/read-skill?slug=font-craft</code></a></li>
      <li><b>列出 Skill 文件</b>: <a href="${baseUrl}/api/skill-files?slug=font-craft" target="_blank"><code>${baseUrl}/api/skill-files?slug=font-craft</code></a></li>
      <li><b>读取 Skill 文件</b>: <code>${baseUrl}/api/read-skill-file?slug=font-craft&amp;path=SKILL.md</code></li>
      <li><b>Learning Contract</b>: <code>${baseUrl}/api/learning-contract?skill=&lt;skill&gt;</code>（Bearer 鉴权）</li>
      <li><b>学习状态</b>: <code>${baseUrl}/api/learner-state?skill=&lt;skill&gt;</code>（Bearer 鉴权）</li>
    </ul>
  </div>

  <div class="card">
    <h3>📦 已加载的 Skill 数量：<b>${skills.length}</b> 个</h3>
    <ul>
      ${skills.map(s => `<li><b>${s.name}</b> (<code>${s.slug}</code>): ${s.description}</li>`).join('')}
    </ul>
  </div>
</body>
</html>`;

  return res.status(200).send(html);
}
