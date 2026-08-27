import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const label = 'com.boyao.my-ai-skills-bridge.skill-sync';
const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plistPath = path.join(os.homedir(), 'Library', 'LaunchAgents', `${label}.plist`);
const logDir = path.join(os.homedir(), 'Library', 'Logs', 'MyAISkillsBridge');
const domain = `gui/${process.getuid()}`;
const service = `${domain}/${label}`;

function launchctl(args, { allowFailure = false, inherit = false } = {}) {
  const result = spawnSync('/bin/launchctl', args, {
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  });
  if (!allowFailure && result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`launchctl ${args[0]} 失败${detail ? `：${detail}` : ''}`);
  }
  return result;
}

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function plist() {
  const node = xmlEscape(process.execPath);
  const runner = xmlEscape(path.join(repoDir, 'scripts', 'auto-sync.mjs'));
  const cwd = xmlEscape(repoDir);
  const stdout = xmlEscape(path.join(logDir, 'auto-sync.log'));
  const stderr = xmlEscape(path.join(logDir, 'auto-sync.error.log'));

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${label}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${node}</string>
    <string>${runner}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${cwd}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>StartInterval</key>
  <integer>300</integer>
  <key>ThrottleInterval</key>
  <integer>60</integer>
  <key>ProcessType</key>
  <string>Background</string>
  <key>LowPriorityIO</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${stdout}</string>
  <key>StandardErrorPath</key>
  <string>${stderr}</string>
</dict>
</plist>
`;
}

function install() {
  fs.mkdirSync(path.dirname(plistPath), { recursive: true });
  fs.mkdirSync(logDir, { recursive: true });

  const tempPath = `${plistPath}.tmp`;
  fs.writeFileSync(tempPath, plist(), { mode: 0o644 });
  fs.renameSync(tempPath, plistPath);

  launchctl(['bootout', domain, plistPath], { allowFailure: true });
  launchctl(['bootstrap', domain, plistPath]);
  launchctl(['enable', service]);
  launchctl(['kickstart', '-k', service]);

  console.log(`已安装：${plistPath}`);
  console.log('检查间隔：5 分钟（登录后也会立即检查）');
  console.log(`日志：${path.join(logDir, 'auto-sync.log')}`);
  console.log(`错误日志：${path.join(logDir, 'auto-sync.error.log')}`);
}

function uninstall() {
  launchctl(['bootout', domain, plistPath], { allowFailure: true });
  fs.rmSync(plistPath, { force: true });
  console.log(`已卸载 ${label}；历史日志保留在 ${logDir}`);
}

function status() {
  launchctl(['print', service], { inherit: true });
}

const action = process.argv[2] || 'install';

try {
  if (action === 'install') install();
  else if (action === 'uninstall') uninstall();
  else if (action === 'status') status();
  else throw new Error(`未知操作：${action}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
