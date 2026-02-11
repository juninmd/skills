# CI Knife Environment Variables

| Variável | Descrição | Obrigatório |
| :--- | :--- | :--- |
| `CIKNIFE_IMAGE` | Imagem Docker padrão (ex: `gcr.io/magalu-cicd/ci-knife:v1.10.2`) | Sim |
| `GIT_API_TOKEN` | Token de acesso ao GitLab | Sim (para release/mr) |
| `GCHAT_DEPLOY_WEBHOOK` | Webhook para notificações de deploy | Opcional |
| `SONAR_URL` | URL do SonarQube | Sim |
| `SONAR_TOKEN` | Token de login do SonarQube | Sim |
| `DOCKER_REPO` | Repositório de imagens (ex: `gcr.io/magalu-cicd/meu-app`) | Sim (para deploy) |
| `ARGOCD_SERVER` | Endereço do ArgoCD (ex: `argocd-hml.ipet.sh`) | Sim (para sync) |
