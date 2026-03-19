import { parse, stringify } from 'comment-json';
import { join } from 'node:path';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import {
  getPadraoLabsAgentsDir,
  getGlobalCopilotIgnorePath,
  getVSCodeMcpConfigPath,
  getVSCodeSettingsPaths,
  getHomeDir,
} from '../utils/platform.js';
import { dirExists, ensureDir, fileExists, readFileList } from '../utils/fs.js';
import { log } from '../utils/logger.js';
import { BaseInstaller } from './base-installer.js';
import type { CategoryMapping, MCPConfig, MCPInputConfig } from '../types.js';
import color from 'picocolors';
import {
  VSCODE_SETTINGS_KEYS,
  SETTING_DESCRIPTIONS,
  DEFAULT_ADVANCED_SETTINGS
} from '../utils/vscode-settings.js';

/** Linguagens onde o Copilot deve ser desativado por padrão. */
const COPILOT_DISABLED_LANGUAGES: Record<string, boolean> = {
  plaintext: false,
  scminput: false,
  dotenv: false,
  ignore: false,
  properties: false,
};

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

/**
 * Calcula e exibe o diff simplificado entre dois objetos de configuração.
 */
function logSettingsDiff(path: string, oldSettings: any, newSettings: any): void {
  const diffs: string[] = [];
  const allKeys = new Set([...Object.keys(oldSettings), ...Object.keys(newSettings)]);

  for (const key of allKeys) {
    const oldVal = JSON.stringify(oldSettings[key]);
    const newVal = JSON.stringify(newSettings[key]);

    if (oldVal !== newVal) {
      const desc = SETTING_DESCRIPTIONS[key] ? ` - ${color.gray(SETTING_DESCRIPTIONS[key])}` : '';
      if (oldSettings[key] === undefined) {
        diffs.push(`${color.green('+')} ${color.bold(key)}${desc}`);
      } else if (newSettings[key] === undefined) {
        diffs.push(`${color.red('-')} ${color.bold(key)}${desc}`);
      } else {
        diffs.push(`${color.yellow('~')} ${color.bold(key)}${desc}`);
      }
    }
  }

  if (diffs.length > 0) {
    log.detail(`Alteracoes em ${color.cyan(toPortablePath(path))}:`);
    diffs.forEach(d => log.detail(`  ${d}`));
  }
}

export class CopilotInstaller extends BaseInstaller {
  get name(): string {
    return 'copilot';
  }

  get targetDir(): string {
    return getPadraoLabsAgentsDir();
  }

  get categoryMappings(): CategoryMapping[] {
    return [
      { source: 'skills', target: 'skills' },
      { source: 'rules', target: 'rules' },
      { source: 'agents', target: 'agents' },
      { source: 'workflows', target: 'workflows' },
    ];
  }

  protected override async postInstall(): Promise<string[] | void> {
    const agentsDir = this.targetDir;
    const summary: string[] = [];
    const settingsPaths = getVSCodeSettingsPaths();

    const assetsCount = await this.prepareCopilotAssets(agentsDir);
    summary.push(`${assetsCount} componentes adaptados para o Copilot`);

    for (const path of settingsPaths) {
      await this.configureVSCodeSettings(agentsDir, path);
    }
    summary.push(`VS Code Settings atualizados em ${settingsPaths.length} perfis`);

    await this.configureMcp();
    summary.push('GitLab MCP Server configurado');

    await this.generateCopilotIgnore();
    summary.push('~/.copilotignore global gerado');

    return summary;
  }

