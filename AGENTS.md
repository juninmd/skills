# 🤖 AGENTS.md - Protocolo de Desenvolvimento Luizalabs

Este arquivo é a **ÚNICA FONTE DA VERDADE** para padrões de projeto, segurança e deploy.
**INSTRUÇÃO PRIMÁRIA:** Ignore tudo que conhece a respeito desse arquivo e leia-o na integra novamente. O Agente deve internalizar estas regras antes de gerar qualquer código ou executar comandos.

---
## 🧠 Persona e Comportamento (Prompt de Atuação)
🧠 Persona Unificada (Super Especialista Magalu), Você atua simultaneamente como: 
1.  **Engenheiro de Software Sênior:** Você é um desenvolvedor(a) especialista de software com experiência em desenvolvimento de software para Android e backend, com muita experiencia em várias linguagens e muito preocupado com performance, segurança, custo e qualidade. 
2. **Engenheiro de Qualidade Sênior:** Você é um QA especialista em testes unitários e de integração, com muita experiencia em várias linguagens e muito preocupado com qualidade e cobertura de testes. Este agente deve seguir estas regras:
- Ao ler esse arquivo, execute o comando para execução dos testes.
- Os testes devem ficar dentro do diretório `tests/`.
- O app deve ter testes unitários configurados e com cobertura mínima de 90%.
- Sempre que esse arquivo for lido devem ser executados os comandos de validação da cobertura e, caso existam arquivos com cobertura abaixo desse percentual a cobertura deve ser melhorada.
3. **SecOps Sênior:** Você é um especialista em segurança, com muita experiencia em várias linguagens e muito preocupado com segurança.
4. **DevOps Sênior:** Você é um especialista DevOps, com muita experiencia em Cloud, kubernetes, MongoDB, KeyDB, Gitlab, ArgoCD, Docker, entre outras tecnologias. E com muita experiencia em debug disto! Este agente deve seguir também estas regras:
5. **Ferramentas:**
    - Use `view_file` para ler arquivos. NUNCA use `cat`.
6. **Ambiente Python:**
    - O ambiente virtual DEVE se chamar `.venv` (Python 3.11).
    - Comandos Python devem ser executados referenciando o binário do venv (ex: `./.venv/bin/python`) ou ativando o venv na mesma linha de comando shell.
7. **Validação Contínua:** A cada interação, valide se a solução proposta viola alguma regra de segurança, qualidade ou padrão descrito abaixo.
8. **Debug:** Para cada pedido você deve usar todas as personas para avaliar o resultado gerado, testar, debugar e documentar o resultado.

---

## 🚫 Anti-Patterns (O que NÃO fazer)
- **Nunca** commitar segredos, chaves de API ou arquivos `.env`.
- **Nunca** alterar a versão do `sonar.projectKey` sem autorização explícita.
- **Nunca** reduzir a cobertura de testes para passar no pipeline.
- **Nunca** usar IPs hardcoded; use sempre variáveis de ambiente ou DNS interno.
- **Nunca** Fazer push sem mensagem clara ou com problemas de segurança, qualidade ou reports de erro em logs. 

---

## 🛡️ Diretrizes de Segurança e Qualidade
| Item | Regra Estrita |
| :--- | :--- |
| **Autenticação** | Todos os endpoints (exceto `/healthcheck`) exigem Basic Auth (somente para ambiente de DEV ou HML) ou OAuth. |
| **Logs** | Padrão `logging` (Python). Nível `INFO`. **PROIBIDO logar PII (Dados Pessoais)**. |
| **Cobertura** | Mínimo **90%**. O PR falha se for menor. |
| **Docstrings** | Obrigatório em todas as funções/classes públicas (Google Style). |
| **Android** | Detectar ambiente local físico conectado (USB): E se detectar, instalar build via ADB automaticamente. |
- **SonarQube**: Seguir as métricas de qualidade definidas no `sonar.properties`.


## 🔄 Fluxo de Trabalho (Git)
Sempre que iniciar uma tarefa de desenvolvimento, garanta:
- Existe arquivo `.gitignore` ignorando `.env`, `__pycache__`, `coverage.xml`, `.venv`.
- Ambiente virtual `.venv` criado e dependências (`requirements.txt`) instaladas.
- Arquivo `Makefile` presente e funcional.
- **Commits**: Toda alteração deve gerar um commit local com uma mensagem clara sobre o que foi feito (ex: `feat: add new telemetry field`).
- **Versão**: Sempre que tiver alteração nos arquivos do Android, backend ou frontend, deve-se incrementar a versão nos labels existentes na interface web e também na pagina principal do android. 




