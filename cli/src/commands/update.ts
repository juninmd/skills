import { log } from '../utils/logger.js';
import { syncRepository } from '../utils/git.js';

export async function update(): Promise<void> {
  log.header('Padrao Labs Agents - Atualizacao');

  try {
    syncRepository();
    log.success('Atualizacao concluida com sucesso via Git!');
  } catch (err) {
    log.error(`Falha na atualizacao: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
