import { parse, stringify } from 'comment-json';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { getHomeDir } from '../utils/platform.js';
import { ensureDir, fileExists } from '../utils/fs.js';
import { log } from '../utils/logger.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping } from '../types.js';

export class GeminiCliInstaller extends BaseInstaller {
  get name(): string {
    return 'gemini';
  }

  get targetDir(): string {
    return join(getHomeDir(), '.gemini');
  }

  get categoryMappings(): CategoryMapping[] {
    return [
      { source: 'skills', target: 'skills' },
    ];
  }

  protected override async postInstall(): Promise<string[] | void> {
    return [];
  }
}
