import { join } from 'node:path';
import { getHomeDir } from '../utils/platform.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping } from '../types.js';

export class CursorInstaller extends BaseInstaller {
  get name(): string {
    return 'cursor';
  }

  get targetDir(): string {
    return join(getHomeDir(), '.cursor');
  }

  get categoryMappings(): CategoryMapping[] {
    // Cursor usa arquivo unico de regras, nao copia dirs de skills
    return [];
  }

  protected override async postInstall(): Promise<void> {
    const destPath = join(this.targetDir, 'rules', 'padrao-labs.mdc');
    await this.concatenateRulesToFile(destPath);
  }
}
