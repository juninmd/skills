import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  collectPrimaryFiles,
  detectFileType,
  formatResults,
  parseFrontmatter,
  runCli,
  runValidation,
  validateAgentsRoot,
  validatePluginFile,
} from './validate-agents.mjs';

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function createFixture(structure) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agents-validator-'));
  for (const [relativePath, content] of Object.entries(structure)) {
    writeFile(path.join(root, relativePath), content);
  }
  return root;
}

test('detectFileType resolves primary plugin kinds', () => {
  assert.equal(detectFileType(path.join('agents', 'code-reviewer.agent.md')), 'agent');
  assert.equal(detectFileType(path.join('prompts', 'explain.prompt.md')), 'prompt');
  assert.equal(detectFileType(path.join('rules', 'testing.instructions.md')), 'rule');
  assert.equal(detectFileType(path.join('skills', 'vite', 'SKILL.md')), 'skill');
  assert.equal(detectFileType(path.join('skills', 'vite', 'references', 'guide.md')), 'unknown');
});

test('parseFrontmatter extracts data and body', () => {
  const parsed = parseFrontmatter(`---\nname: demo\ndescription: \"Use for demos. Triggers: demo.\"\n---\n# Body\n`);
  assert.equal(parsed.error, null);
  assert.deepEqual(parsed.data, {
    name: 'demo',
    description: '"Use for demos. Triggers: demo."',
  });
  assert.match(parsed.body, /# Body/);
});

test('parseFrontmatter rejects malformed headers', () => {
  const noFence = parseFrontmatter('# hello');
  assert.match(noFence.error, /Missing opening/);

  const noClose = parseFrontmatter('---\nname: demo\nbody');
  assert.match(noClose.error, /Missing closing/);

  const badLine = parseFrontmatter('---\n- no\n---\n');
  assert.match(badLine.error, /Unsupported frontmatter line/);
});

test('parseFrontmatter supports CRLF content', () => {
  const parsed = parseFrontmatter('---\r\nname: demo\r\ndescription: Use for demos. Triggers: demo.\r\n---\r\nBody\r\n');
  assert.equal(parsed.error, null);
  assert.equal(parsed.data.name, 'demo');
});

test('collectPrimaryFiles ignores reference markdown', () => {
  const root = createFixture({
    'agents/a.agent.md': '---\nname: a\ndescription: "Use for A. Triggers: a."\nuser-invocable: true\n---\n',
    'skills/demo/SKILL.md': '---\nname: demo\ndescription: "Use for demos. Triggers: demo."\n---\n',
    'skills/demo/references/guide.md': '# ignored\n',
  });

  assert.deepEqual(collectPrimaryFiles(root), [
    path.join('agents', 'a.agent.md'),
    path.join('skills', 'demo', 'SKILL.md'),
  ]);
});

test('validatePluginFile reports required key, trigger, and empty value issues', () => {
  const root = createFixture({
    'agents/sample.agent.md': '---\nname: sample\ndescription: "Architecture guidance only."\nuser-invocable: \n---\n',
  });

  const issues = validatePluginFile(root, path.join('agents', 'sample.agent.md'));
  assert.equal(issues.length, 3);
  assert.deepEqual(issues.map((issue) => issue.rule).sort(), ['description-triggers', 'empty-value', 'required-key']);
});

test('validatePluginFile enforces skill name parity and detects broken links', () => {
  const root = createFixture({
    'skills/demo/SKILL.md': '---\nname: wrong-name\ndescription: "Use for demo workflows. Triggers: demo."\n---\n## Checklist\n- [ ] Verify\n\n## References\n- [Docs](https://example.com)\n\nSee [guide](references/missing.md).\n',
  });

  const issues = validatePluginFile(root, path.join('skills', 'demo', 'SKILL.md'));
  assert.equal(issues.length, 2);
  assert.deepEqual(issues.map((issue) => issue.rule).sort(), ['broken-link', 'skill-name']);
});

test('validatePluginFile detects missing baseDir tool paths and replacement chars', () => {
  const root = createFixture({
    'skills/scanner/SKILL.md': '---\nname: scanner\ndescription: "Use for APK analysis. Triggers: apk."\nallowed-tools: Bash({baseDir}/scanner.sh:*)\n---\n## Checklist\n- [ ] Scan\n\n## References\n- [Docs](https://example.com)\n\nBad char: �\n',
  });

  const issues = validatePluginFile(root, path.join('skills', 'scanner', 'SKILL.md'));
  assert.equal(issues.length, 3);
  assert.deepEqual(issues.map((issue) => issue.rule).sort(), ['allowed-tools', 'encoding', 'missing-tool-path']);
});

test('validatePluginFile requires checklist, references, and valid referenced skills', () => {
  const root = createFixture({
    'skills/demo/SKILL.md': '---\nname: demo\ndescription: "Use for demo workflows. Triggers: demo."\n---\nSee the `real-skill` skill and the `missing-skill` skill.\n',
    'skills/real-skill/SKILL.md': '---\nname: real-skill\ndescription: "Use for real workflows. Triggers: real."\n---\n## Checklist\n- [ ] Run\n\n## References\n- [Docs](https://example.com)\n',
  });

  const issues = validatePluginFile(root, path.join('skills', 'demo', 'SKILL.md'));
  assert.deepEqual(issues.map((issue) => issue.rule).sort(), ['referenced-skill', 'skill-checklist', 'skill-references']);
});

test('validatePluginFile accepts healthy files and ignores safe links', () => {
  const root = createFixture({
    'skills/demo/SKILL.md': '---\nname: demo\ndescription: "Use for demo workflows. Triggers: demo, docs."\n---\n## Checklist\n- [ ] Validate\n\n## References\n- [Guide](references/guide.md)\n- [Site](https://example.com)\n\nSee [guide](references/guide.md), [site](https://example.com), and [section](#usage).\n',
    'skills/demo/references/guide.md': '# ok\n',
  });

  const issues = validatePluginFile(root, path.join('skills', 'demo', 'SKILL.md'));
  assert.deepEqual(issues, []);
});

test('validateAgentsRoot returns only files with issues', () => {
  const root = createFixture({
    'prompts/explain.prompt.md': '---\nname: explain\ndescription: "Explain code. Triggers: explain this code."\nargument-hint: "[file]"\n---\n',
    'rules/testing.instructions.md': '---\nname: testing\ndescription: "Testing rule. Use when editing tests. Triggers: testing."\napplyTo: "**/*.test.ts"\n---\n',
    'skills/demo/SKILL.md': '---\nname: demo\ndescription: "Missing trigger marker"\n---\n',
  });

  const results = validateAgentsRoot(root);
  assert.equal(results.length, 1);
  assert.equal(results[0].relativePath, 'skills/demo/SKILL.md');
  assert.deepEqual(results[0].issues.map((issue) => issue.rule).sort(), ['description-triggers', 'skill-checklist', 'skill-references']);
});

test('validateAgentsRoot skips clean files and validates unknown shapes without crashing', () => {
  const root = createFixture({
    'misc/README.md': '# ignored\n',
    'rules/demo.instructions.md': '---\nname: demo\ndescription: "Use when editing shell commands. Triggers: shell, commands."\napplyTo: "**/*.sh"\n---\n',
  });

  assert.deepEqual(validateAgentsRoot(root), []);
});

test('runValidation and formatResults report failures and successes', () => {
  const failingRoot = createFixture({
    'skills/demo/SKILL.md': '---\nname: wrong\ndescription: "Broken description"\n---\n',
  });
  const failingRun = runValidation(failingRoot);
  assert.equal(failingRun.ok, false);
  assert.equal(failingRun.fileCount, 1);
  assert.match(failingRun.output, /description-triggers/);
  assert.match(failingRun.output, /skill-name/);
  assert.equal(formatResults([{ relativePath: 'skills/demo/SKILL.md', issues: [{ severity: 'error', rule: 'skill-name', message: 'Mismatch' }] }]), 'skills/demo/SKILL.md\n  - [error] skill-name: Mismatch');

  const cleanRoot = createFixture({
    'prompts/explain.prompt.md': '---\nname: explain\ndescription: "Explain code step by step. Triggers: explain this code, walkthrough."\nargument-hint: "[file]"\n---\n',
    'skills/demo/SKILL.md': '---\nname: demo\ndescription: "Use for demo workflows. Triggers: demo, walkthrough."\n---\n## Checklist\n- [ ] Validate\n\n## References\n- [Guide](references/guide.md)\n',
    'skills/demo/references/guide.md': '# ok\n',
  });
  const cleanRun = runValidation(cleanRoot);
  assert.equal(cleanRun.ok, true);
  assert.equal(cleanRun.fileCount, 2);
  assert.match(cleanRun.output, /Validated 2 plugin files with no issues/);
});

test('runCli writes to the selected stream and returns an exit code', () => {
  const root = createFixture({
    'rules/testing.instructions.md': '---\nname: testing\ndescription: "Use when testing changes. Triggers: tests, coverage."\napplyTo: "**/*.test.ts"\n---\n',
  });
  const messages = { stdout: [], stderr: [] };
  const exitCode = runCli(['node', 'validate-agents.mjs', root], (message) => messages.stdout.push(message), (message) => messages.stderr.push(message));
  assert.equal(exitCode, 0);
  assert.equal(messages.stderr.length, 0);
  assert.match(messages.stdout[0], /Validated 1 plugin files with no issues/);

  const badRoot = createFixture({
    'prompts/explain.prompt.md': '---\nname: explain\ndescription: "Explain code only."\nargument-hint: "[file]"\n---\n',
  });
  const badMessages = { stdout: [], stderr: [] };
  const badExitCode = runCli(['node', 'validate-agents.mjs', badRoot], (message) => badMessages.stdout.push(message), (message) => badMessages.stderr.push(message));
  assert.equal(badExitCode, 1);
  assert.equal(badMessages.stdout.length, 0);
  assert.match(badMessages.stderr[0], /description-triggers/);
});