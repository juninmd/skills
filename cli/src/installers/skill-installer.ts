import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import * as os from 'node:os';
import { log } from '../utils/logger.js';
import { getRepoDir, getManifestDir } from '../utils/platform.js';

const GITLAB_REPO = 'https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents.git';
const SKILLS_PATH = '.agents/skills';
const REPO_CLONE_DIR = getRepoDir();
const AGENTS_LINK_DIR = getManifestDir();

interface SkillInstallResult {
  path: string;
  skillName: string;
  status: 'installed' | 'updated' | 'up-to-date';
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

  // Clone or update repo cache
  await ensureRepoCloned();

  // Validate skill exists in repo
  const skillSourceDir = path.join(REPO_CLONE_DIR, SKILLS_PATH, skillName);
  if (!fs.existsSync(skillSourceDir)) {
    throw new Error(`Skill "${skillName}" not found in repository at ${SKILLS_PATH}/${skillName}`);
  }

  let status: 'installed' | 'updated' | 'up-to-date' = 'installed';

  if (fs.existsSync(skillLinkDir)) {
    // Check for differences
    let hasDiff = false;
    const sourceFiles = fs.readdirSync(skillSourceDir);
    const linkedFiles = fs.readdirSync(skillLinkDir);

    if (sourceFiles.length !== linkedFiles.length) {
      hasDiff = true;
    } else {
      for (const file of sourceFiles) {
        if (!linkedFiles.includes(file)) {
          hasDiff = true;
          break;
        }
        const sourceFilePath = path.join(skillSourceDir, file);
        const linkFilePath = path.join(skillLinkDir, file);
        
        try {
          const lstat = fs.lstatSync(linkFilePath);
          if (lstat.isSymbolicLink()) {
            const target = fs.readlinkSync(linkFilePath);
            if (target !== sourceFilePath) {
              hasDiff = true;
              break;
            }
          } else {
             // Not a symlink, so it's a diff
             hasDiff = true;
             break;
          }
        } catch {
          hasDiff = true;
          break;
        }
      }
    }

    if (hasDiff) {
      fs.rmSync(skillLinkDir, { recursive: true, force: true });
      status = 'updated';
    } else {
      return {
        path: path.join(skillLinkDir, 'SKILL.md'),
        skillName,
        status: 'up-to-date',
      };
    }
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
    status,
  };
}

async function ensureRepoCloned(): Promise<void> {
  if (fs.existsSync(REPO_CLONE_DIR)) {
    log.detail(`Using local repo: ${REPO_CLONE_DIR}`);
    return;
  }

  throw new Error(`Local repository not found at ${REPO_CLONE_DIR}. Please ensure you have cloned the project correctly.`);
}

function validateSkillName(skillName: string): void {
  if (!skillName || skillName.includes('..') || skillName.includes('/')) {
    throw new Error(`Invalid skill name: "${skillName}"`);
  }

  if (!/^[a-z0-9-]+$/.test(skillName)) {
    throw new Error(`Skill name must be lowercase with hyphens only: "${skillName}"`);
  }
}
