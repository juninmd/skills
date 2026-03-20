import * as p from '@clack/prompts';
import color from 'picocolors';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parse, stringify } from 'comment-json';
import { detectTools, getToolNames } from '../utils/detector.js';
import { writeManifest, getCurrentPackageVersion } from '../utils/version.js';
import { createInstaller, getAvailableInstallers } from '../installers/index.js';
import { getLatestCommitHash } from '../utils/git.js';
import {
  getAgentsBundleDir,
  getPadraoLabsAgentsDir,
  getVSCodeSettingsPaths,
  getHomeDir,
  getRepoDir,
  getGlobalCopilotIgnorePath
} from '../utils/platform.js';
import { log } from '../utils/logger.js';
import { cron, isCronEnabled } from './cron.js';
import { fileExists, ensureDir, dirExists, syncSymlinksGranular, readFileList } from '../utils/fs.js';
import {
  VSCODE_SETTINGS_KEYS,
  DEFAULT_ADVANCED_SETTINGS,
  SETTING_DESCRIPTIONS
} from '../utils/vscode-settings.js';
import type { InstallOptions, InstallResult } from '../types.js';

function toPortablePath(p: string): string {
  const home = getHomeDir();
  let portable = p;
  if (p.startsWith(home)) {
    portable = '~' + p.slice(home.length);
  }
  return portable.replace(/\\/g, '/');
}

/**
 * Calcula e exibe o diff simplificado entre dois objetos de configuração.
 * Retorna o número de mudanças encontradas.
 */
function logSettingsDiff(path: string, oldSettings: any, newSettings: any): number {
  const diffs: string[] = [];
  const allKeys = new Set([...Object.keys(oldSettings), ...Object.keys(newSettings)]);

  for (const key of allKeys) {
    const oldValRaw = oldSettings[key];
    const newValRaw = newSettings[key];
    const oldValStr = JSON.stringify(oldValRaw);
    const newValStr = JSON.stringify(newValRaw);

    if (oldValStr !== newValStr) {
      const desc = SETTING_DESCRIPTIONS[key] ? ` - ${color.gray(SETTING_DESCRIPTIONS[key])}` : '';

      if (oldValRaw === undefined) {
        // Novo parametro
        diffs.push(`${color.green('+')} ${color.bold(key)}: ${color.green(newValStr)}${desc}`);
      } else if (newValRaw === undefined) {
        // Removido
        diffs.push(`${color.red('-')} ${color.bold(key)}${desc}`);
      } else {
        // Modificado (exibe valor antigo e novo)
        const valuesDiff = `(${color.dim(oldValStr)} -> ${color.yellow(newValStr)})`;
        diffs.push(`${color.yellow('~')} ${color.bold(key)}: ${valuesDiff}${desc}`);
      }
    }
  }

  if (diffs.length > 0) {
    p.log.step(`Alterações em ${color.cyan(toPortablePath(path))}:`);
    diffs.forEach(d => p.log.message(`  ${d}`));
  }

  return diffs.length;
}

