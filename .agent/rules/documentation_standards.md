---
name: documentation-standards
description: Padrões para documentação de projetos (README, Design Docs, GMUD).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Documentation Standards

## README.md
- Deve existir na raiz.
- Deve conter: descrição do app, funcionalidades, arquitetura, modo de uso, variáveis de ambiente, comandos de execução.
- Deve ser atualizado a cada alteração significativa.
- Mantenha sempre um Release Notes atualizado sem deletar informações das versões anteriores.

## Design Docs
- Essencial para o sucesso arquitetural.
- Deve ser criado e aprovado pelo TechLead.
- Serve como referência para novos devs e documentação de requisitos.

## GMUD (Gestão de Mudanças)
- Para toda implementação de app, deverá ser gerada a GMUD.
- Documento vivo com changelog, link do app, testes, sonar, fortify.
- Geração via pipeline CI-Knife (Repositório Documentação).
- Variáveis de ambiente obrigatórias:
  - `GMUD_RISK`: Baixo
  - `GMUD_TESTS`: Testes unitários e testes integrados
  - `GMUD_UNAVAILABILITY`: Não
- **Aprovação Automática**:
  - Nenhuma issue crítica no Snyk.
  - Cobertura >= 90%.
  - Duplicidade < 3%.
  - Ratings A em maintainability, reliability, security, security review.

## Issues no GitLab
- Solicitações de mudança em produção devem ser issues no GitLab seguindo templates.
- Para apps novos, usar label: `Projeto_Novo`.
