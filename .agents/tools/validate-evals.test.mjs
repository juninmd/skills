import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { validateEvals } from './validate-evals.mjs';

function fixture(withEval) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-validator-'));
  fs.mkdirSync(path.join(root, 'skills', 'demo'), { recursive: true });
  fs.writeFileSync(path.join(root, 'skills', 'demo', 'SKILL.md'), '# Demo\n');
  if (withEval) {
    const evalRoot = path.join(root, 'skills', 'evals', 'demo');
    fs.mkdirSync(path.join(evalRoot, 'tasks'), { recursive: true });
    fs.writeFileSync(path.join(evalRoot, 'eval.yaml'), 'skill: demo\ntasks:\n  - "tasks/*.yaml"\n');
    for (const name of ['positive-trigger-1.yaml', 'positive-trigger-2.yaml', 'negative-trigger-1.yaml']) {
      fs.writeFileSync(path.join(evalRoot, 'tasks', name), 'id: case\ndescription: case\nprompt: test\nexpected: match\n');
    }
  }
  return root;
}

test('requires eval coverage for every skill', () => {
  assert.deepEqual(validateEvals(fixture(false)).issues, ['demo: missing eval.yaml']);
});

test('accepts a complete deterministic eval contract', () => {
  assert.deepEqual(validateEvals(fixture(true)).issues, []);
});