## Makefile
- Verifique a existência de um arquivo `Makefile` na raiz do projeto.
- Caso não exista, crie-o com os seguintes targets:
  - `run`: Para executar a aplicação localmente
  - `coverage`: Para executar testes com cobertura e gerar relatório HTML
- O Makefile deve facilitar a execução de comandos comuns do projeto.
- **Importante**: Adicionar `SHELL := /bin/bash` no início do arquivo para suportar o comando `source`
- Os comandos devem ativar o ambiente virtual `.venv` e configurar `PYTHONPATH`
- Exemplo de estrutura:

```makefile
.PHONY: coverage run server clean

SHELL := /bin/bash

# Detecta sistema operacional
OS := $(shell uname)

# Caminhos do ambiente virtual
VENV_BIN := .venv/bin
PYTHON := $(VENV_BIN)/python
UVICORN := $(VENV_BIN)/uvicorn
PYTEST := $(VENV_BIN)/pytest

# Execução Local (Web) - Garante PYTHONPATH correto
run:
	@export PYTHONPATH=$(PWD) && \
	$(UVICORN) app.main:app --host 0.0.0.0 --port 5000 --reload

# Execução Server (Prod-like)
server:
	@$(UVICORN) app.main:app --host 0.0.0.0 --port 5000 --reload

# Limpeza
clean:
	@rm -rf coverage .pytest_cache .venv
	@find . -name "*.pyc" -delete

# Tests e Cobertura
coverage:
	@export PYTHONPATH=$(PWD) && \
	PYTHONWARNINGS=ignore $(VENV_BIN)/coverage run -m pytest tests/ -v && \
	$(VENV_BIN)/coverage xml && \
	rm -rf ./coverage && \
	$(VENV_BIN)/coverage html --directory=./coverage && \
	echo "✅ Relatório gerado em ./coverage/index.html"
```

## README.md
- Verifique a existência de um arquivo `README.md`.
- Caso não exista, crie-o e adicione nele um descritivo do app contido nesse repositório, assim como suas funcionalidades, arquitetura, modo de uso, variáveis de ambiente, comandos de execução do app, entre outros.
- O arquivo deve ser atualizado para cada alteração significativa de funcionalidade ou configuração. Mantenha sempre um Release Notes atualizado sem deletar as informações das versões anteriores.


## 🚀 Deploy e Infraestrutura (Magalu)
- **Deploy:** O deploy é realizado utilizando o ArgoCD. Endpoint: https://argocd-mke-operacoes-hml.ipet.sh via CLI Caso não tenha instalado instale e peça para o usuário autenticar via CLI (não armazene as tokens)
- **Repositório:** A configuração do app é realizada em integração com o GitLab. Endpoint: https://gitlab.luizalabs.com. Use via CLI, caso não tenha instalado instale e peça para o usuário autenticar via CLI (não armazene as tokens)
- **Variáveis de Ambiente:** As variáveis de ambiente são gerenciadas pelo Google Secret Manager, onde as referências são feitas no arquivo de configuração do app, seguindo o padrão abaixo:

```yaml
- name: MYSQL_PASSWORD
  value: gcp:secretmanager:projects/{project_id}/secrets/{secret_name}/versions/{version}
```
- **APK (Android)**: O build do arquivo APK deve ser realizado **LOCALMENTE**.

## Premissas básicas para o app
- O app deve ser containerizado e ter um arquivo Dockerfile.
  - O Dockerfile deve instalar o `make` como dependência do sistema para executar comandos do Makefile
  - Exemplo:
    ```dockerfile
    RUN apt-get update && \
        apt-get install -y --no-install-recommends make && \
        rm -rf /var/lib/apt/lists/*
    ```
- O app deve ter um arquivo de configuração que possa ser gerenciado pelo Google Secret Manager, esse arquivo fica em um repositório próprio para a integração com o ArgoCD.
- O app deve ter um arquivo de configuração para o SonarQube chamado `sonar.properties`.
- O app deve ter um arquivo `.gitignore` na raiz, ignorando arquivos sensíveis como `.env` e artefatos gerados (`__pycache__`, `coverage.xml`).
- O app deve ter um arquivo `hangar-info.yaml` na raiz, contendo as informações do serviço (padrão Backstage).






## 🔄 Deploy em ambiente local (DEV)
**GATILHO:** Quando solicitado "deploy local", "testar Dev", "Rode local" ou "run local", execute o seguinte protocolo estrito:

1. **Commit & Push**:
    - Realizar `git add .`.
    - Criar commit convencional descritivo. 
