import { join } from 'node:path';
import { getHomeDir } from '../utils/platform.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping } from '../types.js';

export class AntigravityInstaller extends BaseInstaller {
  get name(): string {
    return 'antigravity';
  }

  get targetDir(): string {
    return join(getHomeDir(), '.gemini', 'antigravity');
  }

  get categoryMappings(): CategoryMapping[] {
    return [
      { source: 'skills', target: 'skills' },
      { source: 'rules', target: 'rules' },
      { source: 'workflows', target: 'workflows' },
      { source: 'agents', target: 'agents' },
    ];
  }

  protected override async postInstall(): Promise<void> {
    const destPath = join(this.targetDir, 'AGENTS.md');
    await this.copyAgentsMd(destPath);
  }
}
