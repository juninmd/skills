import { log } from '../utils/logger.js';
import { getRepoDir } from '../utils/platform.js';
import { execSync } from 'node:child_process';

export async function update(): Promise<void> {
  const timestamp = new Date().toLocaleString('pt-BR');
  log.header(`Padrao Labs Agents - Atualizacao (${timestamp})`);

  try {
    const repoDir = getRepoDir();
    log.info(`Atualizando repositorio em: ${repoDir}`);
    execSync('git pull', { cwd: repoDir, stdio: 'inherit' });
    log.success('Atualizacao concluida com sucesso via Git!');
  } catch (err) {
    log.error(`Falha na atualizacao: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
