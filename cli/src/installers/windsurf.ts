import { join } from 'node:path';
import { getHomeDir } from '../utils/platform.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping } from '../types.js';

export class WindsurfInstaller extends BaseInstaller {
  get name(): string {
    return 'windsurf';
  }

  get targetDir(): string {
    return join(getHomeDir(), '.windsurf');
  }

  get categoryMappings(): CategoryMapping[] {
    return [];
  }

  protected override async postInstall(): Promise<void> {
    const destPath = join(this.targetDir, 'rules', 'padrao-labs.md');
    await this.concatenateRulesToFile(destPath);
  }
}
