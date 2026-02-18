import { execSync } from 'node:child_process';
import { log } from '../utils/logger.js';
import { readManifest, getLatestVersion, getCurrentPackageVersion } from '../utils/version.js';

export async function update(): Promise<void> {
  log.header('Padrao Labs Agents - Atualizacao');

  const manifest = await readManifest();
  const currentVersion = manifest?.version || getCurrentPackageVersion();

  log.info(`Versao instalada: ${currentVersion}`);
  log.info('Verificando versao mais recente...');

  const latestVersion = getLatestVersion();

  if (!latestVersion) {
    log.warn('Nao foi possivel verificar a versao mais recente no registry.');
    log.info('Tentando reinstalar com @latest...');
    runUpdate();
    return;
  }

  log.info(`Versao mais recente: ${latestVersion}`);

  if (latestVersion === currentVersion) {
    log.success('Voce ja esta na versao mais recente!');
    return;
  }

  log.info(`Atualizando de ${currentVersion} para ${latestVersion}...`);
  runUpdate();
}

function runUpdate(): void {
  try {
    execSync(
      'npx @luizalabs/padrao-labs-agents@latest install --force',
      { stdio: 'inherit', timeout: 120000 }
    );
    log.success('Atualizacao concluida!');
  } catch (err) {
    log.error(`Falha na atualizacao: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
