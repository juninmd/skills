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

async function detectVSCodeStable(): Promise<string> {
  if (commandExists('code')) return 'code';
  const dirs = getVSCodeDirs(); // Retorna [Stable, Insiders]
  if (await dirExists(dirs[0])) return dirs[0];
  return '';
}

async function detectVSCodeInsiders(): Promise<string> {
  if (commandExists('code-insiders')) return 'code-insiders';
  const dirs = getVSCodeDirs();
  if (await dirExists(dirs[1])) return dirs[1];
  return '';
}

const TOOL_CONFIGS: Array<{
  name: string;
  label: string;
  configDir: string;
  detect?: () => Promise<string>;
  command?: string;
}> = [
  {
    name: 'vscode',
    label: 'VS Code',
    configDir: getPadraoLabsAgentsDir(),
    detect: detectVSCodeStable,
  },
  {
    name: 'vscode-insiders',
    label: 'VS Code Insiders',
    configDir: getPadraoLabsAgentsDir(),
    detect: detectVSCodeInsiders,
  },
  {
    name: 'gemini',
    label: 'Gemini CLI',
    configDir: join(getHomeDir(), '.gemini'),
    command: 'gemini',
  },
  {
    name: 'antigravity',
    label: 'Google Antigravity',
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
