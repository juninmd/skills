import { join } from 'node:path';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { promptProjectConfig } from '../templates/prompts.js';
import { interpolate } from '../templates/engine.js';
import { getTemplatesDir, getMasterAgentsPath } from '../utils/platform.js';
import { ensureDir, fileExists } from '../utils/fs.js';
import { log } from '../utils/logger.js';
import type { InitOptions } from '../types.js';

interface TemplateFile {
  template: string;
  output: string;
  description: string;
}

const TEMPLATE_FILES: TemplateFile[] = [
  {
    template: 'dependency.yaml.tmpl',
    output: 'dependency.yaml',
    description: 'Metadata do servico (catalog)',
  },
  {
    template: 'sonar-project.properties.tmpl',
    output: 'sonar-project.properties',
    description: 'Configuracao do SonarQube',
  },
  {
    template: 'hangar-info.yaml.tmpl',
    output: 'hangar-info.yaml',
    description: 'Componente Backstage (Hangar)',
  },
  {
    template: 'gitlab-ci.yml.tmpl',
    output: '.gitlab-ci.yml',
    description: 'Pipeline GitLab CI/CD com ci-knife',
  },
];

const AGENT_CONFIG_FILES = [
  { dest: 'AGENTS.md', description: 'Antigravity' },
  { dest: '.cursorrules', description: 'Cursor' },
  { dest: '.windsurfrules', description: 'Windsurf' },
  { dest: '.clinerules', description: 'Cline/Roo Code' },
  { dest: '.github/copilot-instructions.md', description: 'GitHub Copilot' },
];

export async function init(options: InitOptions): Promise<void> {
  log.header('Padrao Labs Agents - Inicializacao de Repositorio');

  const cwd = process.cwd();

  // Verifica se e um repo git
  if (!existsSync(join(cwd, '.git'))) {
    log.warn('Diretorio atual nao e um repositorio git.');
    log.info('Execute "git init" antes de usar este comando.');
  }

  // Coleta configuracao interativamente
  const config = await promptProjectConfig();

  // Converte config para Record<string, string> para interpolacao
  const vars: Record<string, string> = { ...config };

  const templatesDir = getTemplatesDir();
  const generated: string[] = [];
  const skipped: string[] = [];

  // Gera arquivos de template
  log.header('Gerando arquivos de configuracao');

  for (const tmpl of TEMPLATE_FILES) {
    const outputPath = join(cwd, tmpl.output);

    if (await fileExists(outputPath) && !options.force) {
      log.warn(`${tmpl.output} ja existe (use --force para sobrescrever)`);
      skipped.push(tmpl.output);
      continue;
    }

    const templatePath = join(templatesDir, tmpl.template);

    if (!(await fileExists(templatePath))) {
      log.error(`Template nao encontrado: ${tmpl.template}`);
      continue;
    }

    const templateContent = await readFile(templatePath, 'utf-8');
    const content = interpolate(templateContent, vars);

    // Garante que o diretorio pai existe
    await ensureDir(join(outputPath, '..'));
    await writeFile(outputPath, content, 'utf-8');

    log.success(`${tmpl.output} - ${tmpl.description}`);
    generated.push(tmpl.output);
  }

  // Copia agents.md para formatos das ferramentas
  log.header('Configurando arquivos de agentes');

  const masterAgentsPath = getMasterAgentsPath();
  const hasMasterAgents = await fileExists(masterAgentsPath);

  if (hasMasterAgents) {
    for (const agentFile of AGENT_CONFIG_FILES) {
      const outputPath = join(cwd, agentFile.dest);

      if (await fileExists(outputPath) && !options.force) {
        log.warn(`${agentFile.dest} ja existe (use --force para sobrescrever)`);
        skipped.push(agentFile.dest);
        continue;
      }

      await ensureDir(join(outputPath, '..'));
      await copyFile(masterAgentsPath, outputPath);

      log.success(`${agentFile.dest} - ${agentFile.description}`);
      generated.push(agentFile.dest);
    }
  } else {
    log.warn('agents.md nao encontrado no bundle. Arquivos de agente nao serao gerados.');
  }

  // Resumo
  log.header('Resumo');
  if (generated.length > 0) {
    log.table([
      ['Gerados', String(generated.length)],
      ['Pulados', String(skipped.length)],
    ]);
    console.log('');
    log.info('Arquivos gerados:');
    for (const f of generated) {
      log.detail(f);
    }
  }

  if (skipped.length > 0) {
    console.log('');
    log.info('Arquivos pulados (ja existiam):');
    for (const f of skipped) {
      log.detail(f);
    }
  }

  console.log('');
  log.success('Inicializacao concluida!');
  log.info('Revise os arquivos gerados e ajuste conforme necessario.');
}
