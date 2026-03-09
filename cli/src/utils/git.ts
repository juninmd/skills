import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { log } from './logger.js';
import { getManifestDir } from './platform.js';

const REPO_URL = 'git@gitlab.luizalabs.com:luizalabs/padrao-labs-agents.git';

export function syncRepository(): string {
  const targetDir = join(getManifestDir(), '.repo');
  
  if (existsSync(targetDir)) {
    log.info('Atualizando repositorio padrao-labs-agents via git pull...');
    try {
      execSync('git pull', { cwd: targetDir, stdio: 'ignore', timeout: 30000 });
    } catch (err) {
      log.error('Falha ao fazer git pull. Verifique sua chave SSH e acesso ao GitLab.');
      throw err;
    }
  } else {
    log.info('Clonando repositorio padrao-labs-agents...');
    try {
      execSync(`git clone ${REPO_URL} ${targetDir}`, { stdio: 'ignore', timeout: 60000 });
    } catch (err) {
      log.error('Falha ao clonar o repositorio. Verifique sua chave SSH e acesso ao GitLab.');
      throw err;
    }
  }
  
  return targetDir;
}
