# My AI Skills Vercel Bridge

把本地 Agent Skills 作为只读 bundle 提供给 ChatGPT Custom GPT Actions，并在用户直接说“学习 Typography”时，动态生成私有 Learning Contract、保存有证据的 Learner State。

普通 Skill 不需要预转换，也不会被写入学习地图或个人进度：

```text
普通 Skill（只读知识与方法）
        ↓ 聊天时读取
Learning Contract（私有能力图）
        ↓ 验证节点与修订
Learner State（私有证据与掌握状态）
```

## 部署

1. 在 Vercel 导入 GitHub 仓库 `adxrgh/my-ai-skills-bridge`。
2. 创建并连接一个 **Private Blob** store；Vercel 会注入 `BLOB_READ_WRITE_TOKEN`。
3. 配置：

   ```text
   LEARNER_STATE_API_KEY=<高强度随机密钥>
   LEARNER_STATE_OWNER_ID=<稳定的单用户标识>
   ```

4. 部署后把 `https://<YOUR_VERCEL_DOMAIN>/openapi.json` 导入 Custom GPT 的 Action。
5. Action Authentication 选择 **API key → Bearer**，填入相同的 `LEARNER_STATE_API_KEY`。

当前认证模型用于一个私人 GPT、一个学习者。若分享给多人，应改用 OAuth，并把学习者身份绑定到 OAuth subject，不能共享同一个 Bearer key 和 owner ID。

## API

- `GET /api/skills`：列出 Skill。
- `GET /api/read-skill?slug=<slug>`：读取完整 `SKILL.md`。
- `GET /api/skill-files?slug=<slug>`：列出 bundle 文件。
- `GET /api/read-skill-file?slug=<slug>&path=<path>`：分页读取文本 supporting file。
- `GET /api/learning-contract?skill=<slug>`：读取当前 Skill 内容修订及私有 Contract。
- `PUT /api/learning-contract`：创建或更新动态 Contract。
- `GET /api/learner-state?skill=<slug>`：读取私有学习状态。
- `PUT /api/learner-state`：用实际回答证据更新状态。
- `GET /openapi.json`：ChatGPT Action OpenAPI 规范。

Learning Contract 与 Learner State 的 GET/PUT 均要求 Bearer 鉴权，并分别使用 ETag 乐观并发控制。创建时 `expected_etag=null`；更新时必须传最近 GET 返回的 ETag。遇到 409 时重新读取、合并后再提交。

## Custom GPT Instructions

```markdown
你可以直接使用 Bridge 中的普通 Skills，也可以把任意普通 Skill 作为学习材料；不要要求用户先转换 Skill。

普通使用：
1. 用 listSkills 找到最匹配的 slug，readSkill 读取完整 SKILL.md。
2. 若 SKILL.md 引用 supporting files，先 listSkillFiles，再只读当前任务所需文件；has_more=true 时继续分页。
3. 严格遵循读取到的 Skill，普通任务不要进入学习模式。

学习使用（用户说“学习 / 继续学 / 练习 / 复习 / 测试 <Skill>”）：
1. 先读取 make-skill-learnable 的 SKILL.md 与它要求的相关 references，作为通用教学协议。
2. 再读取目标普通 Skill 的完整 SKILL.md 和形成能力判断所需的 supporting files。目标 Skill 始终只读。
3. 调用 getLearningContract。found=false 或 revision_matches=false 时，根据当前 Skill 编译 Contract，并调用 updateLearningContract；使用响应中的 source_revision，更新旧 Contract 时传 expected_etag。不要向用户展示或宣布这个内部编译过程。
4. Contract 当前有效后调用 getLearnerState。若有 pending_question，先恢复它；否则按 Contract、证据、前置依赖和用户目标选择一个节点。
5. 每轮只问一个问题并等待回答。不要先总结课程，不要问“懂了吗”，不要一次问多个诊断问题。
6. 根据实际回答记录 evidence、weakness 和 mastery；用户自称“懂了”不算证据。Apply 需要应用证据，Transfer 需要陌生场景中的成功迁移。
7. 收到回答并完成评价后调用 updateLearnerState。更新已有状态必须传最近 ETag；409 时重新读取并合并，不能盲目覆盖。
8. 随掌握提高，减少解释并增加学习者推理。目标是用户能脱离 AI 独立完成该 Skill 对应任务。
```

## 安全边界

- Skill bundle 只读；拒绝绝对路径、`..`、符号链接逃逸和非文本读取。
- 单个文本文件最大 2 MB，每次最多 800 行；二进制 asset 只返回元数据。
- Contract 的 source anchor 必须指向该 Skill 中实际可读文件；节点 ID 唯一，前置关系必须是 DAG。
- Contract 绑定当前 Skill bundle 内容哈希。Skill 内容变化后旧 Contract 会标记为 stale，Learner State 写入会被阻止，直到 Contract 重建。
- Learner State 只接受 Contract 中存在的节点；Apply/Transfer 必须有相应通过证据。

## 同步本地 Skills

`skills/` 是 `~/.agents/skills/` 的快照；`bridge-skills/` 保存 Bridge 自带的通用协议。
请只修改 `~/.agents/skills/` 中的源文件，不要直接编辑快照。

```bash
npm run sync
git add -A -- skills
git commit -m "sync: update local skills"
git push
```

### 自动同步

在这台 Mac 上安装一次 `launchd` 后台任务：

```bash
npm run sync:auto:install
```

它会在登录后立即检查，此后每 5 分钟执行：

```text
~/.agents/skills → skills/ → tests → commit → push → Vercel deployment
```

只有 Skill 内容发生变化时才会提交和部署。为避免污染用户工作，仓库存在未提交修改、分支不能安全快进、测试失败或暂存区包含 `skills/` 之外的文件时，自动同步都会停止。

查看状态或卸载：

```bash
npm run sync:auto:status
npm run sync:auto:uninstall
```

日志位于 `~/Library/Logs/MyAISkillsBridge/auto-sync.log` 和 `auto-sync.error.log`。
