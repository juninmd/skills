import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { getHomeDir, getPadraoLabsAgentsDir, getVSCodeDirs } from './platform.js';
import { dirExists } from './fs.js';
import type { ToolDetection } from '../types.js';

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd} 2>/dev/null`, { encoding: 'utf-8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Detecta presença do VS Code verificando:
 * 1. Comando `code` ou `code-insiders` no PATH
 * 2. Diretório de configuração do VS Code (~/.config/Code ou equivalente por OS)
 */
async function detectVSCode(): Promise<string> {
  if (commandExists('code')) return 'code';
  if (commandExists('code-insiders')) return 'code-insiders';
  for (const dir of getVSCodeDirs()) {
    if (await dirExists(dir)) return dir;
  }
  return '';
}

const TOOL_CONFIGS: Array<{
  name: string;
  configDir: string;
  detect?: () => Promise<string>;
  command?: string;
}> = [
  {
    name: 'copilot',
    // Pasta alvo após instalação — usada como configDir para exibição
    configDir: getPadraoLabsAgentsDir(),
    // Detecção real: presença do VS Code no sistema
    detect: detectVSCode,
  },
  {
    name: 'gemini',
    configDir: join(getHomeDir(), '.gemini'),
    command: 'gemini',
  },
  {
    name: 'antigravity',
    configDir: join(getHomeDir(), '.gemini', 'antigravity'),
    command: 'antigravity',
  },
];

export async function detectTools(): Promise<ToolDetection[]> {
  const results: ToolDetection[] = [];

  for (const tool of TOOL_CONFIGS) {
    let detectedPath = '';

    if (tool.detect) {
      detectedPath = await tool.detect();
    } else {
      const configDir = tool.configDir;
      const dirDetected = await dirExists(configDir);
      const cmdDetected = tool.command ? commandExists(tool.command) : false;
      detectedPath = dirDetected ? configDir : cmdDetected ? tool.command! : '';
    }

    results.push({
      name: tool.name,
      detected: detectedPath !== '',
      configDir: tool.configDir,
      detectedPath: detectedPath || undefined,
    });
  }

  return results;
}

export function getToolNames(): string[] {
  return TOOL_CONFIGS.map(t => t.name);
}
