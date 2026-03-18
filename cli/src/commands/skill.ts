import { installSkill } from '../installers/skill-installer.js';
import { log } from '../utils/logger.js';

export interface SkillOptions {
  skillName: string;
}

export async function skill(options: SkillOptions): Promise<void> {
  try {
    log.info(`📦 Installing skill: ${options.skillName}...`);
    const result = await installSkill(options.skillName);
    
    if (result.status === 'up-to-date') {
      log.success(`✅ Skill "${options.skillName}" already installed and up-to-date!`);
    } else if (result.status === 'updated') {
      log.success(`✅ Skill "${options.skillName}" updated successfully!`);
    } else {
      log.success(`✅ Skill "${options.skillName}" installed successfully!`);
    }
    
    log.info(`📂 Location: ${result.path}`);
  } catch (error) {
    throw new Error(`Failed to install skill: ${error instanceof Error ? error.message : String(error)}`);
  }
}
