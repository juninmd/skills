import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { detectTools, getToolNames } from '../utils/detector.js';
import { writeManifest, getCurrentPackageVersion } from '../utils/version.js';
import { createInstaller, getAvailableInstallers } from '../installers/index.js';
import { log } from '../utils/logger.js';
import type { InstallOptions, InstallResult } from '../types.js';

export async function install(options: InstallOptions): Promise<void> {
  log.header('Padrao Labs Agents - Instalacao Global');

  // Determina quais ferramentas instalar
  let toolsToInstall: string[];

  if (options.tools && options.tools.length > 0) {
    // Ferramentas especificadas pelo usuario
    const available = getAvailableInstallers();
    const invalid = options.tools.filter(t => !available.includes(t));
    if (invalid.length > 0) {
      log.error(`Ferramentas desconhecidas: ${invalid.join(', ')}`);
      log.info(`Disponiveis: ${available.join(', ')}`);
      process.exit(1);
    }
    toolsToInstall = options.tools;
  } else {
    // Auto-detecta ferramentas instaladas
    log.info('Detectando ferramentas instaladas...');
    const detections = await detectTools();
    const detected = detections.filter(d => d.detected);

    if (detected.length > 0) {
      log.success('Ferramentas detectadas:');
      detected.forEach(d => {
        log.detail(`${d.name.padEnd(12)} -> ${d.detectedPath}`);
      });
      toolsToInstall = detected.map(d => d.name);
    } else {
      // Nenhuma detectada, pergunta ao usuario
      log.warn('Nenhuma ferramenta detectada automaticamente.');
      toolsToInstall = await promptToolSelection();

      if (toolsToInstall.length === 0) {
        log.info('Nenhuma ferramenta selecionada. Saindo.');
        return;
      }
    }
  }

  // Executa instalacao
  const results: InstallResult[] = [];

  for (const toolName of toolsToInstall) {
    const installer = createInstaller(toolName, options);
    if (!installer) {
      log.warn(`Installer nao encontrado para: ${toolName}`);
      continue;
    }

    try {
      const result = await installer.install();
      results.push(result);
    } catch (err) {
      log.error(`Falha ao instalar para ${toolName}: ${err instanceof Error ? err.message : String(err)}`);
      results.push({
        tool: toolName,
        skipped: true,
        reason: String(err),
        copiedCategories: [],
      });
    }
  }

  // Salva manifest
  if (!options.dryRun) {
    const totalFiles = results
      .filter(r => !r.skipped)
      .flatMap(r => r.copiedCategories)
      .reduce((sum, c) => sum + c.filesCount, 0);

    const categories: Record<string, number> = {};
    for (const r of results) {
      for (const c of r.copiedCategories) {
        categories[c.category] = (categories[c.category] || 0) + c.filesCount;
      }
    }

    await writeManifest({
      version: await getCurrentPackageVersion(),
      installedAt: new Date().toISOString(),
      tools: results.filter(r => !r.skipped).map(r => r.tool),
      categories,
    });

    // Resumo
    log.header('Resumo da Instalacao');
    log.table([
      ['Ferramentas', results.filter(r => !r.skipped).map(r => r.tool).join(', ')],
      ['Total arquivos', String(totalFiles)],
      ['Manifest', '~/.padrao-labs/manifest.json'],
    ]);
  }

  console.log('');
  log.success('Instalacao concluida!');
}

async function promptToolSelection(): Promise<string[]> {
  const rl = createInterface({ input: stdin, output: stdout });
  const tools = getToolNames();

  console.log('\nSelecione as ferramentas para instalar (separadas por virgula):');
  tools.forEach((t, i) => console.log(`  ${i + 1}) ${t}`));
  console.log(`  A) Todas`);

  const answer = await rl.question('\nEscolha [1-7, A]: ');
  rl.close();

  const trimmed = answer.trim().toUpperCase();

  if (trimmed === 'A') {
    return tools;
  }

  const indices = trimmed.split(',').map(s => parseInt(s.trim(), 10) - 1);
  return indices
    .filter(i => i >= 0 && i < tools.length)
    .map(i => tools[i]);
}
