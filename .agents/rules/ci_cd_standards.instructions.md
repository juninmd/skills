---
name: ci-cd-standards
description: Padrões para integração contínua e qualidade de código (GitLab CI, SonarQube).
applyTo: '**/.gitlab-ci.yml, **/sonar-project.properties'
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

Exemplo de padrões para integração contínua e qualidade de código usando GitLab CI e SonarQube. Adapte os exemplos conforme necessário para o ecossistema do seu projeto (Python, Node.js, Go, etc.).

# Rule: CI/CD Standards

## SonarQube
- Arquivo `sonar-project.properties` na raiz do projeto é obrigatório.
- Deve conter:
  ```properties
  sonar.projectName={APPNAME}
  sonar.projectKey={APPNAME}
  sonar.sources={SOURCE_DIR}
  sonar.language={LANGUAGE}
  sonar.sourceEncoding=UTF-8
  sonar.exclusions={EXCLUSIONS}
  sonar.coverage.exclusions={EXCLUSIONS}
  ```

## GitLab CI (.gitlab-ci.yml)

> **Nota**: Os exemplos abaixo focam no ecossistema Python (usando `pip` e `python:3.11`). Adapte as imagens e os scripts (`npm test`, `go test`) dependendo do ecossistema do seu app.

### Stages Obrigatórios
```yaml
stages:
  - test
  - verify
  - security
  - deploy
```

### Variáveis Obrigatórias
```yaml
variables:
  TZ: "/usr/share/zoneinfo/America/Sao_Paulo"
  DOCKER_REPO: gcr.io/magalu-cicd/{APPNAME}
  ARGOCD_NAMESPACE: cicd/{PATH_IMAGE_ARGOCD}
  PROJECT_NAME: {APPNAME}
  DEPLOY_TAG: ${CI_COMMIT_SHORT_SHA}
  SONAR_URL: ${STAGE_SONAR_URL}
  SONAR_TOKEN: ${STAGE_SONAR_TOKEN}
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip" // Adiciona cache para pip, adaptável para outros gerenciadores de pacotes (npm, go mod)
```

### Job: Security Scanner
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
      - main # Branch principal
```

### Job: Unit Tests & Coverage
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

### Job: Quality Scanner (SonarQube)
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
      -Dsonar.projectKey={APPNAME}
  allow_failure: true
  only:
    refs:
      - staging
```

### Job: Deploy Staging
```yaml
deploy-staging:
  stage: deploy
  image: $CIKNIFE_IMAGE
  tags:
    - global-docker-tls
  services:
    - docker:26-dind
  variables:
    ARGOCD_PREFIX_PATH: {ARGO_PREFIX_PATH}
    ARGOCD_SERVER: {ARGOCD_SERVER}
  script:
    - ci-knife argocd-deploy --branch main --docker-image --no-msg -pp ${ARGOCD_PREFIX_PATH} --sync ${ARGOCD_SERVER}
  allow_failure: false
  only:
    refs:
      - staging
```
