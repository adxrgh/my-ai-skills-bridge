import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(
  process.env.SKILLS_SOURCE_DIR || path.join(os.homedir(), '.agents', 'skills'),
);
const targetDir = path.resolve(
  process.env.SKILLS_TARGET_DIR || path.join(__dirname, '..', 'skills'),
);

// `bridge-skills/` is intentionally separate. It contains explicitly reviewed
// Skills owned by this bridge and is never removed by the bulk local sync.

console.log(`Syncing skills from ${sourceDir} to ${targetDir}...`);

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

// Clean target directory except .gitkeep
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    const baseName = path.basename(src);
    if (baseName === '.git' || baseName === 'node_modules' || baseName === '.DS_Store') {
      return;
    }
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const items = fs.readdirSync(sourceDir);
let count = 0;

for (const item of items) {
  const itemPath = path.join(sourceDir, item);
  const skillMdPath = path.join(itemPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    copyRecursive(itemPath, path.join(targetDir, item));
    count++;
  }
}

console.log(`Successfully synced ${count} skills!`);
