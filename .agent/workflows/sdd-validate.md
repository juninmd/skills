---
name: sdd-validate
description: Workflow de validação pré-merge para garantir compliance SDD e constitution
---

# SDD: Validação Pré-Merge

Execute este workflow antes de criar um Merge Request para garantir que tudo está em conformidade.

## 1. Validar Specs

// turbo
1. Rode o validador de specs:
```bash
bash .specify/scripts/validate-spec.sh
```

Este script verifica:
- Seções obrigatórias preenchidas (Header, User Scenarios, Requirements, Success Criteria)
- Nenhum `[NEEDS CLARIFICATION]` em specs com status `approved` ou `implemented`
- Status do header é válido
- Acceptance criteria usam formato Gherkin

## 2. Rodar Testes

// turbo
2. Execute a suíte completa de testes:
```bash
pnpm test:run
```

// turbo
3. Verifique a cobertura de testes:
```bash
pnpm test:coverage
```

A cobertura mínima deve ser ≥ 80% (constitution). O projeto almeja ≥ 90% (vitest.config.ts).

## 3. Validar Build

// turbo
4. Regenere o catálogo para garantir que os novos artefatos sejam indexados:
```bash
node src/loader.js
```

// turbo
5. Faça o build da documentação:
```bash
pnpm docs:build
```

## 4. Lint

// turbo
6. Valide o Markdown:
```bash
pnpm lint:md
```

## 5. Constitution Compliance

7. Valide manualmente os 5 princípios constitucionais:

| Princípio | Verificação | OK? |
|-----------|-------------|-----|
| **Skill-First Architecture** | O componente é standalone e reutilizável? | |
| **Multi-Agent Compatibility** | Funciona em todas as plataformas declaradas? | |
| **Specification-First** | A spec foi escrita ANTES do código? | |
| **Markdown-First** | Toda documentação está em Markdown com frontmatter? | |
| **Test-Before-Merge** | Testes foram escritos e passam? Coverage ≥ 80%? | |

## 6. Status Global

// turbo
8. Verifique o status de todas as specs do projeto:
```bash
bash .specify/scripts/spec-status.sh
```

## 7. Checklist Final

9. Confirme todos os itens antes do merge:
- [ ] Todos os testes passam
- [ ] Build sem erros
- [ ] Markdown lint sem erros
- [ ] Catálogo regenerado
- [ ] Spec completa (sem NEEDS CLARIFICATION)
- [ ] Plan aprovado
- [ ] Constitution compliance verificada
- [ ] Documentação com exemplos
- [ ] Coverage ≥ 80%
