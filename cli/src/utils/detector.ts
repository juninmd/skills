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
}> = [
  {
    name: 'copilot',
    configDir: '~/.copilot',
  },
  {
    name: 'gemini',
    configDir: '~/.gemini',
  },
  {
    name: 'antigravity',
    configDir: '~/.gemini/antigravity',
  },
  {
    name: 'claude',
    configDir: '~/.claude',
  },
  {
    name: 'cursor',
    configDir: '~/.cursor',
  },
  {
    name: 'windsurf',
    configDir: '~/.windsurf',
  },
  {
    name: 'cline',
    configDir: '~/.cline',
  },
  {
    name: 'vscode',
    configDir: process.platform === 'win32' 
      ? '~/AppData/Roaming/Code/User' 
      : process.platform === 'darwin' 
        ? '~/Library/Application Support/Code/User' 
        : '~/.config/Code/User',
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
    const detected = await dirExists(configDir);
    const detectedPath = detected ? configDir : '';

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
