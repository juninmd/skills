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
      { source: 'hooks', target: 'hooks' },
    ];
  }

  protected override async postInstall(): Promise<void> {
    await this.configureHooks();
  }

  private async configureHooks(): Promise<void> {
    const settingsPath = join(this.targetDir, 'settings.json');

    if (this.options.dryRun) {
      log.dryRun(`Configuraria hooks em ${settingsPath}`);
      return;
    }

    let settings: Record<string, unknown> = {};

    if (await fileExists(settingsPath)) {
      try {
        const content = await readFile(settingsPath, 'utf-8');
        settings = JSON.parse(content);
      } catch {
        // Se nao conseguir ler, cria do zero
      }
    }

    // Adiciona configuracao de hooks se nao existir
    if (!settings.hooks) {
      settings.hooks = {
        BeforeTool: [
          {
            matcher: 'write_file|replace|shell',
            hooks: [
              {
                name: 'padrao-labs-pre-command',
                type: 'command',
                command: join(this.targetDir, 'hooks', 'pre-command.py'),
                timeout: 5000,
              },
            ],
          },
        ],
        AfterTool: [
          {
            matcher: '*',
            hooks: [
              {
                name: 'padrao-labs-post-command',
                type: 'command',
                command: join(this.targetDir, 'hooks', 'post-command.py'),
                timeout: 5000,
              },
            ],
          },
        ],
      };

      await ensureDir(this.targetDir);
      await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

      if (this.options.verbose) {
        log.detail('Hooks configurados em settings.json');
      }
    }
  }
}
