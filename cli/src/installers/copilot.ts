import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { getHomeDir, getVSCodeMcpConfigPath } from '../utils/platform.js';
import { ensureDir, fileExists } from '../utils/fs.js';
import { log } from '../utils/logger.js';
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

  protected override async postInstall(): Promise<void> {
    await this.configureVSCodeMcp();
  }

  private async configureVSCodeMcp(): Promise<void> {
    const mcpPath = getVSCodeMcpConfigPath();

    if (this.options.dryRun) {
      log.dryRun(`Configuraria GitLab MCP em ${mcpPath}`);
      return;
    }

    let mcpConfig: any = { servers: {} };

    if (await fileExists(mcpPath)) {
      try {
        const content = await readFile(mcpPath, 'utf-8');
        mcpConfig = JSON.parse(content);
      } catch {
        // Fallback to default structure
      }
    }

    // Ensure structure exists
    if (!mcpConfig.servers) {
      mcpConfig.servers = {};
    }

    // Add or update gitlab-labs server
    mcpConfig.servers['gitlab-labs'] = {
      type: 'stdio',
      command: 'glab',
      args: ['mcp', 'serve'],
      gallery: false
    };

    await ensureDir(join(mcpPath, '..'));
    await writeFile(mcpPath, JSON.stringify(mcpConfig, null, 2), 'utf-8');

    if (this.options.verbose) {
      log.detail(`GitLab MCP configurado em ${mcpPath}`);
    }
  }
}
