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
