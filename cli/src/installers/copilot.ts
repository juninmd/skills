import { join } from 'node:path';
import { getHomeDir } from '../utils/platform.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping } from '../types.js';

export class CopilotInstaller extends BaseInstaller {
  get name(): string {
    return 'copilot';
  }

  get targetDir(): string {
    return join(getHomeDir(), '.agents');
  }

  get categoryMappings(): CategoryMapping[] {
    return [
      { source: 'skills', target: 'skills' },
      { source: 'rules', target: 'rules' },
      { source: 'agents', target: 'agents' },
    ];
  }
}
