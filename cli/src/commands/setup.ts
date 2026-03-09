import { parse, stringify } from 'comment-json';
import { execSync, spawnSync } from 'node:child_process';
import { log } from '../utils/logger.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { getVSCodeSettingsPaths, getPadraoLabsAgentsDir, getGlobalCopilotIgnorePath, getHomeDir } from '../utils/platform.js';
import { cron } from './cron.js';

const REGISTRY_URL = 'https://nexus.luizalabs.com/repository/npm/';
const SCOPE = '@luizalabs';

export async function setup(): Promise<void> {
  log.header('Configuração de Ambiente Luizalabs Agents');

  log.info('Selecione a abordagem de instalação das regras e agentes:');
  console.log('  1) GitLab (Cron) [Recomendado] - Baixa e atualiza os arquivos localmente via Git');
  console.log('  2) Nexus [Beta] - Instala via gerenciador de extensões privado do VS Code');
  
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question('\nEscolha [1 ou 2]: ');
  rl.close();

  const choice = answer.trim();

  // 1. Identifica o ambiente global
  const vscodeUserPaths = getVSCodeSettingsPaths();
  const agentsDir = getPadraoLabsAgentsDir();

  log.info('Detectando ambiente...');
  
  // VS Code
  log.success('IDE detectada: VS Code (Configurações do usuário e Perfis Sincronizados)');
  log.detail(`- O VS Code suporta perfis. A configuração será injetada em TODOS os perfis encontrados.`);
  vscodeUserPaths.forEach(p => log.detail(`  - ${p}`));
  
  // Antigravity
  const antigravityDir = path.join(getHomeDir(), '.gemini', 'antigravity');
  const hasAntigravity = fs.existsSync(antigravityDir);
  if (hasAntigravity) {
    log.success('Agente detectado: Google Antigravity');
    log.detail(`- Pasta encontrada: ${antigravityDir}`);
  }
  
  // Log das pastas de destino
  log.info('Destino físico dos artefatos:');
  log.detail(`- Base: ${agentsDir}`);
  log.detail(`- Skills: ${path.join(agentsDir, 'skills')}`);
  log.detail(`- Agents: ${path.join(agentsDir, 'agents')}`);
  log.detail(`- Rules: ${path.join(agentsDir, 'rules')}`);
  log.detail(`- Hooks: ${path.join(agentsDir, 'hooks')}`);
  log.detail(`- Workflows: ${path.join(agentsDir, 'workflows')}`);

  if (choice === '1' || choice === '') { // Default para enter vazio
    await setupGitlabCron(vscodeUserPaths, hasAntigravity);
  } else if (choice === '2') {
    await setupNexus(vscodeUserPaths, hasAntigravity);
  } else {
    log.error('Opção inválida. Saindo.');
    process.exit(1);
  }
}

async function setupNexus(vscodeUserPaths: string[], hasAntigravity: boolean): Promise<void> {
  log.header('Configuração via Nexus (Extensão)');

  log.info(`Verificando autenticação no Nexus Luizalabs (${REGISTRY_URL})...`);

  try {
    execSync(`npm config set ${SCOPE}:registry ${REGISTRY_URL}`, { stdio: 'ignore' });
    log.detail(`- Escopo ${SCOPE} mapeado para ${REGISTRY_URL}`);
  } catch (err) {
    log.error('Falha ao configurar o registro do escopo.');
  }

  let isAuthenticated = false;
  try {
    execSync(`npm view @shell-components/core version --registry ${REGISTRY_URL}`, {
      stdio: 'ignore',
    });
    isAuthenticated = true;
  } catch (err: any) {
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    log.warn('Você não está autenticado no Nexus privado ou seu token expirou.');
    log.info('Iniciando fluxo de login interativo...');
    
    const result = spawnSync('npm', ['login', '--registry', REGISTRY_URL, '--scope', SCOPE], {
      stdio: 'inherit',
      shell: true,
    });

    if (result.status !== 0) {
      log.error('O login falhou ou foi cancelado.');
      process.exit(1);
    }
    log.success('Login concluído com sucesso! ~/.npmrc atualizado.');
  } else {
    log.success('Sua autenticação no Nexus está válida!');
  }

  for (const settingsFile of vscodeUserPaths) {
    configureGlobalPrivateRegistry(settingsFile);
    configureGlobalVSCodeSettings(settingsFile);
  }
  configureGlobalCopilotIgnore();
  if (hasAntigravity) configureGlobalAntigravity();
}

