import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const shellFiles = [];
let hasErrors = false;
const requireShellcheck = process.env.REQUIRE_SHELLCHECK === '1';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.sh')) {
      shellFiles.push(fullPath);
    }
  }
}

walk(rootDir);

const shellcheckAvailable = spawnSync('sh', ['-c', 'command -v shellcheck >/dev/null 2>&1']);
const hasShellcheck = shellcheckAvailable.status === 0;

if (requireShellcheck && !hasShellcheck) {
  console.error('❌ shellcheck é obrigatório neste modo, mas não foi encontrado no PATH.');
  console.error('   Dica: instale shellcheck no ambiente de CI ou execute sem REQUIRE_SHELLCHECK=1 localmente.');
  process.exit(1);
}

for (const filePath of shellFiles) {
  const relativePath = path.relative(rootDir, filePath);

  const bashCheck = spawnSync('bash', ['-n', filePath], { encoding: 'utf8' });
  if (bashCheck.status !== 0) {
    hasErrors = true;
    console.error(`❌ [${relativePath}] bash -n falhou`);
    if (bashCheck.stderr) console.error(bashCheck.stderr.trim());
  }

  if (hasShellcheck) {
    const shellcheck = spawnSync('shellcheck', ['-x', filePath], { encoding: 'utf8' });
    if (shellcheck.status !== 0) {
      hasErrors = true;
      console.error(`❌ [${relativePath}] shellcheck falhou`);
      if (shellcheck.stdout) console.error(shellcheck.stdout.trim());
      if (shellcheck.stderr) console.error(shellcheck.stderr.trim());
    }
  }
}

if (!hasShellcheck) {
  console.warn('⚠️ shellcheck não encontrado no ambiente; executado apenas bash -n.');
}

if (hasErrors) {
  console.error('\n🚨 Shell lint encontrou problemas.');
  process.exit(1);
}

console.log(`✅ Shell lint concluído com sucesso em ${shellFiles.length} arquivo(s).`);
