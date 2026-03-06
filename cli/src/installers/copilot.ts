import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import {
  getPadraoLabsAgentsDir,
  getGlobalCopilotIgnorePath,
  getVSCodeMcpConfigPath,
  getVSCodeSettingsPath,
} from '../utils/platform.js';
import { dirExists, ensureDir, fileExists, readFileList } from '../utils/fs.js';
import { log } from '../utils/logger.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping, MCPConfig, MCPInputConfig } from '../types.js';

/** Chave do settings.json para instruções globais de geração de código. */
const VSCODE_INSTRUCTIONS_KEY = 'github.copilot.chat.codeGeneration.instructions';

/**
 * Chave do settings.json para habilitar/desabilitar Copilot por linguagem.
 * Desativar em linguagens onde o Copilot não agrega valor evita consumo de
 * tokens desnecessário (ex.: plaintext, markdown, scminput).
 */
const VSCODE_COPILOT_ENABLE_KEY = 'github.copilot.enable';

/** Linguagens onde o Copilot deve ser desativado por padrão. */
const COPILOT_DISABLED_LANGUAGES: Record<string, boolean> = {
  plaintext: false,
  scminput: false,
  dotenv: false,
  ignore: false,
  properties: false,
};

/**
 * Chave do settings.json para pastas adicionais de prompts (`.prompt.md`).
 * Disponível a partir do VS Code 1.97+.
 */
const VSCODE_PROMPT_LOCS_KEY = 'chat.promptFilesLocations';

/** Fragmento de caminho para identificar entradas gerenciadas por este installer. */
const MANAGED_PATH_MARKER = '.agents';
const LEGACY_PATH_MARKER = '.padrao-labs';

function isManagedPath(p?: string): boolean {
  if (!p) return false;
  return p.includes(MANAGED_PATH_MARKER) || p.includes(LEGACY_PATH_MARKER);
}

export class CopilotInstaller extends BaseInstaller {
  get name(): string {
    return 'copilot';
  }

  /**
   * Os arquivos são instalados em ~/.padrao-labs/agents — pasta única gerenciada
   * pelo CLI. O VS Code é configurado via settings.json para ler desse caminho,
   * evitando cópia por projeto.
   */
  get targetDir(): string {
    return getPadraoLabsAgentsDir();
  }

  get categoryMappings(): CategoryMapping[] {
    return [
      { source: 'skills', target: 'skills' },
      { source: 'rules', target: 'rules' },
      { source: 'agents', target: 'agents' },
      { source: 'hooks', target: 'hooks' },
      { source: 'workflows', target: 'workflows' },
    ];
  }

  protected override async postInstall(): Promise<void> {
    const agentsDir = this.targetDir;
    const instructionsFile = join(agentsDir, 'copilot-instructions.md');

    // 1. Arquivo único com todas as rules concatenadas
    await this.generateInstructionsFile(instructionsFile);

    // 2. settings.json do VS Code User aponta para esse arquivo globalmente
    await this.configureVSCodeSettings(instructionsFile, agentsDir);

    // 3. Configura hooks do Copilot
    await this.configureCopilotHooks(agentsDir);

    // 4. Copia workflows como .prompt.md para compatibilidade com Copilot Prompts
    await this.copyWorkflowsAsPrompts(agentsDir);

    // 5. mcp.json com GitLab MCP server (inputs + env)
    await this.configureMcp();

    // 6. ~/.copilotignore global para excluir artefatos e segredos do contexto
    await this.generateCopilotIgnore();
  }

  /**
   * Gera ~/.padrao-labs/agents/copilot-instructions.md com todas as rules
   * concatenadas. É esse arquivo que o Copilot lê como instrução global.
   */
  private async generateInstructionsFile(destPath: string): Promise<void> {
    if (this.options.dryRun) {
      log.dryRun(`Geraria copilot-instructions.md -> ${destPath}`);
      return;
    }
    await this.concatenateRulesToFile(destPath);
    log.detail(`Instructions geradas: ${destPath}`);
  }

