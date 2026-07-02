# Referência: CI Knife Commands 📚
## MR & Quality
- `ci-knife commitlint`: Valida mensagens de commit.
- `ci-knife mr-sla`: Verifica SLA de revisão/fechamento de MRs.
- `ci-knife check-mr-approved`: Valida aprovações mínimas (Code Owners).

## Release & Deploy
- `ci-knife create-release`: Gera TAG, Changelog e publica no NPM.
- `ci-knife create-gmud`: Cria GMUD automaticamente baseada no Changelog.
- `ci-knife argocd-deploy`: Builda imagem e sincroniza com ArgoCD.
  - Flags: `--docker-image`, `--tag`, `--branch`.
- `ci-knife gcs-deploy`: Deploy de estáticos no GCS (Google Storage).
- `ci-knife mgc-bucket-deploy`: Deploy de estáticos no platform Cloud Object Storage.

## Security
- `ci-knife security-scanner`: Envia código para análise no Santuário de SecurityAudit.
- `ci-knife security-result`: Consulta resultado da análise.

## Variáveis Globais Importantes
- `CIKNIFE_IMAGE`: Imagem Docker padrão.
- `GIT_API_TOKEN`: Token de acesso ao GitLab.
- `GCHAT_DEPLOY_WEBHOOK`: Webhook para notificações de deploy.

