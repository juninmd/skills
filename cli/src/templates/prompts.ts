import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import type { ProjectConfig } from '../types.js';

/** Valida que o nome segue o padrao de slugs: apenas lowercase, numeros e hifens */
function validateAppName(name: string): void {
  if (!name.trim()) {
    throw new Error('Nome da aplicacao e obrigatorio.');
  }
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name.trim()) && !/^[a-z0-9]$/.test(name.trim())) {
    throw new Error(
      'Nome da aplicacao deve conter apenas letras minusculas, numeros e hifens, e nao pode comecar ou terminar com hifen.'
    );
  }
}

function validateRequired(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} e obrigatorio e nao pode ser vazio.`);
  }
}

export async function promptProjectConfig(): Promise<ProjectConfig> {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log('\nConfiguracao do projeto:\n');

  const appName = await rl.question('Nome da aplicacao: ');
  const appDescription = await rl.question('Descricao: ');
  const owner = await rl.question('Owner (squad/time): ');
  const tribe = await rl.question('Tribo (ex: comercial): ');
  const vertical = await rl.question('Vertical (ex: operacoes): ');

  try {
    validateAppName(appName);
    validateRequired(owner, 'Owner');
    validateRequired(tribe, 'Tribo');
    validateRequired(vertical, 'Vertical');
  } catch (err) {
    rl.close();
    throw err;
  }

  console.log('\nLinguagem principal:');
  console.log('  1) TypeScript');
  console.log('  2) Python');
  console.log('  3) Java');
  console.log('  4) Kotlin');
  console.log('  5) Go');
  const langAnswer = await rl.question('Escolha [1-5] (default: 1): ');
  const langMap: Record<string, [string, string]> = {
    '1': ['TypeScript', 'ts'],
    '2': ['Python', 'py'],
    '3': ['Java', 'java'],
    '4': ['Kotlin', 'kotlin'],
    '5': ['Go', 'go'],
  };
  const [languages, sonarLanguage] = langMap[langAnswer.trim()] || langMap['1'];

  console.log('\nNivel de risco do negocio:');
  console.log('  1) Low');
  console.log('  2) Medium');
  console.log('  3) High');
  console.log('  4) Critical');
  const riskAnswer = await rl.question('Escolha [1-4] (default: 1): ');
  const riskMap: Record<string, string> = { '1': 'Low', '2': 'Medium', '3': 'High', '4': 'Critical' };
  const businessRisk = riskMap[riskAnswer.trim()] || 'Low';

  const publicAccess = await rl.question('Acesso (Internal/External) [Internal]: ') || 'Internal';

  const gitlabProjectSlug = await rl.question(
    `Slug do projeto GitLab [luizalabs/${vertical}/${appName}]: `
  ) || `luizalabs/${vertical}/${appName}`;

  const sonarProjectKey = await rl.question(
    `Chave do SonarQube [default/${appName}]: `
  ) || `default/${appName}`;

  const sonarSources = await rl.question('Diretorio de fontes para Sonar [./src]: ') || './src';

  const dockerRepo = await rl.question(
    `Docker repo [gcr.io/magalu-cicd/tribe-${tribe}/${appName}]: `
  ) || `gcr.io/magalu-cicd/tribe-${tribe}/${appName}`;

  const argocdServer = await rl.question(
    `ArgoCD server [argocd-${tribe}.ipet.sh]: `
  ) || `argocd-${tribe}.ipet.sh`;

  const argocdNamespace = await rl.question(
    `ArgoCD namespace [cicd/tribe-${tribe}]: `
  ) || `cicd/tribe-${tribe}`;

  const ownerGroupId = await rl.question('Backstage owner group ID: ') || '';

  const tags = await rl.question(
    `Tags (separadas por virgula) [${sonarLanguage}]: `
  ) || sonarLanguage;

  const urlHomolog = await rl.question('URL de homologacao [http://127.0.0.1]: ') || 'http://127.0.0.1';
  const urlProd = await rl.question(`URL de producao [https://${appName}-mgc.luizalabs.com]: `)
    || `https://${appName}-mgc.luizalabs.com`;

  const fortifyId = await rl.question(`Fortify ID [${appName}]: `) || appName;

  rl.close();

  return {
    appName,
    appDescription,
    owner,
    tribe,
    vertical,
    languages,
    fortifyId,
    urlHomolog,
    urlProd,
    businessRisk,
    public: publicAccess,
    gitlabProjectSlug,
    sonarProjectKey,
    sonarSources,
    sonarLanguage,
    dockerRepo,
    argocdServer,
    argocdNamespace,
    ownerGroupId,
    tags,
  };
}
