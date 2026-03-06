import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import * as fs from 'node:fs';

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
  return join(getHomeDir(), '.agents');
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

export function getPadraoLabsAgentsDir(): string {
  return getManifestDir();
}

export function getVSCodeUserDir(): string {
  const home = getHomeDir();
  if (process.platform === 'win32') {
    return join(process.env.APPDATA || '', 'Code', 'User');
  } else if (process.platform === 'darwin') {
    return join(home, 'Library', 'Application Support', 'Code', 'User');
  }
  return join(home, '.config', 'Code', 'User');
}

export function getVSCodeMcpConfigPath(): string {
  return join(getVSCodeUserDir(), 'mcp.json');
}

export function getVSCodeSettingsPath(): string {
  return join(getVSCodeUserDir(), 'settings.json');
}

export function getVSCodeSettingsPaths(): string[] {
  const userDir = getVSCodeUserDir();
  const paths: string[] = [join(userDir, 'settings.json')];

  const profilesDir = join(userDir, 'profiles');
  if (fs.existsSync(profilesDir)) {
    try {
      const entries = fs.readdirSync(profilesDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          paths.push(join(profilesDir, entry.name, 'settings.json'));
        }
      }
    } catch (e) {
      // Ignora erros de leitura do diretório de perfis
    }
  }
  return paths;
}

/** Arquivo global ~/.copilotignore aplica-se a todos os projetos do usuário. */
export function getGlobalCopilotIgnorePath(): string {
  return join(getHomeDir(), '.copilotignore');
}

export function getVSCodeDirs(): string[] {
  const home = getHomeDir();
  if (process.platform === 'win32') {
    return [
      join(process.env.APPDATA || '', 'Code'),
      join(process.env.APPDATA || '', 'Code - Insiders'),
    ];
  } else if (process.platform === 'darwin') {
    return [
      join(home, 'Library', 'Application Support', 'Code'),
      join(home, 'Library', 'Application Support', 'Code - Insiders'),
    ];
  }
  return [
    join(home, '.config', 'Code'),
    join(home, '.config', 'Code - Insiders'),
  ];
}
