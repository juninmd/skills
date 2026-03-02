import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { getHomeDir } from './platform.js';
import { dirExists, fileExists } from './fs.js';
import type { ToolDetection } from '../types.js';

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd} 2>/dev/null`, { encoding: 'utf-8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

const TOOL_CONFIGS: Array<{
  name: string;
  configDir: string;
  command?: string;
}> = [
  {
    name: 'copilot',
    configDir: '~/.agents',
    // GitHub Copilot nao tem bin proprio; deteccao por diretorio e suficiente
  },
  {
    name: 'gemini',
    configDir: '~/.gemini',
    command: 'gemini',
  },
  {
    name: 'antigravity',
    configDir: '~/.gemini/antigravity',
    command: 'antigravity',
  },
];

function resolveHome(p: string): string {
  if (p.startsWith('~/')) {
    return join(getHomeDir(), p.slice(2));
  }
  return p;
}

export async function detectTools(): Promise<ToolDetection[]> {
  const results: ToolDetection[] = [];

  for (const tool of TOOL_CONFIGS) {
    const configDir = resolveHome(tool.configDir);
    const dirDetected = await dirExists(configDir);
    const cmdDetected = tool.command ? commandExists(tool.command) : false;
    const detected = dirDetected || cmdDetected;
    const detectedPath = dirDetected ? configDir : (cmdDetected ? tool.command! : '');

    results.push({
      name: tool.name,
      detected,
      configDir,
      detectedPath,
    });
  }

  return results;
}

export function getToolNames(): string[] {
  return TOOL_CONFIGS.map(t => t.name);
}