export async function install(options: InstallOptions): Promise<void> {
  console.clear();

  // Logo ASCII compacto e moderno: PADRÃO LABS
  const logo = `
   ${color.blue('██████╗  █████╗ ██████╗ ██████╗  █████╗  ██████╗     ██╗      █████╗ ██████╗ ███████╗')}
   ${color.blue('██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔═══██╗    ██║     ██╔══██╗██╔══██╗██╔════╝')}
   ${color.green('██████╔╝███████║██║  ██║██████╔╝███████║██║   ██║    ██║     ███████║██████╔╝███████╗')}
   ${color.green('██╔═══╝ ██╔══██║██║  ██║██╔══██╗██╔══██║██║   ██║    ██║     ██╔══██║██╔══██╗╚════██║')}
   ${color.cyan('██║     ██║  ██║██████╔╝██║  ██║██║  ██║╚██████╔╝    ███████╗██║  ██║██████╔╝███████║')}
   ${color.cyan('╚═╝     ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝     ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝')}
   ${color.white(color.bold('                      L A B S   A G E N T S   E N G I N E'))} ${color.dim(`v${await getCurrentPackageVersion()}`)}
  ${color.dim('           https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents')}
  `;
  console.log(logo);
  console.log(color.dim('  ──────────────────────────────────────────────────────────'));

  // 0. Validar configuração de SSL do Git (VPN/Netskope)
  try {
    const sslVerify = execSync('git config --global http.sslVerify', { stdio: 'pipe' }).toString().trim();
    if (sslVerify !== 'false') {
      p.note(
        'A configuração "http.sslVerify" do Git não está definida como "false".\nIsso pode causar problemas de certificado (SSL) durante a instalação se você estiver na VPN ou Netskope.\nConsidere rodar: git config --global http.sslVerify false',
        color.yellow('Aviso de Rede / VPN')
      );
    }
  } catch (err) {
    // Se falhar, significa que a chave não está configurada (comportamento padrão é true)
    p.note(
      'A configuração "http.sslVerify" do Git não está definida como "false".\nIsso pode causar problemas de certificado (SSL) durante a instalação se você estiver na VPN ou Netskope.\nConsidere rodar: git config --global http.sslVerify false',
      color.yellow('Aviso de Rede / VPN')
    );
  }

  p.intro(`${color.bgBlue(color.white(color.bold(' INSTALADOR INTERATIVO ')))}`);

  // 1. Verificar e atualizar via Git
  const s = p.spinner();
  const repoDir = getRepoDir();
  if (!options.dryRun) {
    s.start(`Verificando atualizações em: ${color.dim(repoDir)}`);
    try {
      const isGitRepo = execSync('git rev-parse --is-inside-work-tree', { cwd: repoDir, stdio: 'pipe' }).toString().trim() === 'true';
      if (isGitRepo) {
        execSync('git fetch', { cwd: repoDir, stdio: 'pipe' });
        const local = execSync('git rev-parse @', { cwd: repoDir, stdio: 'pipe' }).toString().trim();
        const remote = execSync('git rev-parse @{u}', { cwd: repoDir, stdio: 'pipe' }).toString().trim();

        if (local !== remote) {
          s.message('Atualizando projeto automaticamente...');
          execSync('git pull', { cwd: repoDir, stdio: 'pipe' });
          s.stop('Projeto atualizado com sucesso.');
          p.note(`O projeto em ${color.cyan(repoDir)} foi atualizado. Por favor, reinicie o comando para garantir que as alterações mais recentes sejam aplicadas.`, 'RESTART NECESSÁRIO');
          process.exit(0);
        }
      }
      s.stop('Projeto já está na versão mais recente.');
    } catch (err) {
      s.stop(`Aviso: Não foi possível verificar atualizações em ${color.dim(repoDir)} (continuando com versão local).`);
    }
  }

  // 2. Detectar ferramentas
  let toolsToInstall: string[] = [];
  let installationMethod: 'plugins' | 'raiz' = 'plugins';
  let turboSettings = false;

  if (options.tools && options.tools.length > 0) {
    const available = getAvailableInstallers();
    const invalid = options.tools.filter(t => !available.includes(t));
    if (invalid.length > 0) {
      p.cancel(`Ferramentas desconhecidas: ${invalid.join(', ')}\nDisponiveis: ${available.join(', ')}`);
      process.exit(1);
    }
    toolsToInstall = options.tools;
  } else {
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

    const toolChoices = detections.map(d => ({
      value: d.name,
      label: (d as any).label || d.name,
      hint: d.detected ? 'Detectado' : 'Instalacao manual',
      disabled: d.name === 'gemini' || d.name === 'antigravity'
    }));

    const result = await p.multiselect({
      message: 'Quais ferramentas voce deseja configurar?',
      options: toolChoices,
      initialValues: detections.filter(d => d.detected && d.name.startsWith('vscode')).map(d => d.name),
      required: true
    });

    if (p.isCancel(result)) {
      p.cancel('Instalacao cancelada pelo usuario.');
      process.exit(0);
    }

    toolsToInstall = result as string[];
  }

  // 3. Perguntas específicas se VS Code selecionado
  const hasVSCode = toolsToInstall.some(t => t.startsWith('vscode'));
  if (hasVSCode) {
    const turbo = await p.confirm({
      message: 'Deseja turbinar as configurações do VS Code? (Otimiza o settings.json sem forçar caminhos de skills)',
      initialValue: true,
    });

    if (p.isCancel(turbo)) {
      p.cancel('Instalacao cancelada.');
      process.exit(0);
    }
    turboSettings = turbo;

    const method = await p.select({
      message: 'Selecione o meio de instalação para o VS Code:',
      options: [
        { value: 'plugins', label: 'Agent Plugins (Recomendado)', hint: 'Organização moderna por contexto' },
        { value: 'raiz', label: 'Raiz (Tradicional)', hint: 'Modifica pastas agents e skills diretamente' },
      ],
    });

    if (p.isCancel(method)) {
      p.cancel('Instalacao cancelada.');
      process.exit(0);
    }
    installationMethod = method as 'plugins' | 'raiz';

    const agentsDir = getPadraoLabsAgentsDir();
    if (installationMethod === 'raiz') {
      p.note(
        `Os componentes serão vinculados globalmente em:\n` +
        `${color.dim('• Agents:   ')} ${color.cyan(toPortablePath(join(agentsDir, 'agents')))}\n` +
        `${color.dim('• Skills:   ')} ${color.cyan(toPortablePath(join(agentsDir, 'skills')))}\n` +
        `${color.dim('• Rules:    ')} ${color.cyan(toPortablePath(join(agentsDir, 'rules')))}\n` +
        `${color.dim('• Workflows:')} ${color.cyan(toPortablePath(join(agentsDir, 'workflows')))}`,
        'Estrutura de Pastas (Modo Raiz)'
      );
    } else {
      p.note(
        'O modo Agent Plugins gerencia dinamicamente através do marketplace:\n' +
        '• Agentes customizados (.agent.md)\n' +
        '• Agent Skills (tools)\n' +
        '• Servidores MCP\n' +
        '• Hooks de Ciclo de Vida',
        'Escopo do Agent Plugins'
      );
    }
  }

  // Executa instalacao
  const results: InstallResult[] = [];

  for (const toolName of toolsToInstall) {
    if (toolName === 'vscode' || toolName === 'vscode-insiders') {
      const label = toolName === 'vscode' ? 'VS Code' : 'VS Code Insiders';
      await performVSCodeInstall(toolName, turboSettings, installationMethod, options);
      results.push({
        tool: toolName,
        skipped: false,
        copiedCategories: [
          { category: 'settings', filesCount: 1, targetDir: `${label} Settings` }
        ],
        summary: [
          `Instalação via ${installationMethod === 'plugins' ? 'Agent Plugins' : 'Modo Raiz'}`,
          turboSettings ? 'Configurações turbo habilitadas' : 'Configurações base'
        ]
      });
      continue;
    }

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
    const categoriesToScan = ['skills', 'agents', 'rules', 'workflows'];

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

    let summaryText = `${color.bold('Ferramentas:')} ${color.cyan(results.filter(r => !r.skipped).map(r => r.tool).join(', '))}\n`;
    summaryText += `${color.bold('Arquivos/Configuracoes:')} ${color.green(String(totalFiles))}\n`;

    summaryText += `\n${color.bold('Manifesto:')} ${color.dim('~/.agents/manifest.json')}`;

    p.note(summaryText, 'Resumo da Instalacao');
  }

  // Sugestao de auto-update via cron
  if (!options.dryRun && !isCronEnabled()) {
    const shouldEnableCron = await p.confirm({
      message: 'Deseja habilitar a atualizacao automatica diaria (auto-update)?',
      initialValue: true,
    });

    if (shouldEnableCron && !p.isCancel(shouldEnableCron)) {
      await cron({ remove: false });
    }
  }

  p.outro(`${color.green(color.bold('✔'))} Instalacao finalizada com sucesso!`);
}

