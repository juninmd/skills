---
name: ci-knife-ops
description: O canivete suíço oficial de CI/CD do Luizalabs para deploys, releases, validações e segurança seguindo o padrão Sênior.
---

# CI Knife Operations Sênior

Esta skill encapsula os comandos da ferramenta `ci-knife`, o padrão de ouro para automação de pipeline, gestão de releases e segurança (Atena) na Luizalabs.

## When to use this skill
- Durante o fluxo de CI/CD para realizar deploys em ambientes de HML ou PROD.
- Ao realizar releases (Semantic Versioning) e gerar GMUDs automáticas.
- Para executar scans de segurança (Atena) e validar Quality Gates.
- Sempre que houver necessidade de automação que envolva ArgoCD, GitLab ou GCR.

## How to use it
O agente deve priorizar o `ci-knife` sobre scripts manuais. Utilize os subcomandos específicos para cada etapa do pipeline (security, test, deploy).

## Instructions
1.  **Prefer Tooling:** NUNCA use scripts manuais para deploys se o `ci-knife` puder realizar a tarefa. A padronização é essencial para a escala Magalu.
2.  **Security First:** O comando `security-scanner` (Atena) é obrigatório nos pipelines de `main` e `staging`. Analise os reports gerados.
3.  **ArgoCD Sync:** Utilize `argocd-deploy` para sincronizar aplicações. Garanta que a tag da imagem (`DEPLOY_TAG`) seja baseada no commit SHA.
4.  **Semantic Release:** Para gerar novas versões, utilize `create-release`. Isso garante changelogs consistentes e rastreabilidade (Kaizen).
5.  **Quality Gate:** Use `sonar-scanner` integrado ao `ci-knife` para garantir que as métricas de qualidade sejam publicadas corretamente.

## Resources
- [Luizalabs CI/CD Protocol](../../agents.md#L318)
- `references/REFERENCE.md`: Guia completo de comandos e variáveis de ambiente.
a `ci-knife` para automação de pipeline e release.

## Capabilities
- **Deploy:** `argocd-deploy`, `gcs-deploy`, `mgc-bucket-deploy`.
- **Release:** `create-release` (Semantic Versioning), `create-gmud`.
- **Quality:** `sonar-scanner`, `mr-sla`, `lint`.

## Instructions
- Utilize `ci-knife create-release` para gerar tags e changelogs automáticos.
- Para deploys em Kubernetes, use `argocd-deploy` com as flags de imagem Docker.
- Verifique SLAs de MR com `mr-sla`.

## Resources
- `references/REFERENCE.md`: Guia completo de comandos e variáveis de ambiente.
