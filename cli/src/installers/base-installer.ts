import { join } from 'node:path';
import { copyFile } from 'node:fs/promises';
import { cleanAndCopy, ensureDir, dirExists } from '../utils/fs.js';
import { getAgentsBundleDir, getMasterAgentsPath } from '../utils/platform.js';
import { log } from '../utils/logger.js';
import type { InstallOptions, InstallResult, CategoryResult, CategoryMapping } from '../types.js';

export abstract class BaseInstaller {
  protected agentsDir: string;
  protected options: InstallOptions;

  constructor(options: InstallOptions) {
    this.agentDir = getAgentsBundleDir();
    this.options = options;
  }

  abstract get name(): string;
  abstract get targetDir(): string;
  abstract get categoryMappings(): CategoryMapping[];

  isDetected(): boolean {
    // Subclasses can override for custom detection
    return true;
  }

  async install(): Promise<InstallResult> {
    const result: InstallResult = {
      tool: this.name,
      skipped: false,
      copiedCategories: [],
    };

    log.step(`Instalando para ${this.name}...`);

    if (this.options.verbose) {
      log.detail(`Diretorio alvo: ${this.targetDir}`);
    }

    for (const mapping of this.categoryMappings) {
      const srcDir = join(this.agentDir, mapping.source);
      const destDir = join(this.targetDir, mapping.target);

      if (!(await dirExists(srcDir))) {
        if (this.options.verbose) {
          log.detail(`Fonte nao encontrada: ${mapping.source} (pulando)`);
        }
        continue;
      }

      if (this.options.dryRun) {
        log.dryRun(`Copiaria ${mapping.source} -> ${destDir}`);
        result.copiedCategories.push({
          category: mapping.source,
          filesCount: 0,
          targetDir: destDir,
        });
        continue;
      }

      const count = await cleanAndCopy(srcDir, destDir);
      result.copiedCategories.push({
        category: mapping.source,
        filesCount: count,
        targetDir: destDir,
      });

      if (this.options.verbose) {
        log.detail(`${mapping.source}: ${count} arquivos copiados`);
      }
    }

    await this.postInstall();

    const totalFiles = result.copiedCategories.reduce((sum, c) => sum + c.filesCount, 0);
    if (!this.options.dryRun) {
      log.success(`${this.name}: ${totalFiles} arquivos instalados`);
    }

    return result;
  }

  protected async postInstall(): Promise<void> {
    // Override in subclasses for tool-specific post-processing
  }

  protected async copyAgentsMd(destPath: string): Promise<void> {
    const masterPath = getMasterAgentsPath();
    if (this.options.dryRun) {
      log.dryRun(`Copiaria agents.md -> ${destPath}`);
      return;
    }
    await ensureDir(join(destPath, '..'));
    await copyFile(masterPath, destPath);
  }

  protected async concatenateRulesToFile(destPath: string): Promise<void> {
    const { readdir, readFile, writeFile } = await import('node:fs/promises');
    const rulesDir = join(this.agentDir, 'rules');

    if (!(await dirExists(rulesDir))) return;

    const files = await readdir(rulesDir);
    const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'index.md');

    let content = '# Padrao Labs - Regras de Desenvolvimento\n\n';
    content += '<!-- Gerado automaticamente por @luizalabs/padrao-labs-agents -->\n\n';

    for (const file of mdFiles.sort()) {
      const filePath = join(rulesDir, file);
      const ruleContent = await readFile(filePath, 'utf-8');
      const ruleName = file.replace('.md', '').replace(/_/g, ' ');
      content += `\n---\n\n## ${ruleName}\n\n${ruleContent}\n`;
    }

    if (this.options.dryRun) {
      log.dryRun(`Geraria regras concatenadas -> ${destPath}`);
      return;
    }

    await ensureDir(join(destPath, '..'));
    await writeFile(destPath, content, 'utf-8');
  }
}
