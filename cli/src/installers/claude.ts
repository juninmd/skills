import { join } from 'node:path';
import { getHomeDir } from '../utils/platform.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping } from '../types.js';

export class ClaudeInstaller extends BaseInstaller {
  get name(): string {
    return 'claude';
  }

  get targetDir(): string {
    return join(getHomeDir(), '.claude');
  }

  get categoryMappings(): CategoryMapping[] {
    return [
      { source: 'skills', target: 'skills' },
      { source: 'rules', target: 'rules' },
    ];
  }

  protected override async postInstall(): Promise<void> {
    const destPath = join(this.targetDir, 'CLAUDE.md');
    await this.copyAgentsMd(destPath);
  }
}
