import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { log } from './logger.js';
import { getRepoDir } from './platform.js';

const REPO_URL = 'git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git';

export function getLatestCommitHash(): string {
  const targetDir = getRepoDir();
  if (!existsSync(targetDir)) return 'unknown';
  try {
    return execSync('git rev-parse HEAD', { cwd: targetDir, encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}
