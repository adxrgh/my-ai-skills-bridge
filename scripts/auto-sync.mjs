import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const remote = process.env.SKILLS_SYNC_REMOTE || 'origin';
const commitMessage = 'sync: automatic local skills update';
const lockId = crypto.createHash('sha256').update(repoDir).digest('hex').slice(0, 12);
const lockDir = path.join(os.tmpdir(), `my-ai-skills-bridge-sync-${lockId}.lock`);
const staleLockMs = 15 * 60 * 1000;

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: repoDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function git(args) {
  return run('/usr/bin/git', args);
}

function acquireLock() {
  try {
    fs.mkdirSync(lockDir);
    return true;
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;

    const age = Date.now() - fs.statSync(lockDir).mtimeMs;
    if (age <= staleLockMs) {
      log('已有同步任务正在运行，本次跳过。');
      return false;
    }

    fs.rmSync(lockDir, { recursive: true, force: true });
    fs.mkdirSync(lockDir);
    log('已清理超过 15 分钟的过期同步锁。');
    return true;
  }
}

function releaseLock() {
  fs.rmSync(lockDir, { recursive: true, force: true });
}

function ensureOnlyAutomaticCommits(remoteRef) {
  const subjects = git(['log', '--format=%s', `${remoteRef}..HEAD`])
    .split('\n')
    .filter(Boolean);
  const files = git(['diff', '--name-only', `${remoteRef}..HEAD`])
    .split('\n')
    .filter(Boolean);

  return (
    subjects.length > 0 &&
    subjects.every((subject) => subject === commitMessage) &&
    files.length > 0 &&
    files.every((file) => file === 'skills' || file.startsWith('skills/'))
  );
}

function isAncestor(ancestor, descendant) {
  try {
    git(['merge-base', '--is-ancestor', ancestor, descendant]);
    return true;
  } catch {
    return false;
  }
}

function reconcileRemote(branch) {
  const remoteRef = `refs/remotes/${remote}/${branch}`;
  git(['fetch', '--quiet', remote, branch]);

  let head = git(['rev-parse', 'HEAD']);
  let remoteHead = git(['rev-parse', remoteRef]);
  if (head === remoteHead) return;

  if (isAncestor(head, remoteRef)) {
    git(['merge', '--ff-only', remoteRef]);
    log(`已快进到 ${remote}/${branch} 的最新版本。`);
    return;
  }

  if (isAncestor(remoteRef, head) && ensureOnlyAutomaticCommits(remoteRef)) {
    log('发现上次尚未送达的自动同步提交，正在重试推送。');
    git(['push', remote, `HEAD:${branch}`]);
    git(['fetch', '--quiet', remote, branch]);
    head = git(['rev-parse', 'HEAD']);
    remoteHead = git(['rev-parse', remoteRef]);
    if (head === remoteHead) return;
  }

  throw new Error(
    `本地 ${branch} 与 ${remote}/${branch} 不一致，且不能安全自动处理；请先手动整理分支。`,
  );
}

function testFiles() {
  return fs
    .readdirSync(path.join(repoDir, 'test'))
    .filter((name) => name.endsWith('.test.js'))
    .sort()
    .map((name) => path.join('test', name));
}

function main() {
  if (!acquireLock()) return;

  try {
    log('开始检查本地 Skills。');

    const status = git(['status', '--porcelain', '--untracked-files=all']);
    if (status) {
      throw new Error('仓库存在未提交修改；为避免混入用户工作，本次自动同步已停止。');
    }

    const branch = git(['branch', '--show-current']);
    if (!branch) throw new Error('当前处于 detached HEAD，不能自动同步。');

    reconcileRemote(branch);
    run(process.execPath, [path.join('scripts', 'sync.mjs')], { stdio: 'inherit' });

    const skillStatus = git([
      'status',
      '--porcelain',
      '--untracked-files=all',
      '--',
      'skills',
    ]);
    if (!skillStatus) {
      log('Skills 没有变化，无需部署。');
      return;
    }

    const tests = testFiles();
    log(`发现 Skill 更新，运行 ${tests.length} 个测试文件。`);
    run(process.execPath, ['--test', ...tests], { stdio: 'inherit' });

    git(['add', '-A', '--', 'skills']);
    const stagedFiles = git(['diff', '--cached', '--name-only'])
      .split('\n')
      .filter(Boolean);
    if (
      stagedFiles.length === 0 ||
      stagedFiles.some((file) => file !== 'skills' && !file.startsWith('skills/'))
    ) {
      throw new Error('暂存区包含 skills/ 之外的文件，已停止自动提交。');
    }

    git(['commit', '-m', commitMessage]);
    git(['push', remote, `HEAD:${branch}`]);
    log(`已推送 ${stagedFiles.length} 个 Skill 文件变更，Vercel 将自动部署。`);
  } finally {
    releaseLock();
  }
}

try {
  main();
} catch (error) {
  const stderr = error?.stderr?.toString().trim();
  const stdout = error?.stdout?.toString().trim();
  console.error(`[${new Date().toISOString()}] 自动同步失败：${error.message}`);
  if (stdout) console.error(stdout);
  if (stderr) console.error(stderr);
  process.exitCode = 1;
}
