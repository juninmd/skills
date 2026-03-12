#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { install } from './commands/install.js';
import { update } from './commands/update.js';
import { init } from './commands/init.js';
import { cron } from './commands/cron.js';
import { setup } from './commands/setup.js';
import { skill } from './commands/skill.js';
import { log } from './utils/logger.js';
import { getCurrentPackageVersion } from './utils/version.js';

const HELP = `
padrao-labs-agents - CLI para instalar skills, agents, rules e workflows Luizalabs

Comandos:
  skill       Gerencia skills personalizadas
  install     Instala skills globalmente para ferramentas de IA detectadas
  update      Atualiza para a versao mais recente publicada
  init        Inicializa repositorio com arquivos padrao (dependency.yaml, sonar, etc.)
  cron        Configura auto-update diario via crontab
  setup       Configura o ambiente (Nexus login e VS Code Agent Plugins)

Opcoes:
  -h, --help      Mostra esta ajuda
  -v, --version   Mostra a versao
  -t, --tools     Ferramentas alvo (separadas por virgula): copilot,gemini,antigravity
  -f, --force     Sobrescreve arquivos existentes
  --dry-run       Simula execucao sem alterar arquivos
  --remove        (cron) Remove o cron de auto-update

Exemplos:
  npx @luizalabs/padrao-labs-agents setup
  npx @luizalabs/padrao-labs-agents install
  npx @luizalabs/padrao-labs-agents init
  npx @luizalabs/padrao-labs-agents cron
  npx @luizalabs/padrao-labs-agents skill install applying-yagni
`;

async function main(): Promise<void> {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: 'boolean', short: 'h', default: false },
      version: { type: 'boolean', short: 'v', default: false },
      tools: { type: 'string', short: 't' },
      force: { type: 'boolean', short: 'f', default: false },
      'dry-run': { type: 'boolean', default: false },
      remove: { type: 'boolean', default: false },
    },
  });

  if (values.version) {
    const version = await getCurrentPackageVersion();
    console.log(version);
    return;
  }

  if (values.help || positionals.length === 0) {
    console.log(HELP);
    return;
  }

  const command = positionals[0];
  const subcommand = positionals[1];
  const toolsList = values.tools ? values.tools.split(',').map(t => t.trim()) : undefined;

  try {
    switch (command) {
      case 'skill': {
        if (!subcommand || subcommand === 'help') {
          console.log(`
Gerenciamento de Skills:
  skill install <skill-name>    Instala uma skill do repositório

Exemplo:
  padrao-labs-agents skill install applying-yagni
`);
          return;
        }
        if (subcommand === 'install') {
          const skillName = positionals[2];
          if (!skillName) {
            log.error('Especifique o nome da skill');
            console.log(`Uso: padrao-labs-agents skill install <skill-name>`);
            process.exit(1);
          }
          await skill({ skillName });
        } else {
          log.error(`Subcomando desconhecido: ${subcommand}`);
          process.exit(1);
        }
        break;
      }
      case 'install':
        await install({
          tools: toolsList,
          force: values.force as boolean,
          dryRun: values['dry-run'] as boolean,
        });
        break;

      case 'update':
        await update();
        break;

      case 'init':
        await init({
          force: values.force as boolean,
        });
        break;

      case 'cron':
        await cron({
          remove: values.remove as boolean,
        });
        break;

      case 'setup':
        await setup();
        break;

      default:
        log.error(`Comando desconhecido: ${command}`);
        console.log(HELP);
        process.exit(1);
    }
  } catch (err) {
    log.error(`Erro: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