  /**
   * Modifica o settings.json do usuário VS Code (User scope, não workspace) para:
   *
   * 1. `github.copilot.chat.codeGeneration.instructions` → aponta ao arquivo de
   *    instructions gerado. Ativa as rules GLOBALMENTE em todos os workspaces VS
   *    Code sem precisar de cópia por projeto.
   *
   * 2. `chat.promptFilesLocations` (VS Code 1.97+) → adiciona as pastas de skills
   *    e agents para que prompts `.prompt.md` sejam descobertos pelo Copilot Chat.
   *
   * Faz merge inteligente: preserva entradas existentes e remove apenas as antigas
   * gerenciadas por este CLI (identificadas pelo marcador de caminho).
   */
  private async configureVSCodeSettings(
    instructionsFile: string,
    agentsDir: string,
  ): Promise<void> {
    const settingsPath = getVSCodeSettingsPath();

    if (this.options.dryRun) {
      log.dryRun(`Configuraria VS Code settings.json: ${settingsPath}`);
      return;
    }

    let settings: Record<string, unknown> = {};
    if (await fileExists(settingsPath)) {
      try {
        const raw = await readFile(settingsPath, 'utf-8');
        settings = JSON.parse(raw);
      } catch {
        log.warn('Nao foi possivel ler settings.json — sera criado do zero');
      }
    }

    // --- 1. github.copilot.chat.codeGeneration.instructions ---
    type InstructionEntry = { file?: string; text?: string };

    let instructions: InstructionEntry[] = Array.isArray(settings[VSCODE_INSTRUCTIONS_KEY])
      ? (settings[VSCODE_INSTRUCTIONS_KEY] as InstructionEntry[])
      : [];

    // Remove entradas antigas deste CLI e adiciona a atual
    instructions = instructions.filter(e => !isManagedPath(e.file));
    instructions.push({ file: instructionsFile });
    settings[VSCODE_INSTRUCTIONS_KEY] = instructions;

    // --- 3. github.copilot.enable (por linguagem) ---
    // Faz merge: preserva customizações do usuário, mas garante que as
    // linguagens ruidosas sejam desativadas por padrão.
    const existingEnable: Record<string, boolean> =
      settings[VSCODE_COPILOT_ENABLE_KEY] !== null &&
      typeof settings[VSCODE_COPILOT_ENABLE_KEY] === 'object' &&
      !Array.isArray(settings[VSCODE_COPILOT_ENABLE_KEY])
        ? (settings[VSCODE_COPILOT_ENABLE_KEY] as Record<string, boolean>)
        : {};

    settings[VSCODE_COPILOT_ENABLE_KEY] = {
      '*': true,                          // habilita por padrão em tudo
      ...COPILOT_DISABLED_LANGUAGES,       // desativa nas linguagens ruidosas
      ...existingEnable,                   // preserva configurações do usuário
    };

    // --- 3. chat.promptFilesLocations ---
    // Formato: { "/caminho/absoluto": true } — valor indica inclusão de subpastas.
    let promptLocs: Record<string, boolean> =
      settings[VSCODE_PROMPT_LOCS_KEY] !== null &&
      typeof settings[VSCODE_PROMPT_LOCS_KEY] === 'object' &&
      !Array.isArray(settings[VSCODE_PROMPT_LOCS_KEY])
        ? (settings[VSCODE_PROMPT_LOCS_KEY] as Record<string, boolean>)
        : {};

    // Remove entradas antigas deste CLI
    promptLocs = Object.fromEntries(
      Object.entries(promptLocs).filter(([k]) => !isManagedPath(k)),
    );

    // Adiciona a pasta de prompts se existir
    const promptsDir = join(agentsDir, 'prompts');
    if (await dirExists(promptsDir)) promptLocs[promptsDir] = true;

    settings[VSCODE_PROMPT_LOCS_KEY] = promptLocs;

    await ensureDir(join(settingsPath, '..'));
    await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

    log.detail(`VS Code settings.json atualizado: ${settingsPath}`);
    log.success(`Instructions Copilot ativas globalmente (User settings.json)`);
    log.detail(
      `Copilot desativado para: ${Object.entries(COPILOT_DISABLED_LANGUAGES)
        .filter(([, v]) => !v)
        .map(([k]) => k)
        .join(', ')}`,
    );
  }

