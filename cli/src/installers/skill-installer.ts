import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import * as os from 'node:os';
import { log } from '../utils/logger.js';

const GITLAB_REPO = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents.git';
const SKILLS_PATH = '.agents/skills';
const PADRAO_LABS_DIR = path.join(os.homedir(), '.padrao-labs');
const REPO_CLONE_DIR = path.join(PADRAO_LABS_DIR, 'padrao-labs-agents');
const AGENTS_LINK_DIR = path.join(os.homedir(), '.agents');

interface SkillInstallResult {
  path: string;
  skillName: string;
}

export async function installSkill(skillName: string): Promise<SkillInstallResult> {
  validateSkillName(skillName);

  // Ensure ~/.agents exists
  if (!fs.existsSync(AGENTS_LINK_DIR)) {
    fs.mkdirSync(AGENTS_LINK_DIR, { recursive: true });
  }

  // Ensure skills directory exists in ~/.agents
  const skillsDir = path.join(AGENTS_LINK_DIR, 'skills');
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  const skillLinkDir = path.join(skillsDir, skillName);

  if (fs.existsSync(skillLinkDir)) {
    throw new Error(`Skill "${skillName}" already installed at ${skillLinkDir}`);
  }

  // Clone or update repo cache
  await ensureRepoCloned();

  // Validate skill exists in repo
  const skillSourceDir = path.join(REPO_CLONE_DIR, SKILLS_PATH, skillName);
  if (!fs.existsSync(skillSourceDir)) {
    throw new Error(`Skill "${skillName}" not found in repository at ${SKILLS_PATH}/${skillName}`);
  }

  // Create skill directory
  fs.mkdirSync(skillLinkDir, { recursive: true });

  // Create symlinks for each file in the skill
  log.detail(`Creating symlinks for skill files...`);
  const skillFiles = fs.readdirSync(skillSourceDir, { withFileTypes: true });

  for (const file of skillFiles) {
    const sourceFilePath = path.join(skillSourceDir, file.name);
    const linkFilePath = path.join(skillLinkDir, file.name);

    if (file.isDirectory()) {
      // For subdirectories, create a symlink to the directory
      fs.symlinkSync(sourceFilePath, linkFilePath, 'dir');
    } else {
      // For files, create a symlink to the file
      fs.symlinkSync(sourceFilePath, linkFilePath, 'file');
    }
  }

  return {
    path: path.join(skillLinkDir, 'SKILL.md'),
    skillName,
  };
}

async function ensureRepoCloned(): Promise<void> {
  if (fs.existsSync(REPO_CLONE_DIR)) {
    log.detail(`Using cached repo...`);
    return;
  }

  log.detail(`Cloning repository...`);

  if (!fs.existsSync(PADRAO_LABS_DIR)) {
    fs.mkdirSync(PADRAO_LABS_DIR, { recursive: true });
  }

  try {
    execSync(`git clone --depth 1 --filter=blob:none "${GITLAB_REPO}" "${REPO_CLONE_DIR}"`, {
      stdio: 'pipe',
      encoding: 'utf-8',
    });
  } catch (error) {
    throw new Error(
      `Failed to clone repository: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function validateSkillName(skillName: string): void {
  if (!skillName || skillName.includes('..') || skillName.includes('/')) {
    throw new Error(`Invalid skill name: "${skillName}"`);
  }

  if (!/^[a-z0-9-]+$/.test(skillName)) {
    throw new Error(`Skill name must be lowercase with hyphens only: "${skillName}"`);
  }
}
