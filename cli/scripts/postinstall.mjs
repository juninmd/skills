import { execSync } from 'child_process';

try {
  // Build TypeScript
  console.log('Building CLI...');
  execSync('npm run build', { stdio: 'inherit' });

  // Setup cron job (se não estiver em CI/CD)
  console.log('Setting up auto-update schedule...');
  execSync('node ./dist/index.js cron', { stdio: 'inherit' });
} catch (e) {
  // Não quebra a instalação se algo falhar
  console.warn('⚠️  Postinstall warning:', e.message);
}