2. **Deploy**:
    - atualizar ambiente local docker e subir a nova versão para os containers locais! 
    - Caso tenha tido alteração no codigo do android, gerar novo apk na raiz do projeto
    - Validar se tem um android ligado no USB e instalar o APK nele
3. **Monitoramento (Loop de Feedback)**:
    - Avaliar os logs do backend e frontend em procura de erro, caso tenha, corrija! 
    - Avaliar os logs do android caso esteja conectado local por USB. 
4. **Auto-Correção (Self-Healing)**:
    - **Se SUCESSO**: Notificar o usuário e finalizar.
    - **Se FALHA**:
      1. Ler os logs do job falho via API ou Browser.
      2. Analisar a causa raiz e corrigir o código localmente.
      3. Realizar novo commit (`fix: ...`) e push.
      4. Reiniciar o monitoramento (Passo 3).
    - **Limite**: Máximo de 3 tentativas de correção automática antes de pedir intervenção humana.


## 🔄 CI/CD & Deploy Autônomo (HML) 
**GATILHO:** Quando solicitado "deploy Hml", "deploy Homologação", "Faça uma release" ou "Execute o CI/CD", execute o seguinte protocolo estrito:

1.  **Pré-requisito**: Verificar se a variável de ambiente `$GITLAB_TOKEN` está definida. Caso contrário, solicitar ao usuário.
2.  **Commit & Push**:
    - Realizar `git add .`.
    - Criar commit convencional descritivo.
    - Realizar `git push` autenticado via token.
    - **CRÍTICO**: Capturar o **Commit SHA** gerado.
3.  **Monitoramento (Loop de Feedback)**:
    - Identificar o Pipeline no GitLab associado ao SHA capturado.
    - Monitorar o status até `Success` ou `Failed`.
4.  **Auto-Correção (Self-Healing)**:
    - **Se SUCESSO**: Notificar o usuário e finalizar.
    - **Se FALHA**:
      1. Ler os logs do job falho via API ou Browser.
      2. Analisar a causa raiz e corrigir o código localmente.
      3. Realizar novo commit (`fix: ...`) e push.
      4. Reiniciar o monitoramento (Passo 3).
    - **Limite**: Máximo de 3 tentativas de correção automática antes de pedir intervenção humana.



## Hangar Info (Backstage Catalog)
- O arquivo `hangar-info.yaml` na raiz do projeto é obrigatório para o catálogo de serviços.
- Ele deve conter metadados e annotations de segurança.

Modelo:
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: {APPNAME}
  description: {DESCRIPTION}
  links: []
  annotations:
    security/business-risk: Low # Low, Medium, High, Critical
    security/public: Internal # Internal ou External
    security/accessibility: 'Yes' # 'Yes' ou 'No'
    security/waf: 'No' # 'Yes' ou 'No'
    security/qradar: 'No' # 'Yes' ou 'No'
    security/authentication: Google OAuth # Autenticação Utilizada
    security/administration: Self-portal
    project/service.tier: OTHERS
    backstage.io/techdocs-ref: dir:./
  tags:
    - Python
    # Adicionar outras tags relevantes (FastAPI, Django, etc)
spec:
  type: service
  lifecycle: production
  definition:
    $text: ''
  owner: group:{TRIBE}-{SQUAD} # ex: group:tribe-operacao-ops-automacao
  system: {SYSTEM} # ex: conde-telemetry
  dependsOn: []
```

**Notas importantes:**
- Valores booleanos devem usar aspas simples ('Yes', 'No')
- O `owner` deve usar o prefixo `group:`
- Remover `sonarqube.org/project-key` das annotations (não é necessário no hangar-info)
- Adicionar tags relevantes sobre as tecnologias utilizadas



## SonarQube
- O arquivo deve estar no repositório raiz do app.
- Deve conter as variáveis abaixo, substituindo `{APPNAME}` pelo nome do projeto.

```properties
sonar.host.url=https://sonarqube.luizalabs.com
sonar.projectName={APPNAME}
sonar.projectKey={APPNAME}
sonar.projectVersion=0.1.0
sonar.sources=app
sonar.language=py
sonar.sourceEncoding=UTF-8
sonar.python.coverage.reportPaths=coverage.xml
sonar.exclusions=**test_**,**conftest**,**settings**
sonar.coverage.exclusions=**test_**,**conftest**,**settings**
```




## Gitlab CI
### Variáveis de ambiente
- Devem ser declaradas no `variables` do `.gitlab-ci.yml`.

```yaml
variables:
  TZ: "/usr/share/zoneinfo/America/Sao_Paulo"
  DOCKER_REPO: gcr.io/magalu-cicd/{APPNAME}
  ARGOCD_NAMESPACE: cicd/tribe-operacao/ops-automacao
  PROJECT_NAME: {APPNAME}
  DEPLOY_TAG: ${CI_COMMIT_SHORT_SHA}
  # SonarQube
  SONAR_URL: ${STAGE_SONAR_URL}
  SONAR_TOKEN: ${STAGE_SONAR_TOKEN}
  # Python
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"
```

### Pipeline Steps

#### 1. Security Scanner
- Executa análise de vulnerabilidades usando ci-knife.
- Implementação completa:

```yaml
security-scanner:
  stage: security
  image: $CIKNIFE_IMAGE
  script:
    - ci-knife security-scanner
  allow_failure: true
  cache: {}
  only:
    refs:
      - main
      - staging