async function performVSCodeInstall(toolName: string, turbo: boolean, method: 'plugins' | 'raiz', options: InstallOptions) {
  const allSettingsPaths = getVSCodeSettingsPaths();
  const agentsDir = getPadraoLabsAgentsDir();

  // Filtra caminhos baseado na variante (Stable vs Insiders)
  const variantKeyword = toolName === 'vscode-insiders' ? 'Insiders' : 'Code';
  const settingsPaths = allSettingsPaths.filter(p => {
    // No Linux/macOS o caminho do Insiders contém "Insiders"
    // No Windows o caminho do Insiders contém "Code - Insiders"
    if (toolName === 'vscode-insiders') {
      return p.includes('Insiders');
    }
    // Para VS Code estável, garantimos que NÃO tenha Insiders no caminho
    return !p.includes('Insiders');
  });

  if (settingsPaths.length === 0) return;

  const label = toolName === 'vscode' ? 'VS Code' : 'VS Code Insiders';
  p.log.step(`Configurando ${settingsPaths.length} perfis do ${label}...`);

  for (const settingsPath of settingsPaths) {
    if (await fileExists(settingsPath)) {
      let settings: any = {};
      let oldSettings: any = {};

      try {
        const raw = await readFile(settingsPath, 'utf-8');
        settings = parse(raw);
        oldSettings = parse(raw); // Cópia para o diff
      } catch (err) {
        p.log.error(`Erro ao ler ${settingsPath}: ${err instanceof Error ? err.message : String(err)}`);
        continue;
      }

      if (turbo) {
        for (const [key, value] of Object.entries(DEFAULT_ADVANCED_SETTINGS)) {
          if (key !== VSCODE_SETTINGS_KEYS.SKILLS_LOCS &&
            key !== VSCODE_SETTINGS_KEYS.AGENTS_LOCS &&
            key !== VSCODE_SETTINGS_KEYS.RULES_LOCS &&
            key !== VSCODE_SETTINGS_KEYS.PLUGINS_PATHS &&
            key !== VSCODE_SETTINGS_KEYS.PLUGINS_MARKETPLACES &&
            key !== VSCODE_SETTINGS_KEYS.PLUGINS_ENABLED) {
            settings[key] = value;
          }
        }
      }

      if (method === 'plugins') {
        // TODO: Permitir múltiplos marketplaces e ordenação personalizada no futuro
        const marketplaceUri = "ssh://git@gitlab.luizalabs.com/luizalabs/padrao-labs-agents.git";

        const marketplaces = settings[VSCODE_SETTINGS_KEYS.PLUGINS_MARKETPLACES] || [];

        if (Array.isArray(marketplaces)) {
          if (!marketplaces.includes(marketplaceUri)) {
            marketplaces.push(marketplaceUri);
          }
        } else {
          settings[VSCODE_SETTINGS_KEYS.PLUGINS_MARKETPLACES] = [marketplaceUri];
        }

        settings[VSCODE_SETTINGS_KEYS.PLUGINS_MARKETPLACES] = marketplaces;
        settings[VSCODE_SETTINGS_KEYS.PLUGINS_ENABLED] = true;
      } else {
        const skillsLocs = settings[VSCODE_SETTINGS_KEYS.SKILLS_LOCS] || {};
        const agentsLocs = settings[VSCODE_SETTINGS_KEYS.AGENTS_LOCS] || {};
        const rulesLocs = settings[VSCODE_SETTINGS_KEYS.RULES_LOCS] || {};
        const promptLocs = settings[VSCODE_SETTINGS_KEYS.PROMPT_LOCS] || {};

        skillsLocs[toPortablePath(join(agentsDir, 'skills'))] = true;
        agentsLocs[toPortablePath(join(agentsDir, 'agents'))] = true;
        rulesLocs[toPortablePath(join(agentsDir, 'rules'))] = true;
        promptLocs[toPortablePath(join(agentsDir, 'workflows'))] = true;

        settings[VSCODE_SETTINGS_KEYS.SKILLS_LOCS] = skillsLocs;
        settings[VSCODE_SETTINGS_KEYS.AGENTS_LOCS] = agentsLocs;
        settings[VSCODE_SETTINGS_KEYS.RULES_LOCS] = rulesLocs;
        settings[VSCODE_SETTINGS_KEYS.PROMPT_LOCS] = promptLocs;
      }

      // Exibe o diff antes de salvar
      const changeCount = logSettingsDiff(settingsPath, oldSettings, settings);

      if (changeCount === 0) {
        p.log.info(`🚀 ${color.green('Tudo em ordem!')} As configurações em ${color.cyan(toPortablePath(settingsPath))} já estavam atualizadas.`);
      }

      if (!options.dryRun && changeCount > 0) {
        await writeFile(settingsPath, stringify(settings, null, 2), 'utf-8');
        p.log.success(`✅ Configurações salvas em ${color.cyan(toPortablePath(settingsPath))}`);
      }

      const keybindingsPath = settingsPath.replace(/settings\.json$/, 'keybindings.json');
      const kbChanges = await configureVSCodeKeybindings(keybindingsPath, options);
      if (kbChanges === 0) {
        p.log.info(`🚀 ${color.green('Tudo em ordem!')} Os atalhos em ${color.cyan(toPortablePath(keybindingsPath))} já estavam atualizados.`);
      }
    }
  }

  // Gera o ~/.copilotignore global
  if (!options.dryRun) {
    await generateCopilotIgnore();
    p.log.success(`✅ Arquivo ${color.cyan('~/.copilotignore')} global configurado`);
  }

  if (method === 'raiz' && !options.dryRun) {
    const bundleDir = getAgentsBundleDir();
    await ensureDir(agentsDir);
    await syncSymlinksGranular(join(bundleDir, 'skills'), join(agentsDir, 'skills'));
    await syncSymlinksGranular(join(bundleDir, 'agents'), join(agentsDir, 'agents'));
    await syncSymlinksGranular(join(bundleDir, 'rules'), join(agentsDir, 'rules'));
    await syncSymlinksGranular(join(bundleDir, 'workflows'), join(agentsDir, 'workflows'));
  }
}