  /**
   * Copia os arquivos de workflow (.md) para uma pasta de prompts com extensão .prompt.md.
   * Isso permite que o Copilot reconheça os workflows como comandos (/workflow-name).
   */
  private async copyWorkflowsAsPrompts(agentsDir: string): Promise<void> {
    const workflowsDir = join(agentsDir, 'workflows');
    const promptsDir = join(agentsDir, 'prompts');

    if (this.options.dryRun) {
      log.dryRun(`Mapearia workflows como prompts em ${promptsDir}`);
      return;
    }

    if (!(await dirExists(workflowsDir))) {
      return;
    }

    await ensureDir(promptsDir);
    const files = await readFileList(workflowsDir);

    for (const file of files) {
      if (file.endsWith('.md') && file !== 'index.md') {
        const content = await readFile(join(workflowsDir, file), 'utf-8');
        const promptName = file.replace('.md', '.prompt.md');
        await writeFile(join(promptsDir, promptName), content, 'utf-8');
      }
    }

    log.detail(`Workflows mapeados como prompts em ${promptsDir}`);
  }

  /**
   * Configura os hooks do Copilot no settings.json do VS Code.
   * Utiliza os scripts pre-command.py e post-command.py instalados na pasta hooks.
   */
  private async configureCopilotHooks(agentsDir: string): Promise<void> {
    const settingsPath = getVSCodeSettingsPath();
    const hooksDir = join(agentsDir, 'hooks');

    if (this.options.dryRun) {
      log.dryRun(`Configuraria hooks do Copilot em ${settingsPath}`);
      return;
    }

    if (!(await dirExists(hooksDir))) {
      return;
    }

    let settings: Record<string, any> = {};
    if (await fileExists(settingsPath)) {
      try {
        const raw = await readFile(settingsPath, 'utf-8');
        settings = JSON.parse(raw);
      } catch {
        return;
      }
    }

    const preCommandPath = join(hooksDir, 'pre-command.py');
    const postCommandPath = join(hooksDir, 'post-command.py');

    // Mapeamento de eventos do Copilot para nossos hooks
    const copilotHooks: Record<string, any> = settings['github.copilot.chat.hooks'] || {};

    if (await fileExists(preCommandPath)) {
      copilotHooks.PreToolUse = [
        ...(copilotHooks.PreToolUse || []).filter((h: any) => !isManagedPath(h.command) && h.managed !== MANAGED_PATH_MARKER && h.managed !== LEGACY_PATH_MARKER),
        {
          type: 'command',
          command: `python3 \${preCommandPath}`,
          managed: MANAGED_PATH_MARKER,
        },
      ];
    }

    if (await fileExists(postCommandPath)) {
      copilotHooks.PostToolUse = [
        ...(copilotHooks.PostToolUse || []).filter((h: any) => !isManagedPath(h.command) && h.managed !== MANAGED_PATH_MARKER && h.managed !== LEGACY_PATH_MARKER),
        {
          type: 'command',
          command: `python3 \${postCommandPath}`,
          managed: MANAGED_PATH_MARKER,
        },
      ];
    }

    settings['github.copilot.chat.hooks'] = copilotHooks;

    await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    log.detail('Hooks do Copilot configurados em settings.json');
  }

