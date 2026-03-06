import { execSync, spawnSync } from 'node:child_process';
import { log } from '../utils/logger.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const REGISTRY_URL = 'https://nexus.luizalabs.com/repository/npm/';
const SCOPE = '@luizalabs';
const EXTENSION_ID = '@luizalabs/padrao-labs-agents';

export async function setup(): Promise<void> {
  log.info('Selecione a abordagem de instalação das regras e agentes:');
  console.log('  1) Nexus (Recomendado) - Instala via extensão do VS Code');
  console.log('  2) GitLab (Cron) - Baixa os arquivos localmente via cron');
  
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question('\nEscolha [1 ou 2]: ');
  rl.close();

  const choice = answer.trim();

  if (choice === '1') {
    await setupNexus();
  } else if (choice === '2') {
    await setupGitlabCron();
  } else {
    log.error('Opção inválida. Saindo.');
    process.exit(1);
  }
}

async function setupNexus(): Promise<void> {
  log.info(`Verificando autenticação no Nexus Luizalabs (${REGISTRY_URL})...`);

  // 1. Garante que o NPM saiba onde encontrar o escopo @luizalabs
  try {
    execSync(`npm config set ${SCOPE}:registry ${REGISTRY_URL}`, { stdio: 'ignore' });
  } catch (err) {
    log.error('Falha ao configurar o registro do escopo.');
  }

  // 2. Testa a conexão tentando ler a versão de um pacote conhecido que exige auth
  let isAuthenticated = false;
  try {
    execSync(`npm view @shell-components/core version --registry ${REGISTRY_URL}`, {
      stdio: 'ignore',
    });
    isAuthenticated = true;
  } catch (err: any) {
    isAuthenticated = false;
  }

  // 3. Se não estiver autenticado, força o login interativo no terminal
  if (!isAuthenticated) {
    log.warn('Você não está autenticado no Nexus privado ou seu token expirou.');
    log.info('Iniciando fluxo de login. Por favor, insira suas credenciais da rede Luizalabs:');
    
    const result = spawnSync('npm', ['login', '--registry', REGISTRY_URL, '--scope', SCOPE], {
      stdio: 'inherit',
      shell: true,
    });

    if (result.status !== 0) {
      log.error('O login falhou ou foi cancelado.');
      process.exit(1);
    }

    log.success('Login concluído com sucesso! Arquivo .npmrc atualizado.');
  } else {
    log.success('Sua autenticação no Nexus está válida!');
  }

  // 4. Configura os arquivos do VS Code para a extensão privada
  const vscodeDir = path.join(process.cwd(), '.vscode');
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  configureVSCodePrivateExtensions(vscodeDir);
  configureVSCodeSettings(vscodeDir);
  configureCopilotIgnore();
}

async function setupGitlabCron(): Promise<void> {
  log.info('Configurando VS Code para ler regras sincronizadas via GitLab (Cron)...');
  const vscodeDir = path.join(process.cwd(), '.vscode');
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  configureVSCodeSettings(vscodeDir);
  configureCopilotIgnore();
}

function configureVSCodePrivateExtensions(vscodeDir: string) {
  const privateExtensionsFile = path.join(vscodeDir, 'extensions.private.json');
  const extensionsFile = path.join(vscodeDir, 'extensions.json');

  log.info('Configurando Private Extension Manager para o padrão Luizalabs...');

  // --- 1. Configura .vscode/extensions.private.json ---
  let privateConfig: any = { registries: [], recommendations: [] };
  if (fs.existsSync(privateExtensionsFile)) {
    try {
      privateConfig = JSON.parse(fs.readFileSync(privateExtensionsFile, 'utf-8'));
    } catch (e) {
      log.warn('Falha ao ler extensions.private.json existente. Criando novo.');
    }
  }

  if (!privateConfig.registries) privateConfig.registries = [];
  const hasRegistry = privateConfig.registries.some((r: any) => r.registry === REGISTRY_URL);
  if (!hasRegistry) {
    privateConfig.registries.push({
      name: "Luizalabs Nexus (NPM)",
      registry: REGISTRY_URL
    });
  }

  if (!privateConfig.recommendations) privateConfig.recommendations = [];
  if (!privateConfig.recommendations.includes(EXTENSION_ID)) {
    privateConfig.recommendations.push(EXTENSION_ID);
  }

  fs.writeFileSync(privateExtensionsFile, JSON.stringify(privateConfig, null, 2), 'utf-8');
  log.success('Arquivo .vscode/extensions.private.json configurado com sucesso!');

  // --- 2. Configura .vscode/extensions.json ---
  let standardExtensions: any = { recommendations: [] };
  const GARMIN_EXTENSION_ID = 'Garmin.private-extension-manager';

  if (fs.existsSync(extensionsFile)) {
    try {
      standardExtensions = JSON.parse(fs.readFileSync(extensionsFile, 'utf-8'));
    } catch (e) {}
  }

  if (!standardExtensions.recommendations) standardExtensions.recommendations = [];
  if (!standardExtensions.recommendations.includes(GARMIN_EXTENSION_ID)) {
    standardExtensions.recommendations.push(GARMIN_EXTENSION_ID);
    fs.writeFileSync(extensionsFile, JSON.stringify(standardExtensions, null, 2), 'utf-8');
    log.info(`Recomendando a instalação da extensão '${GARMIN_EXTENSION_ID}' no workspace.`);
  }
}

function configureVSCodeSettings(vscodeDir: string) {
  const settingsFile = path.join(vscodeDir, 'settings.json');
  let settings: any = {};
  if (fs.existsSync(settingsFile)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
    } catch (e) {
      log.warn('Falha ao ler settings.json. Recriando.');
    }
  }

  // --- 1. Copilot Instructions ---
  const homedir = process.env.HOME || process.env.USERPROFILE || '~';
  const instructionsPath = path.join(homedir, '.padrao-labs', 'agents', 'copilot-instructions.md');

  if (!settings['github.copilot.chat.codeGeneration.instructions']) {
    settings['github.copilot.chat.codeGeneration.instructions'] = [];
  }
  
  const instructions = settings['github.copilot.chat.codeGeneration.instructions'];
  const hasInstruction = instructions.some((i: any) => i.file === instructionsPath);
  
  if (!hasInstruction) {
    instructions.push({ file: instructionsPath });
  }

  // --- 2. Desativar Copilot em linguagens ruidosas ---
  if (!settings['github.copilot.enable']) {
    settings['github.copilot.enable'] = {};
  }
  const enable = settings['github.copilot.enable'];
  const disabledLangs = ['plaintext', 'scminput', 'dotenv', 'ignore', 'properties', 'markdown'];
  
  for (const lang of disabledLangs) {
    if (enable[lang] !== false) {
      enable[lang] = false;
    }
  }

  // --- 3. Configurações avançadas de Chat, MCP e Agentes ---
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

  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
  log.success(`Arquivo settings.json configurado com as diretrizes do Luizalabs.`);
}

function configureCopilotIgnore() {
  const ignoreFile = path.join(process.cwd(), '.copilotignore');
  const ignoreContent = 'node_modules/\n';

  if (!fs.existsSync(ignoreFile)) {
    fs.writeFileSync(ignoreFile, ignoreContent, 'utf-8');
    log.success('Arquivo .copilotignore criado (node_modules desativado).');
  } else {
    let current = fs.readFileSync(ignoreFile, 'utf-8');
    if (!current.includes('node_modules/')) {
      fs.appendFileSync(ignoreFile, `\n${ignoreContent}`);
      log.success('Pasta node_modules adicionada ao .copilotignore.');
    }
  }
}
