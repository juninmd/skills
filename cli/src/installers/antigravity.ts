import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { getHomeDir } from '../utils/platform.js';
import { fileExists } from '../utils/fs.js';
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

  protected override async postInstall(): Promise<string[] | void> {
    const destPath = join(this.targetDir, 'AGENTS.md');
    await this.copyAgentsMd(destPath);

    const geminiMdPath = join(getHomeDir(), '.gemini', 'GEMINI.md');
    const importLine = `@${destPath}`;
    const summary = ['Arquivo AGENTS.md configurado'];

    if (!this.options.dryRun) {
      if (!(await fileExists(geminiMdPath))) {
        await writeFile(geminiMdPath, `${importLine}\n`, 'utf-8');
        summary.push('Arquivo global GEMINI.md criado');
      } else {
        const current = await readFile(geminiMdPath, 'utf-8');
        if (!current.includes(importLine)) {
          const prefix = current.endsWith('\n') ? '' : '\n';
          await writeFile(geminiMdPath, `${current}${prefix}${importLine}\n`, 'utf-8');
          summary.push('Arquivo global GEMINI.md atualizado');
        }
      }
    } else {
      summary.push('Configuraria arquivo global GEMINI.md');
    }

    return summary;
  }
}