  /**
   * Gera ~/.copilotignore global com padrões recomendados para excluir
   * artefatos de build, segredos e arquivos binários do contexto do Copilot.
   * Faz merge inteligente: adiciona apenas entradas ausentes, preservando
   * customizações existentes.
   */
  private async generateCopilotIgnore(): Promise<void> {
    const ignorePath = getGlobalCopilotIgnorePath();

    if (this.options.dryRun) {
      log.dryRun(`Geraria ~/.copilotignore em \${ignorePath}`);
      return;
    }

    const baseline = [
      '# ────────────────────────────────────────────',
      '# Gerenciado por padrao-labs-agents CLI',
      '# Edite abaixo desta seção para customizações',
      '# ────────────────────────────────────────────',
      '',
      '# Segredos & credenciais',
      '.env',
      '.env.*',
      '**/*.pem',
      '**/*.key',
      '**/*.p12',
      '**/*.pfx',
      'secrets/',
      'credentials/',
      '',
      '# Artefatos de build',
      'dist/',
      'build/',
      'out/',
      '.next/',
      '.nuxt/',
      'coverage/',
      '*.min.js',
      '*.min.css',
      '',
      '# Gerenciadores de pacotes',
      'node_modules/',
      '.venv/',
      '__pycache__/',
      '*.pyc',
      '*.pyo',
      '',
      '# Lock files (grandes e gerados automaticamente)',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
      'poetry.lock',
      'Pipfile.lock',
      '',
      '# Binários & mídia',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.png',
      '**/*.gif',
      '**/*.svg',
      '**/*.ico',
      '**/*.mp4',
      '**/*.mp3',
      '**/*.zip',
      '**/*.tar.gz',
      '**/*.tar.bz2',
      '**/*.whl',
      '**/*.jar',
      '**/*.class',
      '',
      '# OS / IDE',
      '.DS_Store',
      'Thumbs.db',
      '.idea/',
      '*.iml',
    ].join('\n');

    let current = '';
    if (await fileExists(ignorePath)) {
      current = await readFile(ignorePath, 'utf-8');
    }

    // Se o arquivo já foi gerado por este CLI, substitui o bloco gerenciado.
    // Caso contrário, prefixa com o baseline.
    const MANAGED_HEADER = '# Gerenciado por padrao-labs-agents CLI';
    if (current.includes(MANAGED_HEADER)) {
      // Mantém apenas a parte customizada (após o bloco gerenciado)
      const customStart = current.indexOf('\\n# ────', current.indexOf(MANAGED_HEADER) + 1);
      const custom = customStart !== -1 ? current.slice(customStart) : '';
      await writeFile(ignorePath, baseline + (custom ? '\\n' + custom.trimStart() : '\\n'), 'utf-8');
    } else if (current.trim()) {
      // Arquivo existente com conteúdo do usuário — prefixa sem sobrescrever
      await writeFile(ignorePath, baseline + '\\n\\n# Configurações existentes\\n' + current, 'utf-8');
    } else {
      await writeFile(ignorePath, baseline + '\\n', 'utf-8');
    }

    log.detail(`~/.copilotignore gerado em: \${ignorePath}`);
    log.success(`~/.copilotignore configurado (\${ignorePath})`);
  }

  /**
   * Configura ~/.config/Code/User/mcp.json com o servidor GitLab MCP.
   * O GITLAB_TOKEN é solicitado ao usuário via prompt do VS Code (schema inputs).
   */
  private async configureMcp(): Promise<void> {
    const mcpPath = getVSCodeMcpConfigPath();

    if (this.options.dryRun) {
      log.dryRun(`Configuraria GitLab MCP em \${mcpPath}`);
      return;
    }

    let mcpConfig: MCPConfig = { servers: {} };
    if (await fileExists(mcpPath)) {
      try {
        const content = await readFile(mcpPath, 'utf-8');
        mcpConfig = JSON.parse(content) as MCPConfig;
      } catch {
        // Recria do zero
      }
    }

    if (!mcpConfig.servers) mcpConfig.servers = {};
    if (!Array.isArray(mcpConfig.inputs)) mcpConfig.inputs = [];

    // Remove e readiciona input GITLAB_TOKEN para garantir dados atualizados
    mcpConfig.inputs = (mcpConfig.inputs as MCPInputConfig[]).filter(
      i => i.id !== 'GITLAB_TOKEN',
    );
    mcpConfig.inputs.push({
      id: 'GITLAB_TOKEN',
      type: 'promptString',
      description: 'Personal Access Token para GitLab (gitlab.luizalabs.com)',
      password: true,
    });

    mcpConfig.servers['gitlab-labs'] = {
      type: 'stdio',
      command: 'glab',
      args: ['mcp', 'serve'],
      gallery: false,
      env: {
        GITLAB_TOKEN: '\${input:GITLAB_TOKEN}',
        GITLAB_HOST: 'https://gitlab.luizalabs.com/',
      },
    };

    await ensureDir(join(mcpPath, '..'));
    await writeFile(mcpPath, JSON.stringify(mcpConfig, null, 2), 'utf-8');

    log.detail(`GitLab MCP configurado em \${mcpPath}`);
  }
}
