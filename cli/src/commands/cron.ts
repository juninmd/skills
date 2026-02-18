import { execSync } from 'node:child_process';
import { log } from '../utils/logger.js';
import { ensureDir } from '../utils/fs.js';
import { getManifestDir } from '../utils/platform.js';
import type { CronOptions } from '../types.js';

const CRON_MARKER = '# padrao-labs-auto-update';
const CRON_SCHEDULE = '0 9 * * 1-5';
const CRON_COMMAND = 'npx @luizalabs/padrao-labs-agents@latest update';

export async function cron(options: CronOptions): Promise<void> {
  log.header('Padrao Labs Agents - Cron Auto-Update');

  // Le crontab atual
  let existing = '';
  try {
    existing = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' });
  } catch {
    // Sem crontab existente
  }

  const hasEntry = existing.includes(CRON_MARKER);

  if (options.remove) {
    if (!hasEntry) {
      log.info('Nenhum cron de auto-update encontrado.');
      return;
    }

    const filtered = existing
      .split('\n')
      .filter(line => !line.includes(CRON_MARKER))
      .join('\n')
      .trim();

    execSync(`echo "${filtered}" | crontab -`, { stdio: 'pipe' });
    log.success('Cron de auto-update removido.');
    return;
  }

  if (hasEntry) {
    log.info('Cron de auto-update ja esta configurado.');
    log.detail('Use --remove para remover.');
    return;
  }

  // Garante que o diretorio de log existe
  await ensureDir(getManifestDir());

  const logFile = `${getManifestDir()}/cron.log`;
  const newEntry = `${CRON_SCHEDULE} ${CRON_COMMAND} >> ${logFile} 2>&1 ${CRON_MARKER}`;
  const newCrontab = existing.trimEnd() + '\n' + newEntry + '\n';

  execSync(`echo "${newCrontab}" | crontab -`, { stdio: 'pipe' });

  log.success('Cron de auto-update configurado!');
  log.table([
    ['Horario', 'Seg-Sex as 09:00'],
    ['Comando', CRON_COMMAND],
    ['Log', logFile],
  ]);
  log.info('Use "padrao-labs-agents cron --remove" para desativar.');
}