async function configureVSCodeKeybindings(keybindingsPath: string, options: InstallOptions): Promise<number> {
  if (options.dryRun) {
    p.log.step(`Configuraria VS Code keybindings.json: ${toPortablePath(keybindingsPath)}`);
    return 1;
  }

  let keybindings: any[] = [];

  if (await fileExists(keybindingsPath)) {
    try {
      const raw = await readFile(keybindingsPath, 'utf-8');
      const parsed = parse(raw);
      if (Array.isArray(parsed)) {
        keybindings = parsed;
      }
    } catch {
      // Ignora erro e recria do zero
    }
  }

  const newBinding = {
    key: "ctrl+shift+insert",
    command: "aiCustomization.openManagementEditor",
    when: "chatIsEnabled && config.chat.customizationsMenu.enabled"
  };

  const exists = keybindings.some(b => b.key === newBinding.key && b.command === newBinding.command);
  
  if (!exists) {
    keybindings.push(newBinding);
    
    p.log.step(`Alterações em ${color.cyan(toPortablePath(keybindingsPath))}:`);
    p.log.message(`  ${color.green('+')} ${color.bold('Adicionado atalho:')} ${color.green(newBinding.key)} -> ${color.yellow(newBinding.command)}`);
    
    await ensureDir(join(keybindingsPath, '..'));
    await writeFile(keybindingsPath, stringify(keybindings, null, 2), 'utf-8');
    p.log.success(`✅ Atalhos salvos em ${color.cyan(toPortablePath(keybindingsPath))}`);
    
    return 1;
  }
  
  return 0;
}

async function generateCopilotIgnore(): Promise<void> {
  const ignorePath = getGlobalCopilotIgnorePath();
  const MANAGED_HEADER = '# Gerenciado por padrao-labs-agents CLI';

  const baseline = [
    MANAGED_HEADER,
    '# Secrets & Credentials',
    '.env',
    '.env.*',
    '**/*.pem',
    '**/*.key',
    'secrets/',
    '',
    '# Build Artifacts',
    'dist/',
    'build/',
    '.next/',
    'out/',
    '',
    '# Package Managers & Context',
    'node_modules/',
    '.venv/',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock'
  ].join('\n');

  let current = '';
  if (await fileExists(ignorePath)) {
    try {
      current = await readFile(ignorePath, 'utf-8');
    } catch { /* ignore */ }
  }

  if (current.includes(MANAGED_HEADER)) {
    await writeFile(ignorePath, baseline, 'utf-8');
  } else {
    const separator = current.trim() ? '\n\n' : '';
    await writeFile(ignorePath, baseline + separator + current, 'utf-8');
  }
}
