import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { ROOT_DIR, walkFiles } from './lib/catalog.mjs';

let hasErrors = false;
const shellcheckReady = spawnSync('sh', ['-c', 'command -v shellcheck >/dev/null 2>&1']);
const hasShellcheck = shellcheckReady.status === 0;

function toShellPath(filePath) {
  if (process.platform !== 'win32') {
    return filePath;
  }

  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/^([A-Za-z]):(\/.*)$/);
  if (!match) {
    return normalized;
  }

  return `/mnt/${match[1].toLowerCase()}${match[2]}`;
}

for (const filePath of walkFiles(ROOT_DIR, (_, name) => name.endsWith('.sh'))) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const shellPath = toShellPath(filePath);
  const syntax = spawnSync('bash', ['-n', shellPath], { encoding: 'utf8' });

  if (syntax.status !== 0) {
    hasErrors = true;
    console.error(`[${relativePath}] bash -n failed.`);
    if (syntax.stderr) {
      console.error(syntax.stderr.trim());
    }
  }

  if (!hasShellcheck) {
    continue;
  }

  const shellcheck = spawnSync('shellcheck', ['-x', shellPath], { encoding: 'utf8' });
  if (shellcheck.status !== 0) {
    hasErrors = true;
    console.error(`[${relativePath}] shellcheck failed.`);
    if (shellcheck.stdout) {
      console.error(shellcheck.stdout.trim());
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(hasShellcheck ? 'Validated shell scripts.' : 'No shell scripts required shellcheck validation.');
