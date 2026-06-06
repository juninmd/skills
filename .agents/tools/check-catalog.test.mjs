import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { checkCatalog } from './check-catalog.mjs';

test('detects stale documented skill counts', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-check-'));
  for (const directory of ['.agents/skills/demo', '.agents/agents', '.agents/rules', '.agents/prompts', 'docs/skills']) {
    fs.mkdirSync(path.join(root, directory), { recursive: true });
  }
  fs.writeFileSync(path.join(root, '.agents/skills/demo/SKILL.md'), '# Demo\n');
  fs.writeFileSync(path.join(root, 'README.md'), '2 skills 0 agents 0 rules 0 prompts\n');
  fs.writeFileSync(path.join(root, 'docs/index.md'), '2 skills\n');
  fs.writeFileSync(path.join(root, 'docs/skills/index.md'), '2 skills\n');
  assert.equal(checkCatalog(root).issues.length, 4);
});
