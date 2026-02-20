#!/usr/bin/env node
/**
 * approve-spec.mjs — Approve a spec by changing status from 'review' to 'approved'
 * Usage: node .specify/scripts/approve-spec.mjs <feature-name>
 *        pnpm spec:approve <feature-name>
 *
 * Cross-platform (Linux, macOS, Windows)
 */

import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const SPECS_DIR = join(PROJECT_ROOT, '.specify', 'specs');

// --- Colors (cross-platform ANSI) ---
const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function usage() {
  console.log(`${c.cyan('Usage:')} pnpm spec:approve <feature-name>`);
  console.log('');
  console.log('Changes the status of a spec from "review" to "approved".');
  console.log('The spec must be in "review" status to be approved.');
  process.exit(1);
}

async function main() {
  const featureName = process.argv[2];

  if (!featureName) {
    console.error(c.red('Error: feature name is required.\n'));
    usage();
  }

  const specDir = join(SPECS_DIR, featureName);
  const specFile = join(specDir, 'spec.md');

  // Check if spec directory exists
  if (!existsSync(specDir)) {
    console.error(c.red(`Error: Spec directory not found: ${specDir}`));
    console.log(`Make sure the feature name is correct. Available specs:`);
    // List available specs
    try {
      const specs = readdirSync(SPECS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      specs.forEach(spec => console.log(`  - ${spec}`));
    } catch (error) {
      console.log('  (no specs found)');
    }
    process.exit(1);
  }

  // Check if spec.md exists
  if (!existsSync(specFile)) {
    console.error(c.red(`Error: spec.md not found in: ${specDir}`));
    process.exit(1);
  }

  // Read the spec file
  let content;
  try {
    content = readFileSync(specFile, 'utf-8');
  } catch (error) {
    console.error(c.red(`Error reading spec file: ${error.message}`));
    process.exit(1);
  }

  // Check current status
  const statusMatch = content.match(/- \*\*Status\*\*:\s*`([^`]+)`/);
  if (!statusMatch) {
    console.error(c.red('Error: Could not find status in spec file.'));
    console.log('Make sure the spec has a proper header section with status.');
    process.exit(1);
  }

  const currentStatus = statusMatch[1];
  console.log(`${c.cyan('Current status:')} ${c.bold(currentStatus)}`);

  if (currentStatus === 'approved') {
    console.log(c.green('✅ Spec is already approved!'));
    process.exit(0);
  }

  if (currentStatus !== 'review') {
    console.error(c.red(`Error: Can only approve specs with status 'review'.`));
    console.log(`Current status is '${currentStatus}'. Change to 'review' first.`);
    process.exit(1);
  }

  // Update status to approved
  const updatedContent = content.replace(
    /- \*\*Status\*\*:\s*`review`/,
    `- **Status**: \`approved\``
  );

  // Write back to file
  try {
    writeFileSync(specFile, updatedContent, 'utf-8');
    console.log(c.green('✅ Spec approved successfully!'));
    console.log(`${c.cyan('Status changed:')} review → approved`);
  } catch (error) {
    console.error(c.red(`Error writing spec file: ${error.message}`));
    process.exit(1);
  }

  // Run validation to ensure everything is still correct
  console.log('\n🔍 Running validation...');

  const child = spawn('node', ['.specify/scripts/check-spec.mjs', featureName], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit'
  });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        console.log(c.green('\n🎉 Spec approved and validated successfully!'));
      } else {
        console.log(c.yellow('\n⚠️  Spec approved but validation found issues.'));
        console.log('Review the validation output above.');
      }
      resolve(code);
    });

    child.on('error', (error) => {
      console.error(c.red(`Error running validation: ${error.message}`));
      reject(error);
    });
  });
}

main().catch(error => {
  console.error(c.red(`Unexpected error: ${error.message}`));
  process.exit(1);
});