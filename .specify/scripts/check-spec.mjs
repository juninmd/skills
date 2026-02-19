#!/usr/bin/env node
/**
 * check-spec.mjs — Validate specs and show status dashboard (2-in-1)
 * Usage: node .specify/scripts/check-spec.mjs [feature-name]
 *        pnpm spec:check [feature-name]
 *
 * If no feature-name is provided, checks all specs.
 * Combines validation (lint) + status dashboard into one command.
 * Returns exit code 1 if errors found (suitable for CI).
 *
 * Cross-platform (Linux, macOS, Windows)
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const SPECS_DIR = join(PROJECT_ROOT, '.specify', 'specs');

// --- Colors ---
const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// --- Counters ---
let totalErrors = 0;
let totalWarnings = 0;

// --- Helpers ---

function fileExists(filePath) {
  return existsSync(filePath);
}

function readFile(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function getSpecStatus(content) {
  const match = content.match(/^\- \*\*Status\*\*:\s*`?([^`\n]+)`?/m);
  if (!match) return 'unknown';

  // Extract first valid status from the line (template may have "draft | review | approved | implemented")
  const statusLine = match[1].trim();
  const validStatuses = ['draft', 'review', 'approved', 'implemented'];

  // If it's a clean single status
  for (const s of validStatuses) {
    if (statusLine === s) return s;
  }

  // If there are multiple pipe-separated values (template default), treat as 'draft'
  if (statusLine.includes('|')) return 'draft';

  return statusLine;
}

function countMatches(content, pattern) {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

// --- Validation ---

function validateSpec(specDir) {
  const featureName = basename(specDir);
  const specFile = join(specDir, 'spec.md');
  const planFile = join(specDir, 'plan.md');
  const tasksFile = join(specDir, 'tasks.md');
  const checklistFile = join(specDir, 'checklist.md');

  const errors = [];
  const warnings = [];

  // Check if spec.md exists
  if (!fileExists(specFile)) {
    errors.push('spec.md not found');
    return { featureName, status: '—', errors, warnings, hasSpec: false, hasPlan: false, hasTasks: false, hasChecklist: false, clarifications: 0 };
  }

  const content = readFile(specFile);
  if (!content) {
    errors.push('spec.md could not be read');
    return { featureName, status: '—', errors, warnings, hasSpec: true, hasPlan: false, hasTasks: false, hasChecklist: false, clarifications: 0 };
  }

  const status = getSpecStatus(content);

  // Validate status
  const validStatuses = ['draft', 'review', 'approved', 'implemented'];
  if (status !== 'unknown' && !validStatuses.includes(status)) {
    errors.push(`Invalid status: '${status}' (valid: ${validStatuses.join(', ')})`);
  }

  // Check required sections
  const requiredSections = [
    ['Header', /^##\s+(Header Section|Header)/m],
    ['User Scenarios', /^##\s+User Scenarios/m],
    ['Requirements', /^##\s+Requirements/m],
    ['Success Criteria', /^##\s+Success Criteria/m],
  ];

  for (const [name, pattern] of requiredSections) {
    if (!pattern.test(content)) {
      errors.push(`Required section missing: ## ${name}`);
    }
  }

  // Check NEEDS CLARIFICATION markers
  const clarifications = countMatches(content, /\[NEEDS CLARIFICATION\]/g);
  if (clarifications > 0) {
    if (status === 'approved' || status === 'implemented') {
      errors.push(`${clarifications} [NEEDS CLARIFICATION] in spec with status '${status}'`);
    } else {
      warnings.push(`${clarifications} [NEEDS CLARIFICATION] (acceptable in status '${status}')`);
    }
  }

  // Check Gherkin format
  if (/Acceptance Criteria/i.test(content)) {
    if (!/Given|When|Then/i.test(content)) {
      warnings.push('Acceptance Criteria without Gherkin format (Given/When/Then)');
    }
  }

  // Check companion files
  const hasPlan = fileExists(planFile);
  const hasTasks = fileExists(tasksFile);
  const hasChecklist = fileExists(checklistFile);

  if (!hasPlan && (status === 'approved' || status === 'implemented')) {
    warnings.push(`plan.md not found (recommended for status '${status}')`);
  }
  if (!hasTasks && (status === 'approved' || status === 'implemented')) {
    warnings.push(`tasks.md not found (recommended for status '${status}')`);
  }

  return { featureName, status, errors, warnings, hasSpec: true, hasPlan, hasTasks, hasChecklist, clarifications };
}

// --- Dashboard ---

function renderDashboard(results) {
  const statusColors = {
    draft: c.yellow,
    review: c.cyan,
    approved: c.green,
    implemented: c.green,
  };

  console.log('');
  console.log(`${c.bold(c.cyan('📊 Spec-Driven Development — Dashboard'))}`);
  console.log(c.cyan('━'.repeat(80)));

  // Header
  const header = `  ${pad('Feature', 28)} ${pad('Status', 14)} ${pad('Spec', 6)} ${pad('Plan', 6)} ${pad('Tasks', 7)} ${pad('Check', 7)} ${pad('Issues', 8)}`;
  console.log(c.bold(header));
  console.log(c.cyan('─'.repeat(80)));

  const statusCount = { draft: 0, review: 0, approved: 0, implemented: 0 };

  for (const r of results) {
    const colorFn = statusColors[r.status] || ((s) => s);
    const issueCount = r.errors.length + r.warnings.length;
    const issueStr = issueCount > 0
      ? (r.errors.length > 0 ? c.red(`${issueCount}`) : c.yellow(`${issueCount}`))
      : c.green('0');

    const row = `  ${pad(r.featureName, 28)} ${colorFn(pad(r.status, 14))} ${tick(r.hasSpec)}     ${tick(r.hasPlan)}     ${tick(r.hasTasks)}      ${tick(r.hasChecklist)}      ${issueStr}`;
    console.log(row);

    if (statusCount[r.status] !== undefined) statusCount[r.status]++;
  }

  console.log(c.cyan('─'.repeat(80)));
  console.log('');
  console.log(`  ${c.bold('Total:')} ${results.length} spec(s)`);
  console.log(`  ${c.yellow('Draft:')} ${statusCount.draft}  ${c.cyan('Review:')} ${statusCount.review}  ${c.green('Approved:')} ${statusCount.approved}  ${c.green('Implemented:')} ${statusCount.implemented}`);
}

function renderValidation(results) {
  const hasIssues = results.some((r) => r.errors.length > 0 || r.warnings.length > 0);

  if (!hasIssues) {
    console.log(`\n${c.green('✅ All specs passed validation. No issues found.')}`);
    return;
  }

  console.log(`\n${c.bold('Validation Details:')}`);

  for (const r of results) {
    if (r.errors.length === 0 && r.warnings.length === 0) continue;

    console.log(`\n  ${c.cyan('⤍')} ${c.bold(r.featureName)}`);

    for (const err of r.errors) {
      console.log(`    ${c.red('✗')} ${err}`);
      totalErrors++;
    }
    for (const warn of r.warnings) {
      console.log(`    ${c.yellow('⚠')} ${warn}`);
      totalWarnings++;
    }
  }
}

// --- Utilities ---

function pad(str, len) {
  return str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
}

function tick(value) {
  return value ? c.green('✓') : c.red('✗');
}

// --- Main ---

function main() {
  const featureName = process.argv[2];

  if (!existsSync(SPECS_DIR)) {
    console.log(c.yellow('  No specs found in .specify/specs/'));
    console.log(`\n  To create a new spec, run:`);
    console.log(`  ${c.cyan('pnpm spec:init <feature-name>')}`);
    process.exit(0);
  }

  let specDirs;

  if (featureName) {
    const featureDir = join(SPECS_DIR, featureName);
    if (!existsSync(featureDir)) {
      console.error(c.red(`Error: Feature '${featureName}' not found in .specify/specs/`));
      process.exit(1);
    }
    specDirs = [featureDir];
  } else {
    specDirs = readdirSync(SPECS_DIR)
      .map((name) => join(SPECS_DIR, name))
      .filter((p) => statSync(p).isDirectory());
  }

  if (specDirs.length === 0) {
    console.log(c.yellow('  No specs found in .specify/specs/'));
    console.log(`\n  To create a new spec, run:`);
    console.log(`  ${c.cyan('pnpm spec:init <feature-name>')}`);
    process.exit(0);
  }

  // Validate all specs
  const results = specDirs.map(validateSpec);

  // Render dashboard
  renderDashboard(results);

  // Render validation details
  renderValidation(results);

  // Summary
  console.log('');
  console.log(c.cyan('━'.repeat(80)));

  if (totalErrors > 0) {
    console.log(c.red(`❌ ${totalErrors} error(s) and ${totalWarnings} warning(s) found.`));
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(c.yellow(`⚠ ${totalWarnings} warning(s) found. No blocking errors.`));
    process.exit(0);
  } else {
    console.log(c.green('✅ All checks passed!'));
    process.exit(0);
  }
}

main();
