import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { getHomeDir } from './platform.js';
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

const TOOL_CONFIGS: Array<{
  name: string;
  configDir: string;
  commands: string[];
  extraDirs: string[];
}> = [
  {
    name: 'copilot',
    configDir: '~/.copilot',
    commands: [],
    extraDirs: [],
  },
  {
    name: 'gemini',
    configDir: '~/.gemini',
    commands: ['gemini'],
    extraDirs: [],
  },
  {
    name: 'antigravity',
    configDir: '~/.gemini/antigravity',
    commands: ['antigravity'],
    extraDirs: [],
  },
  {
    name: 'claude',
    configDir: '~/.claude',
    commands: ['claude'],
    extraDirs: [],
  },
  {
    name: 'cursor',
    configDir: '~/.cursor',
    commands: ['cursor'],
    extraDirs: ['/Applications/Cursor.app'],
  },
  {
    name: 'windsurf',
    configDir: '~/.windsurf',
    commands: ['windsurf'],
    extraDirs: ['/Applications/Windsurf.app'],
  },
  {
    name: 'cline',
    configDir: '~/.cline',
    commands: [],
    extraDirs: [],
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
    let detected = await dirExists(configDir);

    if (!detected) {
      detected = tool.commands.some(cmd => commandExists(cmd));
    }

    if (!detected) {
      for (const extraDir of tool.extraDirs) {
        if (await dirExists(extraDir)) {
          detected = true;
          break;
        }
      }
    }

    results.push({
      name: tool.name,
      detected,
      configDir,
    });
  }

  return results;
}

export function getToolNames(): string[] {
  return TOOL_CONFIGS.map(t => t.name);
}
