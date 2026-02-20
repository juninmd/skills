---
name: architecting-pipelines
description: Design, implementação e manutenção de pipelines CI/CD modulares, reutilizáveis e otimizados para alta performance.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# CI/CD Pipeline Architect

Esta skill orienta a criação de pipelines CI/CD que são "Pipeline as Code", modulares e testáveis.

## Instructions
1.  **Templating & Reusability:** Nunca repita definições de jobs. Use `include` (GitLab) ou `workflow_call` (GitHub Actions).
    *   **Reasoning:** Centralizar definições (ex: template de build Java/Node) garante consistência e facilita manutenção em massa.
    *   **Structure:** Crie repositórios de "Golden Templates" (ex: `devops/pipeline-templates`).
2.  **Linting & Validation:** Valide pipelines antes do commit.
    *   **GitLab:** Use `gitlab-ci-lint`.
    *   **GitHub:** Use `actionlint` ou o editor web.
3.  **Matrix Builds:** Teste múltiplas versões/configurações em paralelo.
    *   **Example:** Testar Node 18, 20 e 22 simultaneamente.
4.  **Caching Strategy:** Armazene dependências (`node_modules`, `.m2`, `.gradle`) para acelerar builds subsequentes.
    *   **Key:** Use chaves baseadas em lockfiles (`package-lock.json`).

## Common Tasks
*   **Extract Template:** Mova um job complexo para um arquivo `.yml` separado e use `include: local`.
*   **Optimize Cache:** Configure cache com chaves específicas (`key: ${CI_COMMIT_REF_SLUG}-${CHECKSUM}`) e policy (`pull-push`).
*   **Debug Pipeline:** Use artifacts de falha (reports JUnit, logs) para diagnosticar erros sem re-executar tudo.

## Examples
### Valid GitLab CI Template Usage
```yaml
include:
  - project: 'devops/templates'
    file: '/node/build-and-test.yml'
    ref: 'v2.0.0' # Sempre fixe versões de templates!

variables:
  NODE_VERSION: "20"

build_job:
  extends: .node_build_template
  script:
    - pnpm build
```

### Invalid (Copy-Paste)
```yaml
build_job:
  image: node:latest # Versão não fixada
  script:
    - npm i # Sem cache, lento
    - npm test
# ... repete tudo para outro projeto ...
```

## Resources
- **12-Factor CI/CD:** Build, Release, Run. Separação clara de estágios.
- **Pipeline Efficiency:** Paralelize jobs independentes (ex: Lint e Test Unitário rodam juntos).
