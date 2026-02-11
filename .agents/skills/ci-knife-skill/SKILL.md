---
name: ci-knife-ops
description: Ferramenta suíça de CI/CD do LuizaLabs para deploys, releases, validações de MR e segurança.
---

# CI Knife Operations

Esta skill encapsula os comandos da ferramenta `ci-knife` para automação de pipeline e release.

## Capabilities
- **Deploy:** `argocd-deploy`, `gcs-deploy`, `mgc-bucket-deploy`.
- **Release:** `create-release` (Semantic Versioning), `create-gmud`.
- **Quality:** `sonar-scanner`, `mr-sla`, `lint`.
- **Security:** `security-scanner`.

## Instructions
- Utilize `ci-knife create-release` para gerar tags e changelogs automáticos.
- Para deploys em Kubernetes, use `argocd-deploy` com as flags de imagem Docker.
- Verifique SLAs de MR com `mr-sla`.

## Resources
- `references/REFERENCE.md`: Guia completo de comandos e variáveis de ambiente.
