---
name: renovate-ops
description: Gestão de atualização de dependências e automação de PRs com Renovate.
---

# Renovate Operations

Automação de dependências e comentários em Merge Requests.

## Instructions
- Use `ci-knife renovate-comment` para interagir com MRs abertos pelo bot.
- Configure o job no `.gitlab-ci.yml` usando o template padrão.

## Capabilities
- **Dependency Update**: Monitoramento de `package.json`, `requirements.txt`.
- **Auto-Merge**: Configuração de regras para updates de patch/minor seguros.
