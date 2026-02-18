import { cpSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_DIR = join(__dirname, '..');
const ROOT = join(CLI_DIR, '..');
const AGENTS_SRC = join(ROOT, '.agents');
const AGENTS_MD = join(ROOT, 'agents.md');
const BUNDLE_DIR = join(CLI_DIR, 'agents-bundle');
const TEMPLATES_SRC = join(ROOT, 'src', 'exemplo');
const TEMPLATES_DIR = join(CLI_DIR, 'templates');

const CATEGORIES = ['agents', 'skills', 'rules', 'hooks', 'workflows'];

function clean() {
  if (existsSync(BUNDLE_DIR)) {
    rmSync(BUNDLE_DIR, { recursive: true, force: true });
  }
}

function bundleAgents() {
  console.log('Bundling .agents/ content...');
  clean();

  for (const cat of CATEGORIES) {
    const src = join(AGENTS_SRC, cat);
    const dest = join(BUNDLE_DIR, cat);

    if (!existsSync(src)) {
      console.log(`  Skipping ${cat} (not found)`);
      continue;
    }

    cpSync(src, dest, { recursive: true });
    console.log(`  Copied ${cat}`);
  }

  // Copy master agents.md
  if (existsSync(AGENTS_MD)) {
    copyFileSync(AGENTS_MD, join(BUNDLE_DIR, 'agents.md'));
    console.log('  Copied agents.md');
  }

  console.log(`Bundle complete: ${BUNDLE_DIR}`);
}

bundleAgents();