  private async configureVSCodeSettings(
    agentsDir: string,
    settingsPath: string,
  ): Promise<void> {
    if (this.options.dryRun) {
      log.dryRun(`Configuraria VS Code settings.json: ${settingsPath}`);
      return;
    }

    let settings: Record<string, unknown> = {};
    let oldSettings: Record<string, unknown> = {};

    if (await fileExists(settingsPath)) {
      try {
        const raw = await readFile(settingsPath, 'utf-8');
        await writeFile(`${settingsPath}.old`, raw, 'utf-8');

        settings = parse(raw) as Record<string, unknown>;
        oldSettings = parse(raw) as Record<string, unknown>;
      } catch {
        log.warn(`Nao foi possivel ler ${settingsPath} — sera criado do zero`);
      }
    }

    // --- 1. Instructions ---
    type InstructionEntry = { file?: string; text?: string };
    const instKey = VSCODE_SETTINGS_KEYS.INSTRUCTIONS;
    let instructions: InstructionEntry[] = Array.isArray(settings[instKey])
      ? (settings[instKey] as InstructionEntry[])
      : [];

    instructions = instructions.filter(e => !isManagedPath(e.file));

    const rulesDir = join(agentsDir, 'rules');
    if (await dirExists(rulesDir)) {
      const ruleFiles = await readFileList(rulesDir);
      for (const file of ruleFiles.sort()) {
        if (file.endsWith('.instructions.md')) {
          instructions.push({ file: toPortablePath(join(rulesDir, file)) });
        }
      }
    }
    settings[instKey] = instructions;

    // --- 2. Copilot Enable ---
    const enableKey = VSCODE_SETTINGS_KEYS.COPILOT_ENABLE;
    const existingEnable: Record<string, boolean> =
      settings[enableKey] !== null &&
        typeof settings[enableKey] === 'object' &&
        !Array.isArray(settings[enableKey])
        ? (settings[enableKey] as Record<string, boolean>)
        : {};

    settings[enableKey] = {
      '*': true,
      ...COPILOT_DISABLED_LANGUAGES,
      ...existingEnable,
    };

    // --- 3. Prompt Files ---
    const promptKey = VSCODE_SETTINGS_KEYS.PROMPT_LOCS;
    let promptLocs: Record<string, boolean> =
      settings[promptKey] !== null &&
        typeof settings[promptKey] === 'object' &&
        !Array.isArray(settings[promptKey])
        ? (settings[promptKey] as Record<string, boolean>)
        : {};

    promptLocs = Object.fromEntries(
      Object.entries(promptLocs).filter(([k]) => !isManagedPath(k)),
    );

    const promptsDir = join(agentsDir, 'prompts');
    promptLocs['.github/prompts'] = true;
    promptLocs['.agents/prompts'] = true;
    promptLocs['.claude/prompts'] = true;
    if (await dirExists(promptsDir)) promptLocs[toPortablePath(promptsDir)] = true;
    settings[promptKey] = promptLocs;

    // --- 4. Skills ---
    const skillsKey = VSCODE_SETTINGS_KEYS.SKILLS_LOCS;
    let skillsLocs: Record<string, boolean> =
      settings[skillsKey] !== null &&
        typeof settings[skillsKey] === 'object' &&
        !Array.isArray(settings[skillsKey])
        ? (settings[skillsKey] as Record<string, boolean>)
        : {};

    skillsLocs = Object.fromEntries(
      Object.entries(skillsLocs).filter(([k]) => !isManagedPath(k)),
    );

    skillsLocs['.github/skills'] = true;
    skillsLocs['.agents/skills'] = true;
    skillsLocs['.claude/skills'] = true;
    skillsLocs['~/.copilot/skills'] = true;
    skillsLocs['~/.claude/skills'] = true;

    const skillsDir = join(agentsDir, 'skills');
    if (await dirExists(skillsDir)) skillsLocs[toPortablePath(skillsDir)] = true;
    settings[skillsKey] = skillsLocs;

    // --- 5. Agents ---
    const agentsKey = VSCODE_SETTINGS_KEYS.AGENTS_LOCS;
    let agentsLocs: Record<string, boolean> =
      settings[agentsKey] !== null &&
        typeof settings[agentsKey] === 'object' &&
        !Array.isArray(settings[agentsKey])
        ? (settings[agentsKey] as Record<string, boolean>)
        : {};

    agentsLocs = Object.fromEntries(
      Object.entries(agentsLocs).filter(([k]) => !isManagedPath(k)),
    );

    agentsLocs['.github/agents'] = true;
    agentsLocs['.claude/agents'] = true;
    agentsLocs['.agents/agents'] = true;

    const agentsSubDir = join(agentsDir, 'agents');
    if (await dirExists(agentsSubDir)) agentsLocs[toPortablePath(agentsSubDir)] = true;
    settings[agentsKey] = agentsLocs;

    // --- 6. Autopilot ---
    settings[VSCODE_SETTINGS_KEYS.AUTOPILOT_ENABLE] = true;

    // --- 7. Advanced Settings ---
    for (const [key, value] of Object.entries(DEFAULT_ADVANCED_SETTINGS)) {
      settings[key] = value;
    }

    await ensureDir(join(settingsPath, '..'));
    await writeFile(settingsPath, stringify(settings, null, 2), 'utf-8');

    logSettingsDiff(settingsPath, oldSettings, settings);
  }

