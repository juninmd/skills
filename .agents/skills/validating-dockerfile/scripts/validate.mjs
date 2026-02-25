#!/usr/bin/env node

/**
 * Validating Dockerfile Skill Script
 * Performs build, run (smoke test), and cleanup for a given Dockerfile.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const args = process.argv.slice(2);
let dockerfilePath = args[0];

// 1. Detect Dockerfile if not provided (check for staged files)
if (!dockerfilePath) {
  try {
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .split('\n')
      .filter(file => file.includes('Dockerfile'));

    if (stagedFiles.length > 0) {
      dockerfilePath = stagedFiles[0];
      console.log(`🔍 Detected staged Dockerfile: ${dockerfilePath}`);
    }
  } catch (e) {
    // Git might not be available or not a repo
  }
}

if (!dockerfilePath) {
  dockerfilePath = 'Dockerfile'; // Fallback to root
}

if (!fs.existsSync(dockerfilePath)) {
  console.error(`❌ Error: Dockerfile not found at ${dockerfilePath}`);
  process.exit(1);
}

const tag = `validate-${Math.random().toString(36).substring(7)}`;
const containerName = `${tag}-running`;
const absolutePath = path.resolve(dockerfilePath);
const contextDir = path.dirname(absolutePath);

console.log(`🚀 Validating Dockerfile: ${absolutePath}`);
console.log(`📦 Context directory: ${contextDir}`);

try {
  // 2. Build
  console.log('\n🛠️  Step 1: Building image...');
  execSync(`docker build -t ${tag} -f "${absolutePath}" "${contextDir}"`, { stdio: 'inherit' });

  // 3. Run (Smoke Test)
  console.log('\n🏃 Step 2: Running container (smoke test)...');
  // Run detached to check if it stays up for a few seconds
  execSync(`docker run -d --name ${containerName} ${tag}`, { stdio: 'inherit' });

  console.log('⏳ Waiting for 3 seconds to verify stability...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const isRunning = execSync(`docker inspect -f '{{.State.Running}}' ${containerName}`, { encoding: 'utf8' }).trim() === 'true';
  const exitCode = execSync(`docker inspect -f '{{.State.ExitCode}}' ${containerName}`, { encoding: 'utf8' }).trim();

  if (isRunning || exitCode === '0') {
    console.log(isRunning ? '✅ Container is running correctly!' : '✅ Container finished successfully!');
  } else {
    const logs = execSync(`docker logs ${containerName}`, { encoding: 'utf8' });
    console.error(`❌ Container failed (ExitCode: ${exitCode}). Logs:`);
    console.error(logs);
    throw new Error('Smoke test failed.');
  }

} catch (error) {
  console.error(`\n❌ Validation failed: ${error.message}`);
  cleanup();
  process.exit(1);
}

// 4. Cleanup
cleanup();

function cleanup() {
  console.log('\n🧹 Step 3: Cleaning up...');
  try {
    execSync(`docker stop ${containerName} > /dev/null 2>&1 || true`);
    execSync(`docker rm ${containerName} > /dev/null 2>&1 || true`);
    execSync(`docker rmi ${tag} > /dev/null 2>&1 || true`);
    console.log('✨ Cleanup complete.');
  } catch (e) {
    console.warn('⚠️  Cleanup partially failed.');
  }
}