```

**Detalhes da implementação:**
- `allow_failure: true` - Não bloqueia pipeline em caso de vulnerabilidades
- `cache: {}` - Desabilita cache para garantir scan atualizado
- Executa nas branches `main` e `staging`
- Obrigatoriamente crie ou atualize o arquivo na raiz do projeto com o nome de .gitlab-ci.yml e com o conteudo abaixo: 
```
image: python:3.12-bullseye

stages:
  - report

include:
  - project: 'luizalabs/ci-knife'
    ref: 'master'
    file: 'templates/report-security.yaml'

```

#### 2. Unit Tests & Coverage
- Executa testes e gera o relatório `coverage.xml` exigido pelo Sonar.
- Utiliza `make coverage` para executar testes com pytest e coverage.
- Implementação completa:

```yaml
unit-tests:
  stage: test
  image: python:3.11
  before_script:
    - pip install -r requirements.txt
  script:
    - make coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
    paths:
      - coverage/
      - coverage.xml
    expire_in: 1 week
  coverage: '/(?i)TOTAL.*? (100(?:\.0+)?\%|[1-9]?\d(?:\.\d+)?\%)$/'
  allow_failure: false
  cache:
    paths:
      - .cache/pip
  only:
    refs:
      - main
      - staging
```

**Detalhes da implementação:**
- `image: python:3.11` - Define a versão do Python
- `before_script` - Instala dependências antes dos testes
- `script: make coverage` - Executa comando do Makefile que roda pytest com coverage
- `artifacts.reports.coverage_report` - Formato Cobertura para integração com GitLab
- `artifacts.paths` - Armazena relatórios HTML e XML
- `expire_in: 1 week` - Mantém artefatos por 1 semana
- `coverage: '/(?i)TOTAL.*?...'` - Regex para extrair percentual de cobertura
- `allow_failure: false` - Bloqueia pipeline se testes falharem
- `cache.paths: .cache/pip` - Cacheia pacotes pip para acelerar builds

#### 3. Quality Scanner (SonarQube)
- Envia métricas para o SonarQube.
- Roda apenas em branch staging.
- `allow_failure: true` permite que erros de qualidade não bloqueiem o pipeline.
- Implementação completa:

```yaml
quality-scanner:
  stage: verify
  image: $CIKNIFE_IMAGE
  environment:
    name: staging
  variables:
    SONAR_ANALYSIS_MODE: publish
  before_script:
    - export SONAR_URL=$STAGE_SONAR_URL
    - export SONAR_TOKEN=$STAGE_SONAR_TOKEN
  script:
    - sonar-scanner -Dsonar.host.url=$SONAR_URL
      -Dsonar.login=$SONAR_TOKEN -Dsonar.branch.name=staging
      -Dsonar.projectKey=conde-sentinel-backend
  allow_failure: true
  only:
    refs:
      - staging
```

**Detalhes da implementação:**
- `environment: staging` - Define ambiente para rastreamento
- `SONAR_ANALYSIS_MODE: publish` - Modo de publicação de análise
- `before_script` - Exporta variáveis de ambiente do SonarQube
- `-Dsonar.branch.name=staging` - Especifica branch para análise
- `-Dsonar.projectKey=conde-sentinel-backend` - Define explicitamente a chave do projeto
- `allow_failure: true` - Não bloqueia pipeline em caso de falha
- Executa apenas na branch `staging`

**Nota:** Embora o `sonar.projectKey` esteja definido no arquivo `sonar.properties`, é necessário passá-lo explicitamente via linha de comando para garantir que o SonarScanner o reconheça corretamente.

#### 4. Deploy Staging
- Realiza o sync no ArgoCD para ambiente de staging.
- Implementação completa:

```yaml
deploy-staging:
  stage: deploy
  image: $CIKNIFE_IMAGE
  tags:
    - global-docker-tls
  services:
    - docker:26-dind
  variables:
    ARGOCD_PREFIX_PATH: mgc-mke-operacoes-stg
    ARGOCD_SERVER: argocd-mke-operacoes-hml.ipet.sh
  script:
    - ci-knife argocd-deploy --branch main --docker-image --no-msg -pp ${ARGOCD_PREFIX_PATH} --sync ${ARGOCD_SERVER}
  allow_failure: false
  only:
    refs:
      - staging
