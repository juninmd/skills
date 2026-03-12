import * as p from '@clack/prompts';
import color from 'picocolors';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { detectTools, getToolNames } from '../utils/detector.js';
import { writeManifest, getCurrentPackageVersion } from '../utils/version.js';
import { createInstaller, getAvailableInstallers } from '../installers/index.js';
import { syncRepository, getLatestCommitHash } from '../utils/git.js';
import { getAgentsBundleDir } from '../utils/platform.js';
import { log } from '../utils/logger.js';
import type { InstallOptions, InstallResult } from '../types.js';

export async function install(options: InstallOptions): Promise<void> {
  console.clear();
  
  // Logo ASCII impactante (Simetria total da letra O e alinhamento de blocos)
  const logo = `
   ${color.blue('██████╗ ')}  ${color.magenta('█████╗ ')}  ${color.blue('██████╗ ')}  ${color.magenta('██████╗ ')}  ${color.blue('█████╗ ')}   ${color.magenta('██████╗ ')}
   ${color.blue('██╔══██╗')} ${color.magenta('██╔══██╗')} ${color.blue('██╔══██╗')} ${color.magenta('██╔══██╗')} ${color.blue('██╔══██╗')}  ${color.magenta('██╔═══██╗')}
   ${color.blue('██████╔╝')} ${color.magenta('███████║')} ${color.blue('██║  ██║')} ${color.magenta('██████╔╝')} ${color.blue('███████║')}  ${color.magenta('██║   ██║')}
   ${color.blue('██╔═══╝ ')} ${color.magenta('██╔══██║')} ${color.blue('██║  ██║')} ${color.magenta('██╔══██╗')} ${color.blue('██╔══██║')}  ${color.magenta('██║   ██║')}
   ${color.blue('██║     ')} ${color.magenta('██║  ██║')} ${color.blue('██████╔╝')} ${color.magenta('██║  ██║')} ${color.blue('██║  ██║')}  ${color.magenta('████████║')}
   ${color.blue('╚═╝     ')} ${color.magenta('╚═╝  ╚═╝')} ${color.blue('╚═════╝ ')} ${color.magenta('╚═╝  ╚═╝')} ${color.blue('╚═╝  ╚═╝')}   ${color.magenta('╚═══════╝')}
          ${color.cyan(color.bold('L A B S   A G E N T S   E N G I N E'))} ${color.dim(`v${await getCurrentPackageVersion()}`)}
  ${color.dim('https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents')}
  `;  
  console.log(logo);
  console.log(color.dim('  ──────────────────────────────────────────────────────────'));
  
  p.intro(`${color.bgBlue(color.white(color.bold(' INSTALADOR INTERATIVO ')))}`);

  // Determina quais ferramentas instalar
  let toolsToInstall: string[] = [];

  if (options.tools && options.tools.length > 0) {
    const available = getAvailableInstallers();
    const invalid = options.tools.filter(t => !available.includes(t));
    if (invalid.length > 0) {
      p.cancel(`Ferramentas desconhecidas: ${invalid.join(', ')}\nDisponiveis: ${available.join(', ')}`);
      process.exit(1);
    }
    toolsToInstall = options.tools;
  } else {
    const s = p.spinner();
    s.start('Detectando ferramentas instaladas...');
    const detections = await detectTools();
    const detected = detections.filter(d => d.detected);
    s.stop('Deteccao concluida.');

    if (detected.length > 0) {
      p.note(
        detected.map(d => `${color.green('✔')} ${color.bold(d.name.padEnd(12))} -> ${color.dim(d.detectedPath!)}`).join('\n'),
        'Ferramentas Encontradas'
      );
    }

    const availableTools = getToolNames();
    const toolChoices = availableTools.map(t => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
      hint: detected.find(d => d.name === t) ? 'Detectado' : 'Nao detectado'
    }));

    // Copilot habilitado por padrão, os outros desmarcados (mesmo se detectados)
    const result = await p.multiselect({
      message: 'Quais ferramentas voce deseja configurar?',
      options: toolChoices,
      initialValues: ['copilot'], // Apenas copilot por padrão
      required: true
    });

    if (p.isCancel(result)) {
      p.cancel('Instalacao cancelada pelo usuario.');
      process.exit(0);
    }

    toolsToInstall = result as string[];
  }

  const s = p.spinner();

  if (!options.dryRun) {
    s.start('Sincronizando repositorio oficial (git pull)...');
    try {
      syncRepository();
      s.stop('Repositorio sincronizado com sucesso.');
    } catch (err) {
      s.stop('Aviso: Falha ao sincronizar repositorio (usando versao local).');
    }
  }

  // Executa instalacao
  const results: InstallResult[] = [];
  
  for (const toolName of toolsToInstall) {
    s.start(`Instalando contextos para ${color.cyan(color.bold(toolName))}...`);
    const installer = createInstaller(toolName, options);
    if (!installer) {
      s.stop(`Aviso: Instalador nao encontrado para: ${toolName}`);
      continue;
    }

    try {
      const result = await installer.install();
      results.push(result);
      s.stop(`Concluido para ${color.cyan(color.bold(toolName))}.`);
    } catch (err) {
      s.stop(`Erro ao instalar ${color.red(toolName)}.`);
      p.log.error(err instanceof Error ? err.message : String(err));
      results.push({
        tool: toolName,
        skipped: true,
        reason: String(err),
        copiedCategories: [],
      });
    }
  }

  // Salva manifest e exibe resumo detalhado
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

    // Coleta inventário de componentes para o manifesto
    const agentsBundleDir = getAgentsBundleDir();
    const inventory: any = {};
    const categoriesToScan = ['skills', 'agents', 'rules', 'workflows', 'hooks'];
    
    for (const cat of categoriesToScan) {
      try {
        const catPath = join(agentsBundleDir, cat);
        const entries = await readdir(catPath);
        inventory[cat] = entries.filter(e => !e.startsWith('.') && e !== 'index.md');
      } catch {
        inventory[cat] = [];
      }
    }

    await writeManifest({
      version: await getCurrentPackageVersion(),
      installedAt: new Date().toISOString(),
      tools: results.filter(r => !r.skipped).map(r => r.tool),
      commitHash: getLatestCommitHash(),
      categories,
      inventory,
    });

    // Construção do resumo detalhado
    let summaryText = `${color.bold('Ferramentas:')} ${color.cyan(results.filter(r => !r.skipped).map(r => r.tool).join(', '))}\n`;
    summaryText += `${color.bold('Arquivos linkados (syslin):')} ${color.green(String(totalFiles))}\n`;
    
    summaryText += `\n${color.bold('Categorias instaladas:')}\n`;
    for (const [cat, count] of Object.entries(categories)) {
      summaryText += `  ${color.blue('•')} ${cat.padEnd(12)}: ${color.yellow(String(count))} arquivos\n`;
    }

    // Adiciona sumário de configurações específicas dos installers
    const extraConfigs = results.filter(r => !r.skipped).flatMap(r => r.summary || []);
    if (extraConfigs.length > 0) {
      summaryText += `\n${color.bold('Configuracoes habilitadas:')}\n`;
      for (const config of extraConfigs) {
        summaryText += `  ${color.green('✔')} ${config}\n`;
      }
    }

    summaryText += `\n${color.bold('Manifesto:')} ${color.dim('~/.agents/manifest.json')}`;

    p.note(summaryText, 'Resumo da Instalacao');
  }

  p.outro(`${color.green(color.bold('✔'))} Instalacao finalizada com sucesso!`);
}
