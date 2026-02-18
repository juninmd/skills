import { join } from 'node:path';
import { getHomeDir } from '../utils/platform.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping } from '../types.js';

export class ClineInstaller extends BaseInstaller {
  get name(): string {
    return 'cline';
  }

  get targetDir(): string {
    return join(getHomeDir(), '.cline');
  }

  get categoryMappings(): CategoryMapping[] {
    return [
      { source: 'skills', target: 'skills' },
      { source: 'rules', target: 'rules' },
    ];
  }
}