async function setupGitlabCron(vscodeUserPaths: string[], hasAntigravity: boolean): Promise<void> {
  log.header('Configuração via GitLab (Cron)');

  for (const settingsFile of vscodeUserPaths) {
    configureGlobalVSCodeSettings(settingsFile);
  }
  configureGlobalCopilotIgnore();
  if (hasAntigravity) configureGlobalAntigravity();

  
  log.info('Acionando configuração do job de sincronização no sistema...');
  await cron({ remove: false });
}

function logSettingsDiff(oldSettings: any, newSettings: any) {
  let hasChanges = false;
  for (const key of Object.keys(newSettings)) {
    const oldStr = stringify(oldSettings[key]);
    const newStr = stringify(newSettings[key]);
    
    if (oldStr !== newStr) {
      hasChanges = true;
      if (oldSettings[key] === undefined) {
        const displayVal = newStr.length > 60 ? '(novo objeto/array)' : newStr;
        log.detail(`  [+] ${key}: ${displayVal}`);
      } else {
        const displayVal = newStr.length > 60 ? '(modificado)' : `${oldStr} -> ${newStr}`;
        log.detail(`  [~] ${key}: ${displayVal}`);
      }
    }
  }
  if (!hasChanges) {
    log.detail('  (Nenhuma configuração precisou ser alterada)');
  }
}

function configureGlobalPrivateRegistry(settingsFile: string) {
  log.info('Configurando Private Extension Manager globalmente...');

  let settings: any = {};
  let originalSettings: any = {};
  if (fs.existsSync(settingsFile)) {
    try {
      const raw = fs.readFileSync(settingsFile, 'utf-8');
      settings = parse(raw || '{}');
      originalSettings = parse(raw || '{}');
    } catch (e) {
      log.error(`Falha ao ler ${settingsFile}. O arquivo pode conter erros de sintaxe. Para evitar perda de dados, a configuração foi abortada.`);
      return;
    }
  }

  if (!settings['privateExtensions.registries']) {
    settings['privateExtensions.registries'] = [];
  }

  const registries = settings['privateExtensions.registries'];
  const hasRegistry = registries.some((r: any) => r.url === REGISTRY_URL || r.registry === REGISTRY_URL);
  
  if (!hasRegistry) {
    registries.push({
      name: "Luizalabs Nexus (NPM)",
      type: "npm",
      enable: true,
      url: REGISTRY_URL
    });
  }

  log.info('Diff de alterações do Registry:');
  logSettingsDiff(originalSettings, settings);

  fs.writeFileSync(settingsFile, stringify(settings, null, 2), 'utf-8');
  log.success(`Registry global configurado em: ${settingsFile}`);
}

