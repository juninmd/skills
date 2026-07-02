import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { MARKETPLACE_FILE, PLUGINS_DIR } from './lib/catalog.mjs';

execFileSync(process.execPath, ['scripts/generate-marketplace.mjs'], { stdio: 'inherit' });

const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf8'));
assert.equal(marketplace.name, 'plugin-marketplace');
assert.equal(marketplace.plugins.length, 1);
assert.equal(marketplace.plugins[0].name, 'core');
assert.ok(fs.existsSync(path.join(PLUGINS_DIR, 'core', 'skills', 'applying-kiss', 'SKILL.md')));
assert.ok(fs.existsSync(path.join(PLUGINS_DIR, 'core', 'agents', 'principal-engineer.agent.md')));

console.log('Smoke test passed.');
