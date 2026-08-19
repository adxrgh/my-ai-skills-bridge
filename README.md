# ⚡️ My AI Skills Vercel Bridge

将本地 Agent Skills（包含 50+ 个技能如 `font-craft`、`ljg-think` 等）自动转为适配 **ChatGPT Custom GPT Actions** 与 **远程 MCP** 的全球 Serverless API。

---

## 🚀 1分钟部署到 Vercel

1. 打开 [Vercel Dashboard](https://vercel.com/new)。
2. 选择导入你的 GitHub 仓库 **`adxrgh/my-ai-skills-bridge`**。
3. 点击 **Deploy**（无需修改任何环境变量，直接部署！）。
4. 获得你的专属免费域名，例如：`https://my-ai-skills-bridge.vercel.app`

---

## 🔗 部署后可用的 API

部署成功后，你将获得以下三个标准接口：

* **OpenAPI 规范 (ChatGPT Actions 直接导入)**：
  `https://<YOUR_VERCEL_DOMAIN>/openapi.json`
* **所有技能列表**：
  `https://<YOUR_VERCEL_DOMAIN>/api/skills`
* **读取指定技能**：
  `https://<YOUR_VERCEL_DOMAIN>/api/read-skill?slug=font-craft`

---

## 🤖 在 ChatGPT 手机端 / Custom GPTs 中使用

1. 打开 [ChatGPT 网页版](https://chatgpt.com) -> **Explore GPTs** -> **+ Create**。
2. 进入 **Configure** 页，滑动到底部点击 **Actions** -> **Create new action**。
3. 在 **Schema** 框中，点击 **Import from URL**，填入你的 OpenAPI 规范地址：
   ```text
   https://<YOUR_VERCEL_DOMAIN>/openapi.json
   ```
4. 点击 **Import**，系统会自动解析出 `listSkills` 和 `readSkill` 两个 Action。
5. 在 Custom GPT 的 **Instructions** 中填入以下系统提示词：
   ```markdown
   你是一个全能技能助手。当用户提出特定需求时：
   1. 首先调用 Action 中的 `/api/skills` 获取可用技能列表与简要描述。
   2. 找到最匹配的技能名称（slug），调用 `/api/read-skill?slug=<slug>` 获取完整的技能指南与步骤。
   3. 严格按照读取到的技能指令为用户解答。
   ```
6. 点击右上角 **Save** 保存。
7. 打开手机 **ChatGPT 官方 App**，在侧边栏选择你创建的这个 GPT，即可开启全套技能对话！

---

## 🔄 本地技能同步更新

当你在本地 `~/.agents/skills/` 中添加或更新了技能后，在本项目目录下运行：

```bash
npm run sync
git add . && git commit -m "sync: update local skills" && git push
```

Vercel 会在 5 秒内完成增量部署，手机端 ChatGPT 立刻就能用到最新技能！