function configureGlobalVSCodeSettings(settingsFile: string) {
  log.info('Aplicando diretrizes globais do Copilot no VS Code...');

  let settings: any = {};
  let originalSettings: any = {};
  if (fs.existsSync(settingsFile)) {
    try {
      const raw = fs.readFileSync(settingsFile, 'utf-8');
      settings = parse(raw || '{}');
      originalSettings = parse(raw || '{}');
    } catch (e) {
      log.error(`Falha ao ler ${settingsFile}. O arquivo pode conter erros de sintaxe. Para evitar perda de dados, a configuração foi abortada.`);
      return;
    }
  }

  const agentsDir = getPadraoLabsAgentsDir();
  const instructionsPath = path.join(agentsDir, 'copilot-instructions.md');

  if (!settings['github.copilot.chat.codeGeneration.instructions']) {
    settings['github.copilot.chat.codeGeneration.instructions'] = [];
  }
  
  const instructions = settings['github.copilot.chat.codeGeneration.instructions'];
  const hasInstruction = instructions.some((i: any) => i.file === instructionsPath);
  
  if (!hasInstruction) {
    instructions.push({ file: instructionsPath });
  }

  if (!settings['github.copilot.enable']) {
    settings['github.copilot.enable'] = {};
  }
  const enable = settings['github.copilot.enable'];
  const disabledLangs = ['plaintext', 'scminput', 'dotenv', 'ignore', 'properties', 'markdown'];
  
  for (const lang of disabledLangs) {
    enable[lang] = false;
  }

  const advancedSettings: Record<string, any> = {
    "chat.mcp.autostart": "newAndOutdated",
    "chat.agent.maxRequests": 1000,
    "chat.agent.enabled": true,
    "chat.agentSessionProjection.enabled": true,
    "chat.editing.explainChanges.enabled": true,
    "chat.editMode.hidden": true,
    "chat.experimental.useSkillAdherencePrompt": true,
    "chat.tools.terminal.autoReplyToPrompts": true,
    "chat.useNestedAgentsMdFiles": true,
    "github.copilot.chat.agent.autoFix": true,
    "github.copilot.chat.codesearch.enabled": true,
    "github.copilot.chat.copilotMemory.enabled": true,
    "chat.mcp.gallery.enabled": true,
    "chat.customAgentInSubagent.enabled": true,
    "chat.useAgentSkills": true,
    "github.copilot.chat.githubMcpServer.readonly": true,
    "github.copilot.chat.languageContext.fix.typescript.enabled": true,
    "github.copilot.chat.switchAgent.enabled": true,
    "chat.viewSessions.orientation": "stacked"
  };

  for (const [key, value] of Object.entries(advancedSettings)) {
    settings[key] = value;
  }

  log.info('Diff de alterações do VS Code Settings:');
  logSettingsDiff(originalSettings, settings);

  fs.writeFileSync(settingsFile, stringify(settings, null, 2), 'utf-8');
  log.success(`Arquivo global configurado: ${settingsFile}`);
}

function configureGlobalCopilotIgnore() {
  const ignoreFile = getGlobalCopilotIgnorePath();
  const ignoreContent = 'node_modules/\n';

  log.info('Configurando ignorados globais do Copilot...');

  if (!fs.existsSync(ignoreFile)) {
    fs.writeFileSync(ignoreFile, ignoreContent, 'utf-8');
    log.success(`Arquivo global criado: ${ignoreFile}`);
    log.detail('- node_modules/ adicionado à lista global de exclusão.');
  } else {
    let current = fs.readFileSync(ignoreFile, 'utf-8');
    if (!current.includes('node_modules/')) {
      fs.appendFileSync(ignoreFile, `\n${ignoreContent}`);
      log.success(`Arquivo global atualizado: ${ignoreFile}`);
      log.detail('- node_modules/ adicionado à lista global de exclusão.');
    } else {
      log.info(`O arquivo ${ignoreFile} já possui exclusão para node_modules/.`);
    }
  }
}

function configureGlobalAntigravity() {
  const geminiDir = path.join(getHomeDir(), '.gemini');
  const antigravityDir = path.join(geminiDir, 'antigravity');
  const geminiMdPath = path.join(geminiDir, 'GEMINI.md');
  const agentsMdTarget = path.join(antigravityDir, 'AGENTS.md');
  const importLine = `@${agentsMdTarget}`;

  log.info('Configurando regras globais para o Google Antigravity...');

  if (!fs.existsSync(geminiMdPath)) {
    fs.writeFileSync(geminiMdPath, `${importLine}\n`, 'utf-8');
    log.success(`Arquivo global criado: ${geminiMdPath}`);
    log.detail(`- Regra global importada: ${importLine}`);
  } else {
    const current = fs.readFileSync(geminiMdPath, 'utf-8');
    if (!current.includes(importLine)) {
      // Garante uma quebra de linha caso o arquivo não termine com uma
      const prefix = current.endsWith('\n') ? '' : '\n';
      fs.appendFileSync(geminiMdPath, `${prefix}${importLine}\n`);
      log.success(`Arquivo global atualizado: ${geminiMdPath}`);
      log.detail(`- Regra global anexada: ${importLine}`);
    } else {
      log.info(`O arquivo ${geminiMdPath} já importa as regras globais (${importLine}).`);
    }
  }
}
