#!/usr/bin/env node
/**
 * init-spec.mjs — Scaffold a new feature spec for Spec-Driven Development
 * Usage: node .specify/scripts/init-spec.mjs <feature-name>
 *        pnpm spec:init <feature-name>
 *
 * Cross-platform (Linux, macOS, Windows)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const TEMPLATES_DIR = join(PROJECT_ROOT, '.specify', 'templates');
const SPECS_DIR = join(PROJECT_ROOT, '.specify', 'specs');

// --- Colors (cross-platform ANSI) ---
const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// --- Template file mapping ---
const TEMPLATES = [
  { template: 'spec-template.md', output: 'spec.md', label: 'spec.md' },
  { template: 'plan-template.md', output: 'plan.md', label: 'plan.md' },
  { template: 'tasks-template.md', output: 'tasks.md', label: 'tasks.md' },
  { template: 'checklist-template.md', output: 'checklist.md', label: 'checklist.md' },
];

function usage() {
  console.log(`${c.cyan('Usage:')} pnpm spec:init <feature-name>`);
  console.log('');
  console.log('Creates the complete spec structure for a new feature:');
  TEMPLATES.forEach(({ output }) => {
    console.log(`  .specify/specs/<feature-name>/${output}`);
  });
  process.exit(1);
}

function main() {
  const featureName = process.argv[2];

  if (!featureName) {
    console.error(c.red('Error: feature name is required.\n'));
    usage();
  }

  const featureDir = join(SPECS_DIR, featureName);
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Check if feature already exists
  if (existsSync(featureDir)) {
    console.error(c.yellow(`⚠ Directory already exists: .specify/specs/${featureName}/`));
    console.error('  Use a different name or remove the existing directory.');
    process.exit(1);
  }

  console.log(`${c.cyan('🚀 Initializing spec for:')} ${c.green(featureName)}\n`);

  // Create directory
  mkdirSync(featureDir, { recursive: true });
  console.log(`  ${c.green('✓')} Directory created: .specify/specs/${featureName}/`);

  // Copy and customize templates
  const replacements = [
    [/\[Name of the skill\/agent\/rule\]/g, featureName],
    [/\[Feature Name\]/g, featureName],
    [/\[Feature name\]/g, featureName],
    [/\[feature-name\]/g, featureName],
    [/\[feature\]/g, featureName],
    [/\[name\]/g, featureName],
    [/\[date created\]/g, date],
    [/\[date\]/g, date],
    [/\[descriptive-identifier\]/g, featureName],
  ];

  for (const { template, output, label } of TEMPLATES) {
    const templatePath = join(TEMPLATES_DIR, template);

    if (!existsSync(templatePath)) {
      console.log(`  ${c.yellow('⚠')} Template not found: ${template} (skipped)`);
      continue;
    }

    let content = readFileSync(templatePath, 'utf-8');

    for (const [pattern, replacement] of replacements) {
      content = content.replace(pattern, replacement);
    }

    writeFileSync(join(featureDir, output), content, 'utf-8');
    console.log(`  ${c.green('✓')} ${label} created (from template)`);
  }

  // Summary
  console.log(`\n${c.cyan('📝 Structure created:')}`);
  console.log(`  .specify/specs/${featureName}/`);
  console.log('  ├── spec.md       ← Fill in first');
  console.log('  ├── plan.md       ← After spec approved');
  console.log('  ├── tasks.md      ← After plan approved');
  console.log('  └── checklist.md  ← For final validation');

  console.log(`\n${c.green('✅ Done! Next steps:')}`);
  console.log(`  1. Fill in .specify/specs/${featureName}/spec.md`);
  console.log('  2. Resolve all [NEEDS CLARIFICATION]');
  console.log('  3. Fill in plan.md and tasks.md');
  console.log('  4. Implement following the SDD workflow');
  console.log(`\n  Tip: use the workflow ${c.cyan('sdd-new-feature.md')} to guide the full process`);
}

main();