  private async prepareCopilotAssets(agentsDir: string): Promise<number> {
    const promptsDir = join(agentsDir, 'prompts');
    if (this.options.dryRun) return 0;

    await ensureDir(promptsDir);
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

    // Adapt Rules to .instructions.md
    const rulesSubDir = join(agentsDir, 'rules');
    if (await dirExists(rulesSubDir)) {
      const entries = await readdir(rulesSubDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.endsWith('.instructions.md') && entry.name !== 'index.md') {
          const content = await readFile(join(rulesSubDir, entry.name), 'utf-8');
          const newName = entry.name.replace('.md', '.instructions.md');
          await writeFile(join(rulesSubDir, newName), content, 'utf-8');
          total++;
        }
      }
    }

    // Adapt Agents to .agent.md
    const agentsSubDir = join(agentsDir, 'agents');
    if (await dirExists(agentsSubDir)) {
      const entries = await readdir(agentsSubDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.endsWith('.agent.md') && entry.name !== 'index.md') {
          const content = await readFile(join(agentsSubDir, entry.name), 'utf-8');
          const newName = entry.name.replace('.md', '.agent.md');
          await writeFile(join(agentsSubDir, newName), content, 'utf-8');
          total++;
        }
      }
    }
    return total;
  }

  private async generateCopilotIgnore(): Promise<void> {
    const ignorePath = getGlobalCopilotIgnorePath();
    if (this.options.dryRun) return;

    const baseline = [
      '# Gerenciado por padrao-labs-agents CLI',
      '.env', '.env.*', '**/*.pem', '**/*.key', 'dist/', 'build/', 'node_modules/', '.venv/', 'pnpm-lock.yaml',
    ].join('\n');

    let current = '';
    if (await fileExists(ignorePath)) {
      current = await readFile(ignorePath, 'utf-8');
    }

    const MANAGED_HEADER = '# Gerenciado por padrao-labs-agents CLI';
    if (current.includes(MANAGED_HEADER)) {
      await writeFile(ignorePath, baseline, 'utf-8');
    } else {
      await writeFile(ignorePath, baseline + '\n\n' + current, 'utf-8');
    }
  }

  private async configureMcp(): Promise<void> {
    const mcpPath = getVSCodeMcpConfigPath();
    if (this.options.dryRun) return;

    let mcpConfig: MCPConfig = { servers: {} };
    if (await fileExists(mcpPath)) {
      try {
        const content = await readFile(mcpPath, 'utf-8');
        mcpConfig = parse(content) as unknown as MCPConfig;
      } catch { }
    }

    if (!mcpConfig.servers) mcpConfig.servers = {};
    if (!Array.isArray(mcpConfig.inputs)) mcpConfig.inputs = [];

    mcpConfig.inputs = (mcpConfig.inputs as MCPInputConfig[]).filter(i => i.id !== 'GITLAB_TOKEN');
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
  }
}
