import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export function getHomeDir(): string {
  return process.env.HOME || homedir();
}

export function expandHome(p: string): string {
  if (p.startsWith('~/')) {
    return join(getHomeDir(), p.slice(2));
  }
  return p;
}

export function getManifestDir(): string {
  return join(getHomeDir(), '.padrao-labs');
}

export function getManifestPath(): string {
  return join(getManifestDir(), 'manifest.json');
}

export function getAgentsBundleDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  // dist/utils/platform.js -> ../../agents-bundle
  return join(currentDir, '..', '..', 'agents-bundle');
}

export function getTemplatesDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  // dist/utils/platform.js -> ../../templates
  return join(currentDir, '..', '..', 'templates');
}

export function getMasterAgentsPath(): string {
  return join(getAgentsBundleDir(), 'agents.md');
}

export function getBundledSettingsPath(): string {
  return join(getAgentsBundleDir(), '.settings.json');
}

export function getVSCodeMcpConfigPath(): string {
  const home = getHomeDir();
  if (process.platform === 'win32') {
    return join(process.env.APPDATA || '', 'Code', 'User', 'mcp.json');
  } else if (process.platform === 'darwin') {
    return join(home, 'Library', 'Application Support', 'Code', 'User', 'mcp.json');
  }
  return join(home, '.config', 'Code', 'User', 'mcp.json');
}
