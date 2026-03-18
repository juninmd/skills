---
name: managing-cicd
description: Gerenciamento de pipelines GitLab CI, integração com SonarQube e deploys automatizados via ArgoCD.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[resource/project] [options]"
---

# CI/CD & Deploy

Esta skill orquestra o ciclo de vida de deploy e qualidade contínua usando GitLab CI, SonarQube, ArgoCD e ci-knife.

## When to use this skill
- Criar ou modificar pipelines GitLab CI/CD
- Configurar stages de build, test, security e deploy
- Integrar SonarQube para análise de qualidade
- Deploy automatizado para HML e PRD via ArgoCD
- Troubleshooting de falhas em pipelines

## Instructions

### Pipeline GitLab CI Básico

Um pipeline típico na Luizalabs tem 4 stages:

```yaml
stages:
  - install
  - test
  - security
  - deploy
```

### Stage: install
Instala dependências e faz build do projeto:

```yaml
build:
  stage: install
  image: node:lts-slim
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - node_modules/
  script:
    - npm install -g pnpm
    - pnpm install --frozen-lockfile
    - pnpm build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day
```

### Stage: test
Executa testes unitários e de integração:

```yaml
test:
  stage: test
  image: node:lts-slim
  script:
    - npm install -g pnpm
    - pnpm install --frozen-lockfile
    - pnpm test -- --coverage
    - pnpm test:e2e
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

### Stage: security
Scan de vulnerabilidades usando Atena (ci-knife):

```yaml
security-scan:
  stage: security
  image: $CIKNIFE_IMAGE
  script:
    - ci-knife security-scanner --project $CI_PROJECT_NAME
  only:
    - main
    - staging
```

### Stage: deploy
Deploy automatizado via ArgoCD:

```yaml
deploy_homolog:
  stage: deploy
  image: $CIKNIFE_IMAGE
  services:
    - docker:26-dind
  variables:
    ARGOCD_SERVER: argocd-mke-operacoes-hml.ipet.sh
    NAMESPACE: default
  script:
    - ci-knife argocd-deploy --tag $CI_COMMIT_SHA --server $ARGOCD_SERVER --namespace $NAMESPACE
  only:
    - develop
  when: always

deploy_prod:
  stage: deploy
  image: $CIKNIFE_IMAGE
  services:
    - docker:26-dind
  variables:
    ARGOCD_SERVER: argocd-prod.ipet.sh
    NAMESPACE: production
  script:
    - ci-knife argocd-deploy --tag $CI_COMMIT_TAG --server $ARGOCD_SERVER --namespace $NAMESPACE
  only:
    - tags
  when: manual
```

## Variáveis de Ambiente Essenciais

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `CI_COMMIT_SHA` | Hash do commit | `a1b2c3d4` |
| `CI_COMMIT_TAG` | Tag Git (releases) | `v1.2.3` |
| `DOCKER_REPO` | Repositório Docker | `gcr.io/projeto/app` |
| `ARGOCD_SERVER` | Servidor ArgoCD | `argocd-hml.ipet.sh` |
| `CIKNIFE_IMAGE` | Imagem ci-knife | `registry.luizalabs.com/ci-knife:latest` |

## Troubleshooting

### Pipeline falha no stage install
- Verifique se `pnpm-lock.yaml` ou `package-lock.json` está commitado
- Confirme que o cache está configurado corretamente
- Teste localmente: `pnpm install --frozen-lockfile`

### Testes falhando no CI mas passam local
- Diferença de timezone: adicione `TZ: America/Sao_Paulo` nas variáveis
- Banco de dados: use servicos do GitLab (`services: - postgres:14`)
- Variáveis de ambiente: verifique se todas estão definidas no CI/CD settings

### Deploy travado no ArgoCD
- Login no ArgoCD: `argocd login $ARGOCD_SERVER`
- Verificar status: `argocd app get <app-name>`
- Forçar sync: `argocd app sync <app-name> --force`
- Revisar logs do pod: `kubectl logs -n <namespace> <pod-name>`

### SonarQube Quality Gate falhou
- Revise o report: `https://sonarqube.luizalabs.com/dashboard?id=<project-key>`
- Corrija issues críticos e bloquantes primeiro
- Para projetos legados, ajuste o Quality Gate threshold no SonarQube

## Capabilities
- **Pipelines GitLab CI**: Criação e modificação de `.gitlab-ci.yml`
- **ci-knife**: Uso de comandos para deploy, security e release
- **ArgoCD**: Sincronização e troubleshooting de aplicações
- **SonarQube**: Integração de análise estática e coverage
- **Docker**: Build e push de imagens para GCR
- **Semantic Versioning**: Criação automática de releases e tags

---

## Pipeline Architecture Best Practices

### Templating & Reusabilidade
Nunca repita definições de jobs. Use `include` para centralizar templates e garantir atualizações em massa.

```yaml
# Válido: reusar template central
include:
  - project: 'luizalabs/ci-knife'
    ref: 'master'
    file: 'templates/report-security.yaml'

build_job:
  extends: .node_build_template
  script:
    - pnpm build
```

```yaml
# Inválido: copy-paste entre projetos
build_job:
  image: node:latest  # versão não fixada
  script:
    - npm i           # sem cache, lento
    - npm test
```

### Cache Strategy
Use chaves baseadas em lockfiles para invalidar cache apenas quando as dependências mudarem:
```yaml
cache:
  key:
    files:
      - pnpm-lock.yaml
  paths:
    - node_modules/
  policy: pull-push
```

### Paralelismo
Paraleliza jobs independentes no mesmo stage para reduzir lead time:
- Lint e Testes Unitários podem rodar juntos
- Sempre fixe versões de templates (`ref: 'v2.0.0'`) para evitar surpresas

### Validação Local
Antes do commit, valide a sintaxe do pipeline com `gitlab-ci-lint` ou via API:
```bash
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.luizalabs.com/api/v4/ci/lint" \
  --data-urlencode "content@.gitlab-ci.yml"
```

