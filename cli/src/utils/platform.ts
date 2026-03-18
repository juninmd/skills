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

export function getRepoDir(): string {
  // O CLI está em <root>/cli/dist/utils/platform.js
  // Precisamos subir 3 níveis para chegar em <root>/cli e mais 1 para <root>
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return join(__dirname, '..', '..', '..');
}

export function getAgentsBundleDir(): string {
  return join(getRepoDir(), '.agents');
}

export function getTemplatesDir(): string {
  return join(getRepoDir(), 'templates');
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
  const home = getHomeDir();
  const baseDirs: string[] = [];

  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || '';
    baseDirs.push(join(appData, 'Code', 'User'));
    baseDirs.push(join(appData, 'Code - Insiders', 'User'));
  } else if (process.platform === 'darwin') {
    baseDirs.push(join(home, 'Library', 'Application Support', 'Code', 'User'));
    baseDirs.push(join(home, 'Library', 'Application Support', 'Code - Insiders', 'User'));
  } else {
    baseDirs.push(join(home, '.config', 'Code', 'User'));
    baseDirs.push(join(home, '.config', 'Code - Insiders', 'User'));
  }

  const allPaths: string[] = [];

  for (const userDir of baseDirs) {
    // 1. Caminho principal
    const mainSettings = join(userDir, 'settings.json');
    if (fs.existsSync(mainSettings)) {
      allPaths.push(mainSettings);
    }

    // 2. Perfis (Profiles)
    const profilesDir = join(userDir, 'profiles');
    if (fs.existsSync(profilesDir)) {
      try {
        const entries = fs.readdirSync(profilesDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const profileSettings = join(profilesDir, entry.name, 'settings.json');
            if (fs.existsSync(profileSettings)) {
              allPaths.push(profileSettings);
            }
          }
        }
      } catch (e) {
        // Silencioso
      }
    }
  }

  return [...new Set(allPaths)]; // Remove duplicatas se houver
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
