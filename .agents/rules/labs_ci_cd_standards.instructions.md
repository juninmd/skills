---
name: labs-ci-cd-standards
description: Standards for continuous integration and code quality (GitLab CI, SonarQube).
applyTo: '**/.gitlab-ci.yml, **/sonar-project.properties, **/*.{py,ts,js,go,java,kt}'
---

Example standards for continuous integration and code quality using GitLab CI and SonarQube. Adapt examples as needed for your project ecosystem (Python, Node.js, Go, etc.).

# Rule: CI/CD Standards

## SonarQube
- A `sonar-project.properties` file at the project root is mandatory.
- It must include:
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

> **Note**: Examples below focus on the Python ecosystem (`pip` and `python:3.13`). Adapt images and scripts (`npm test`, `go test`) to your app stack.

### Required Stages
```yaml
stages:
  - test
  - verify
  - security
  - deploy
```

### Required Variables
```yaml
variables:
  TZ: "/usr/share/zoneinfo/America/Sao_Paulo"
  DOCKER_REPO: gcr.io/magalu-cicd/{APPNAME}
  ARGOCD_NAMESPACE: cicd/{PATH_IMAGE_ARGOCD}
  PROJECT_NAME: {APPNAME}
  DEPLOY_TAG: ${CI_COMMIT_SHORT_SHA}
  SONAR_URL: ${STAGE_SONAR_URL}
  SONAR_TOKEN: ${STAGE_SONAR_TOKEN}
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip" # Pip cache example; adapt for npm/go mod when needed
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
      - main # Main branch
```

### Job: Unit Tests & Coverage
```yaml
unit-tests:
  stage: test
  image: python:3.13
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
