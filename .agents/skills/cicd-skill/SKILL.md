---
name: cicd-deploy
description: Gerenciamento de pipelines GitLab CI, integração com SonarQube e deploys automatizados via ArgoCD.
metadata:
  metadata:
    works_on: [vscode, antigravity, gemini_cli]

---

# CI/CD & Deploy

Esta skill orquestra o ciclo de vida de deploy e qualidade contínua.

## Instructions
- Siga o fluxo de deploy autônomo (HML) com self-healing.
- Utilize as variáveis de ambiente padrão (`TZ`, `DOCKER_REPO`).