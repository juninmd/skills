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
        // Faz backup do arquivo original
        await writeFile(`${settingsPath}.old`, content, 'utf-8');
        log.detail(`Backup de settings.json criado em ${settingsPath}.old`);

        settings = JSON.parse(content);
      } catch {
        // Se nao conseguir ler, cria do zero
      }
    }

    // Define hooks do padrao-labs
    const padraoLabsHooks = {
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

    // Faz merge inteligente: preserva hooks existentes e adiciona/atualiza os do padrao-labs
    if (!settings.hooks || typeof settings.hooks !== 'object') {
      settings.hooks = padraoLabsHooks;
    } else {
      const existingHooks = settings.hooks as Record<string, unknown[]>;

      // Merge BeforeTool hooks
      if (!Array.isArray(existingHooks.BeforeTool)) {
        existingHooks.BeforeTool = padraoLabsHooks.BeforeTool;
      } else {
        // Remove hooks do padrao-labs existentes e adiciona as versões atualizadas
        existingHooks.BeforeTool = existingHooks.BeforeTool.filter((item: unknown) => {
          const hookItem = item as { hooks?: { name?: string }[] };
          return !hookItem.hooks?.some(h => h.name?.startsWith('padrao-labs-'));
        });
        existingHooks.BeforeTool.push(...padraoLabsHooks.BeforeTool);
      }

      // Merge AfterTool hooks
      if (!Array.isArray(existingHooks.AfterTool)) {
        existingHooks.AfterTool = padraoLabsHooks.AfterTool;
      } else {
        existingHooks.AfterTool = existingHooks.AfterTool.filter((item: unknown) => {
          const hookItem = item as { hooks?: { name?: string }[] };
          return !hookItem.hooks?.some(h => h.name?.startsWith('padrao-labs-'));
        });
        existingHooks.AfterTool.push(...padraoLabsHooks.AfterTool);
      }
    }

    await ensureDir(this.targetDir);
    await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

    log.detail('Hooks configurados em settings.json (merge com hooks existentes)');
  }
}
