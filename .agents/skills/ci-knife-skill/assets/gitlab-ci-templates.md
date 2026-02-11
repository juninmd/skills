# GitLab CI Templates (CI Knife)

## 1. Commitlint
```yaml
commitlint:
  image: $CIKNIFE_IMAGE
  stage: test
  script: ci-knife commitlint
```

## 2. MR SLA Check
```yaml
mr-sla:
  image: $CIKNIFE_IMAGE
  stage: test
  script: ci-knife mr-sla
  when: manual
  only:
    - merge_requests
```

## 3. Sonar Scanner (Staging)
```yaml
sonar staging:
  image: $CIKNIFE_IMAGE
  variables:
    SONAR_ANALYSIS_MODE: "publish"
  rules:
    - if: $CI_MERGE_REQUEST_IID
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script:
    - ci-knife sonar-scanner --generate-report
  stage: report
```

## 4. Deploy ArgoCD
```yaml
deploy:
  image: $CIKNIFE_IMAGE
  tags:
    - global-docker-tls
  services:
    - docker:26-dind
  script: ci-knife argocd-deploy
```
