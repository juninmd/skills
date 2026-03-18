import { execSync } from 'node:child_process';
import { log } from '../utils/logger.js';
import { ensureDir } from '../utils/fs.js';
import { getManifestDir } from '../utils/platform.js';
import type { CronOptions } from '../types.js';

const CRON_MARKER = '# padrao-labs-agents-auto-update';
const CRON_SCHEDULE = '0 9 * * 1-5';
const CRON_COMMAND = 'padrao-labs-agents update';

/** Detecta ambientes CI/CD onde instalar cron nao faz sentido */
const IS_CI = !!(
  process.env['CI'] ||
  process.env['GITLAB_CI'] ||
  process.env['GITHUB_ACTIONS'] ||
  process.env['JENKINS_URL'] ||
  process.env['CIRCLECI'] ||
  process.env['TF_BUILD'] ||
  process.env['BUILDKITE']
);

function crontabAvailable(): boolean {
  try {
    execSync('which crontab', { encoding: 'utf-8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function isCronEnabled(): boolean {
  if (IS_CI || !crontabAvailable()) return false;
  try {
    const existing = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' });
    return existing.includes(CRON_MARKER);
  } catch {
    return false;
  }
}

export async function cron(options: CronOptions): Promise<void> {
  log.header('Padrao Labs Agents - Cron Auto-Update');

  // Ambientes CI/CD nao precisam de cron local
  if (IS_CI) {
    log.info('Ambiente CI/CD detectado. Configuracao de cron ignorada.');
    log.info('O auto-update via cron e destinado a maquinas de desenvolvimento.');
    return;
  }

  // Sistemas sem crontab (Windows, Docker sem daemon de cron, etc.)
  if (!crontabAvailable()) {
    log.warn('crontab nao disponivel neste sistema. Auto-update nao configurado automaticamente.');
    
    if (process.platform === 'win32') {
      log.info('### Instrucoes para Windows (Agendador de Tarefas) ###');
      log.info('Para manter seus agentes atualizados, crie uma tarefa basica no Windows:');
      log.info('1. Abra o "Agendador de Tarefas" (Task Scheduler)');
      log.info('2. Clique em "Criar Tarefa Basica..." e de o nome "PadraoLabsAutoUpdate"');
      log.info('3. Gatilho: Diariamente, as 09:00:00');
      log.info('4. Acao: Iniciar um programa');
      log.info('5. Programa/script: padrao-labs-agents.cmd');
      log.info('6. Adicione os argumentos: update');
      log.info('----------------------------------------------------');
    } else {
      log.info('Execute "padrao-labs-agents update" manualmente para atualizar.');
    }
    return;
  }

  // Le crontab atual
  let existing = '';
  try {
    existing = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' });
  } catch {
    // Sem entradas de crontab existentes - comportamento normal
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

    // Usa input option para evitar shell injection
    execSync('crontab -', { input: filtered + '\n', encoding: 'utf-8', stdio: 'pipe' });
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
  const newEntry = `${CRON_SCHEDULE} (date "+\\%Y-\\%m-\\%d \\%H:\\%M:\\%S" && ${CRON_COMMAND}) >> ${logFile} 2>&1 ${CRON_MARKER}`;
  const newCrontab = existing.trimEnd() + '\n' + newEntry + '\n';

  // Usa input option para evitar shell injection
  execSync('crontab -', { input: newCrontab, encoding: 'utf-8', stdio: 'pipe' });

  log.success('Cron de auto-update configurado!');
  log.table([
    ['Horario', 'Seg-Sex as 09:00'],
    ['Comando', CRON_COMMAND],
    ['Log', logFile],
  ]);
  log.info('Use "padrao-labs-agents cron --remove" para desativar.');
}