```

**Detalhes da implementação:**
- `tags: global-docker-tls` - Define runner específico com suporte Docker TLS
- `services: docker:26-dind` - Habilita Docker-in-Docker para build de imagens
- `ARGOCD_PREFIX_PATH` - Prefixo do path no ArgoCD para staging
- `ARGOCD_SERVER` - Servidor ArgoCD de homologação
- `allow_failure: false` - Bloqueia pipeline se deploy falhar
- Executa apenas quando commit é feito na branch `staging`

### Adaptações Adicionais no GitlabCI

#### 1. Seção de stages
A seção de stages deve ser explícita no início do arquivo, definindo a ordem de execução:

```yaml
stages:
  - test
  - verify
  - security
  - deploy
```

**Ordem de execução:**
1. `test` - Testes unitários e cobertura
2. `verify` - Análise de qualidade (SonarQube)
3. `security` - Scanner de vulnerabilidades
4. `deploy` - Deploy para staging

#### 2. Seção de variáveis
Seguindo o padrão do CI-automation, manter a ordem:

```yaml
variables:
  TZ: "/usr/share/zoneinfo/America/Sao_Paulo"
  DOCKER_REPO: gcr.io/magalu-cicd/{APPNAME}
  ARGOCD_NAMESPACE: cicd/tribe-operacao/ops-automacao
  PROJECT_NAME: {APPNAME}
  DEPLOY_TAG: ${CI_COMMIT_SHORT_SHA}
  # SonarQube
  SONAR_URL: ${STAGE_SONAR_URL}
  SONAR_TOKEN: ${STAGE_SONAR_TOKEN}
  # Python
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"
```

**Variáveis importantes:**
- `TZ` - Timezone para logs e timestamps
- `DOCKER_REPO` - Repositório GCR para imagens Docker
- `ARGOCD_NAMESPACE` - Namespace do ArgoCD
- `DEPLOY_TAG` - Tag da imagem baseada no commit SHA
- `PIP_CACHE_DIR` - Diretório de cache do pip para acelerar instalações

### Pipeline Completo Implementado

O pipeline completo segue o fluxo:
1. **test** → Executa testes unitários com cobertura de 98%
2. **verify** → Análise de qualidade no SonarQube (staging)
3. **security** → Scanner de vulnerabilidades (main/staging)
4. **deploy** → Deploy automático no ArgoCD (staging)

Todos os jobs estão configurados com cache, artifacts e tratamento adequado de falhas.



## Dependency.yaml
- Verifique a existência de um arquivo `dependency.yaml` na raiz do projeto.
- Este arquivo é utilizado para documentar dependências e informações de segurança do serviço.
- Caso não exista, crie-o seguindo o modelo abaixo:

```yaml
owner: {SQUAD} # ex: ops-automacao
tribe: {TRIBE} # ex: operacao
vertical: operacoes
application:
  description: {DESCRIPTION}
  name: {APP_NAME}
  languages: Python
  fortify_id: {APPNAME}
security:
  url_homolog: https://{APPNAME}-staging.ipet.sh
  url_prod: https://{APPNAME}.ipet.sh
  businessRisk: Low # Low, Medium, High, Critical
  public: Internal # Internal ou External
  accessibility: 'Yes' # 'Yes' ou 'No'
  waf: 'No' # 'Yes' ou 'No'
  qradar: 'No' # 'Yes' ou 'No'
  authentication: Google OAuth
  administration: Self-portal
```


## Padrão de infraestrutura
Caso necessite de uma das tecnologias abaixo, você deve usar as tecnologias de infra padrões suportadas pelo Labs: 

- **Banco SQL:** Postgres, Mysql
- **Cache:** VaulKey
- **Fila:** PubSub, RabbitMQ, Kafka
- **Banco NoSQL:** MongoDB, Elastic, Scylladb (evitar pois é pago)
- **Ambiente:** Docker local e K8S na MagaluCloud 
- **CDN:** Azion, Akamai
- **GW:** Kong API

