# ⚡️ My AI Skills Vercel Bridge

将本地 Agent Skills 自动转为适配 **ChatGPT Custom GPT Actions** 的全球 Serverless API。Bridge 支持渐进读取完整 Skill bundle，并可为已改造成学习模式的 Skill 保存独立、私有、带证据的 Learner State。

---

## 🚀 1分钟部署到 Vercel

1. 打开 [Vercel Dashboard](https://vercel.com/new)。
2. 选择导入你的 GitHub 仓库 **`adxrgh/my-ai-skills-bridge`**。
3. 只使用 Skill 读取功能时可以直接 Deploy。若要启用 Learner State，按下文配置 Private Blob 与环境变量。
4. 获得你的专属免费域名，例如：`https://my-ai-skills-bridge.vercel.app`

---

## 🔗 部署后可用的 API

部署成功后，你将获得以下接口：

* **OpenAPI 规范 (ChatGPT Actions 直接导入)**：
  `https://<YOUR_VERCEL_DOMAIN>/openapi.json`
* **所有技能列表**：
  `https://<YOUR_VERCEL_DOMAIN>/api/skills`
* **读取指定技能**：
  `https://<YOUR_VERCEL_DOMAIN>/api/read-skill?slug=font-craft`
* **列出 Skill supporting files**：
  `https://<YOUR_VERCEL_DOMAIN>/api/skill-files?slug=font-craft`
* **分页读取 supporting file**：
  `https://<YOUR_VERCEL_DOMAIN>/api/read-skill-file?slug=font-craft&path=references/example.md`
* **读取或更新 Learner State（Bearer 鉴权）**：
  `https://<YOUR_VERCEL_DOMAIN>/api/learner-state?skill=<learnable-skill>`

---

## 🤖 在 ChatGPT 手机端 / Custom GPTs 中使用

1. 打开 [ChatGPT 网页版](https://chatgpt.com) -> **Explore GPTs** -> **+ Create**。
2. 进入 **Configure** 页，滑动到底部点击 **Actions** -> **Create new action**。
3. 在 **Schema** 框中，点击 **Import from URL**，填入你的 OpenAPI 规范地址：
   ```text
   https://<YOUR_VERCEL_DOMAIN>/openapi.json
   ```
4. 点击 **Import**，系统会解析出 Skill 发现、完整文件读取和 Learner State Actions。
5. 在 Action 的 Authentication 中选择 **API key → Bearer**，填入与 Vercel `LEARNER_STATE_API_KEY` 相同的密钥。只读 Skill 接口会忽略该 Header。
6. 在 Custom GPT 的 **Instructions** 中填入以下系统提示词：
   ```markdown
   你是一个全能技能助手。当用户提出特定需求时：
   1. 首先调用 Action 中的 `/api/skills` 获取可用技能列表与简要描述。
   2. 找到最匹配的技能名称（slug），调用 `/api/read-skill?slug=<slug>` 获取完整的技能指南与步骤。
   3. 如果 SKILL.md 引用 supporting files，先调用 listSkillFiles，再只读取当前任务所需文件；has_more=true 时继续分页，直到读完所需文件。
   4. 学习模式开始时调用 getLearnerState。每次只问一个问题；收到回答并形成证据后才调用 updateLearnerState。
   5. 更新已有状态时必须传回最近一次读取到的 expected_etag；409 时重新读取，合并证据后再提交，不能盲目覆盖。
   6. 严格按照读取到的技能指令为用户解答。
   ```
7. 点击右上角 **Save** 保存。
8. 打开手机 **ChatGPT 官方 App**，在侧边栏选择你创建的这个 GPT，即可开启全套技能对话！

## 🧠 Learner State 存储

Learner State 使用 Vercel Private Blob。它不会写入 Skill 目录，也不会允许 GPT 修改 canonical Skill。

1. 在 Vercel 项目中打开 **Storage → Create Database → Blob**。
2. 创建 **Private** store 并连接 Production/Preview 环境。Vercel 会注入 `BLOB_READ_WRITE_TOKEN`。
3. 在项目环境变量中添加：

   ```text
   LEARNER_STATE_API_KEY=<高强度随机密钥>
   LEARNER_STATE_OWNER_ID=<稳定但无需公开的单用户标识>
   ```

4. 重新部署后，在 Custom GPT Action 中配置相同的 Bearer key。

当前认证模型面向一个私人 GPT、一个学习者。若将 GPT 分享给多人，必须升级为 OAuth，并把学习者身份绑定到 OAuth subject；不能让多人共享一个 Bearer key 与 owner ID。

状态更新采用 ETag 乐观并发控制：创建时 `expected_etag=null`；更新前先 GET，并把返回的 ETag 原样放进 `expected_etag`。409 表示另一个会话已更新，调用方必须重新读取和合并。

## 🔐 Skill 文件边界

- Skill bundle 是只读的。
- 路径必须来自 `listSkillFiles`，拒绝绝对路径、`..`、符号链接逃逸和非文本读取。
- 单个文本文件最大 2 MB；每次最多返回 800 行。
- 二进制 assets 只列出元数据，不通过 Action 返回内容。
- Learner State 仅接受能力图谱中存在的节点；Apply/Transfer 等级必须有相应的通过证据。

---

## 🔄 本地技能同步更新

`skills/` 是 `~/.agents/skills/` 的批量快照；`bridge-skills/` 保存只为本 bridge 明确发布的 Skill。`npm run sync` 只重建前者，不会删除后者。

当你在本地 `~/.agents/skills/` 中添加或更新了技能后，在本项目目录下运行：

```bash
npm run sync
git add . && git commit -m "sync: update local skills" && git push
```

Vercel 会在 5 秒内完成增量部署，手机端 ChatGPT 立刻就能用到最新技能！
