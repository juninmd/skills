import { join } from 'node:path';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { getHomeDir, getBundledSettingsPath } from '../utils/platform.js';
import { BaseInstaller } from './base-installer.js';
import { dirExists, fileExists } from '../utils/fs.js';
import { log } from '../utils/logger.js';
import type { CategoryMapping } from '../types.js';

function stripJsonComments(data: string): string {
  let inString = false;
  let inComment = false;
  let inMultiComment = false;
  let result = '';
  
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    const nextChar = data[i + 1];

    if (inString) {
      result += char;
      if (char === '') {
        result += nextChar;
        i++;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (inComment) {
      if (char === '\n') {
        inComment = false;
        result += char;
      }
      continue;
    }

    if (inMultiComment) {
      if (char === '*' && nextChar === '/') {
        inMultiComment = false;
        i++;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === '/' && nextChar === '/') {
      inComment = true;
      i++;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      inMultiComment = true;
      i++;
      continue;
    }

    result += char;
  }

  // Remove trailing commas to make it valid JSON
  return result.replace(/,\s*([\]}])/g, '$1');
}

export class VscodeInstaller extends BaseInstaller {
  get name(): string {
    return 'vscode';
  }

  get targetDir(): string {
    if (process.platform === 'win32') {
      return join(process.env.APPDATA || join(getHomeDir(), 'AppData', 'Roaming'), 'Code', 'User');
    }
    if (process.platform === 'darwin') {
      return join(getHomeDir(), 'Library', 'Application Support', 'Code', 'User');
    }
    return join(getHomeDir(), '.config', 'Code', 'User');
  }

  get categoryMappings(): CategoryMapping[] {
    return [];
  }

  protected override async postInstall(): Promise<void> {
    const bundledSettingsPath = getBundledSettingsPath();
    if (!(await fileExists(bundledSettingsPath))) {
      if (this.options.verbose) {
        log.warn(`Settings bundle nao encontrado: ${bundledSettingsPath}`);
      }
      return;
    }

    let bundledSettings: Record<string, unknown> = {};
    try {
      const content = await readFile(bundledSettingsPath, 'utf-8');
      bundledSettings = JSON.parse(stripJsonComments(content));
    } catch {
      if (this.options.verbose) {
        log.warn(`Nao foi possivel ler ou parsear o arquivo de configuracoes: ${bundledSettingsPath}`);
      }
      return;
    }

    const mainDir = this.targetDir;
    if (!(await dirExists(mainDir))) {
      return;
    }

    const settingsFilesToUpdate: string[] = [join(mainDir, 'settings.json')];

    const profilesDir = join(mainDir, 'profiles');
    if (await dirExists(profilesDir)) {
      try {
        const profiles = await readdir(profilesDir, { withFileTypes: true });
        for (const profile of profiles) {
          if (profile.isDirectory()) {
            settingsFilesToUpdate.push(join(profilesDir, profile.name, 'settings.json'));
          }
        }
      } catch {}
    }

    for (const settingsFile of settingsFilesToUpdate) {
      if (!(await fileExists(settingsFile))) continue;

      if (this.options.dryRun) {
        log.dryRun(`Injetaria configuracoes em ${settingsFile}`);
        continue;
      }

      try {
        const content = await readFile(settingsFile, 'utf-8');
        let currentSettings: Record<string, unknown> = {};
        
        try {
          currentSettings = JSON.parse(stripJsonComments(content));
        } catch {
          log.warn(`Aviso: Nao foi possivel parsear o JSON de ${settingsFile}. Ele sera pulado.`);
          continue;
        }

        const newSettings = this.mergeSettings(currentSettings, bundledSettings);
        await writeFile(settingsFile, JSON.stringify(newSettings, null, 2), 'utf-8');
        
        if (this.options.verbose) {
          log.detail(`Configuracoes injetadas com sucesso em ${settingsFile}`);
        }
      } catch (e) {
        if (this.options.verbose) {
          log.warn(`Erro ao processar ${settingsFile}: ${e}`);
        }
      }
    }
  }

  private mergeSettings(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const result = { ...target };
    for (const [key, value] of Object.entries(source)) {
      if (
        value && typeof value === 'object' && !Array.isArray(value) &&
        result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])
      ) {
        result[key] = this.mergeSettings(result[key] as Record<string, unknown>, value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
