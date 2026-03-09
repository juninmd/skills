import { parse, stringify } from 'comment-json';
import { join } from 'node:path';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import {
  getPadraoLabsAgentsDir,
  getGlobalCopilotIgnorePath,
  getVSCodeMcpConfigPath,
  getVSCodeSettingsPath,
  getHomeDir,
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

/**
 * Chave do settings.json para pastas de Agent Skills (pastas com SKILL.md).
 */
const VSCODE_SKILLS_LOCS_KEY = 'chat.agentSkillsLocations';

/**
 * Chave do settings.json para pastas de Agent Definitions (.agent.md).
 */
const VSCODE_AGENTS_LOCS_KEY = 'chat.agentFilesLocations';

/** Fragmento de caminho para identificar entradas gerenciadas por este installer. */
const MANAGED_PATH_MARKER = '.agents';

function isManagedPath(p?: string): boolean {
  if (!p) return false;
  return p.includes(MANAGED_PATH_MARKER);
}

function toPortablePath(p: string): string {
  const home = getHomeDir();
  if (p.startsWith(home)) {
    return '~' + p.slice(home.length);
  }
  return p;
}

export class CopilotInstaller extends BaseInstaller {
  get name(): string {
    return 'copilot';
  }

  /**
   * Os arquivos são instalados em ~/.agents — pasta única gerenciada
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

    // 1. settings.json do VS Code User aponta para os arquivos de rules individualmente
    await this.configureVSCodeSettings(agentsDir);

    // 2. Configura hooks do Copilot
    await this.configureCopilotHooks(agentsDir);

    // 3. Copia componentes (skills, agents, workflows) como .prompt.md
    await this.convertComponentsToPrompts(agentsDir);

    // 4. mcp.json com GitLab MCP server (inputs + env)
    await this.configureMcp();

    // 5. ~/.copilotignore global para excluir artefatos e segredos do contexto
    await this.generateCopilotIgnore();
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
        // Faz backup do arquivo original
        await writeFile(`${settingsPath}.old`, raw, 'utf-8');
        log.detail(`Backup de settings.json criado em ${settingsPath}.old`);

        settings = parse(raw) as Record<string, unknown>;
      } catch {
        log.warn('Nao foi possivel ler settings.json — sera criado do zero');
      }
    }

    // --- 1. github.copilot.chat.codeGeneration.instructions ---
    type InstructionEntry = { file?: string; text?: string };

    let instructions: InstructionEntry[] = Array.isArray(settings[VSCODE_INSTRUCTIONS_KEY])
      ? (settings[VSCODE_INSTRUCTIONS_KEY] as InstructionEntry[])
      : [];

    // Remove entradas antigas deste CLI (tanto o arquivo gigante quanto arquivos individuais)
    instructions = instructions.filter(e => !isManagedPath(e.file));

    // Escaneia a pasta de rules e adiciona cada arquivo individualmente
    const rulesDir = join(agentsDir, 'rules');
    if (await dirExists(rulesDir)) {
      const ruleFiles = await readFileList(rulesDir);
      for (const file of ruleFiles.sort()) {
        if (file.endsWith('.md') && file !== 'index.md') {
          instructions.push({ file: toPortablePath(join(rulesDir, file)) });
        }
      }
    }

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

    // Adiciona caminhos padrão e o gerenciado
    const promptsDir = join(agentsDir, 'prompts');
    promptLocs['.github/prompts'] = true;
    promptLocs['.agents/prompts'] = true;
    promptLocs['.claude/prompts'] = true;
    if (await dirExists(promptsDir)) promptLocs[toPortablePath(promptsDir)] = true;

    settings[VSCODE_PROMPT_LOCS_KEY] = promptLocs;

    // --- 4. chat.agentSkillsLocations ---
    let skillsLocs: Record<string, boolean> =
      settings[VSCODE_SKILLS_LOCS_KEY] !== null &&
      typeof settings[VSCODE_SKILLS_LOCS_KEY] === 'object' &&
      !Array.isArray(settings[VSCODE_SKILLS_LOCS_KEY])
        ? (settings[VSCODE_SKILLS_LOCS_KEY] as Record<string, boolean>)
        : {};

    skillsLocs = Object.fromEntries(
      Object.entries(skillsLocs).filter(([k]) => !isManagedPath(k)),
    );

    // Adiciona caminhos padrão conforme payload sugerido e o gerenciado
    skillsLocs['.github/skills'] = true;
    skillsLocs['.agents/skills'] = true;
    skillsLocs['.claude/skills'] = true;
    skillsLocs['~/.copilot/skills'] = true;
    skillsLocs['~/.claude/skills'] = true;
    
    const skillsDir = join(agentsDir, 'skills');
    if (await dirExists(skillsDir)) skillsLocs[toPortablePath(skillsDir)] = true;
    settings[VSCODE_SKILLS_LOCS_KEY] = skillsLocs;

    // --- 5. chat.agentFilesLocations ---
    let agentsLocs: Record<string, boolean> =
      settings[VSCODE_AGENTS_LOCS_KEY] !== null &&
      typeof settings[VSCODE_AGENTS_LOCS_KEY] === 'object' &&
      !Array.isArray(settings[VSCODE_AGENTS_LOCS_KEY])
        ? (settings[VSCODE_AGENTS_LOCS_KEY] as Record<string, boolean>)
        : {};

    agentsLocs = Object.fromEntries(
      Object.entries(agentsLocs).filter(([k]) => !isManagedPath(k)),
    );

    // Adiciona caminhos padrão e o gerenciado
    agentsLocs['.github/agents'] = true;
    agentsLocs['.claude/agents'] = true;
    agentsLocs['.agents/agents'] = true;

    const agentsSubDir = join(agentsDir, 'agents');
    if (await dirExists(agentsSubDir)) agentsLocs[toPortablePath(agentsSubDir)] = true;
    settings[VSCODE_AGENTS_LOCS_KEY] = agentsLocs;

    await ensureDir(join(settingsPath, '..'));
    await writeFile(settingsPath, stringify(settings, null, 2), 'utf-8');

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
   * Converte componentes (workflows) para arquivos .prompt.md.
   * Isso permite que o Copilot os reconheça como comandos (/nome) ou referências (#nome).
   * Skills e Agents agora têm localizações próprias no settings.json e não precisam ser convertidos.
   */
  private async convertComponentsToPrompts(agentsDir: string): Promise<void> {
    const promptsDir = join(agentsDir, 'prompts');

    if (this.options.dryRun) {
      log.dryRun(`Mapearia workflows como prompts em ${promptsDir}`);
      return;
    }

    await ensureDir(promptsDir);

    // Agora processamos apenas Workflows como prompts. 
    // Skills usam chat.agentSkillsLocations e Agents usam chat.agentFilesLocations.
    const categories = ['workflows'];
    let total = 0;

    const processDir = async (srcDir: string, category: string) => {
      if (!(await dirExists(srcDir))) return;

      const entries = await readdir(srcDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(srcDir, entry.name);
        if (entry.isDirectory()) {
          await processDir(fullPath, category);
        } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
          const content = await readFile(fullPath, 'utf-8');
          const name = entry.name.replace('.md', '');
          const promptName = `${name}.prompt.md`;

          // Adiciona Frontmatter básico se não tiver
          let finalContent = content;
          if (!content.startsWith('---')) {
            finalContent = `---\nname: ${name}\ndescription: ${category.slice(0, -1)}: ${name}\n---\n\n${content}`;
          }

          await writeFile(join(promptsDir, promptName), finalContent, 'utf-8');
          total++;
        }
      }
    };

    for (const category of categories) {
      await processDir(join(agentsDir, category), category);
    }

    log.detail(`${total} workflows convertidos em prompts em ${promptsDir}`);

    // Para Agents, garantimos que tenham a extensão .agent.md para serem reconhecidos pelo VS Code
    const agentsSubDir = join(agentsDir, 'agents');
    if (await dirExists(agentsSubDir)) {
      const entries = await readdir(agentsSubDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.endsWith('.agent.md') && entry.name !== 'index.md') {
          const content = await readFile(join(agentsSubDir, entry.name), 'utf-8');
          const newName = entry.name.replace('.md', '.agent.md');
          await writeFile(join(agentsSubDir, newName), content, 'utf-8');
          // Remove o original .md para evitar duplicidade (Copilot prefere .agent.md se configurado)
          // Mas cuidado: Antigravity/Gemini podem preferir .md. 
          // Como estamos em ~/.agents/, que é compartilhado, vamos manter ambos ou ver se .agent.md funciona pra todos.
          // Na dúvida, mantemos ambos por enquanto.
        }
      }
    }
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
        settings = parse(raw) as Record<string, any>;
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
        ...(copilotHooks.PreToolUse || []).filter((h: any) => !isManagedPath(h.command) && h.managed !== MANAGED_PATH_MARKER),
        {
          type: 'command',
          command: `python3 ${toPortablePath(preCommandPath)}`,
          managed: MANAGED_PATH_MARKER,
        },
      ];
    }

    if (await fileExists(postCommandPath)) {
      copilotHooks.PostToolUse = [
        ...(copilotHooks.PostToolUse || []).filter((h: any) => !isManagedPath(h.command) && h.managed !== MANAGED_PATH_MARKER),
        {
          type: 'command',
          command: `python3 ${toPortablePath(postCommandPath)}`,
          managed: MANAGED_PATH_MARKER,
        },
      ];
    }

    settings['github.copilot.chat.hooks'] = copilotHooks;

    await writeFile(settingsPath, stringify(settings, null, 2), 'utf-8');
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
      log.dryRun(`Geraria ~/.copilotignore em ${ignorePath}`);
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

    log.detail(`~/.copilotignore gerado em: ${ignorePath}`);
    log.success(`~/.copilotignore configurado (${ignorePath})`);
  }

  /**
   * Configura ~/.config/Code/User/mcp.json com o servidor GitLab MCP.
   * O GITLAB_TOKEN é solicitado ao usuário via prompt do VS Code (schema inputs).
   */
  private async configureMcp(): Promise<void> {
    const mcpPath = getVSCodeMcpConfigPath();

    if (this.options.dryRun) {
      log.dryRun(`Configuraria GitLab MCP em ${mcpPath}`);
      return;
    }

    let mcpConfig: MCPConfig = { servers: {} };
    if (await fileExists(mcpPath)) {
      try {
        const content = await readFile(mcpPath, 'utf-8');
        mcpConfig = parse(content) as unknown as MCPConfig;
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
        GITLAB_TOKEN: '${input:GITLAB_TOKEN}',
        GITLAB_HOST: 'https://gitlab.luizalabs.com/',
      },
    };

    await ensureDir(join(mcpPath, '..'));
    await writeFile(mcpPath, stringify(mcpConfig, null, 2), 'utf-8');

    log.detail(`GitLab MCP configurado em ${mcpPath}`);
  }
}
