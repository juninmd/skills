---
name: sdd-new-feature
description: Workflow completo para criar uma nova funcionalidade usando Spec-Driven Development (SDD).
---

# SDD: Nova Feature

Siga estes passos para criar uma nova feature usando Spec-Driven Development.

## Pré-requisitos

// turbo
1. Leia a constitution do projeto para entender os princípios:
```bash
cat .specify/memory/constitution.md
```

## Fase 1: Especificação

2. Inicialize a estrutura da spec usando o script de automação:
```bash
bash .specify/scripts/init-spec.sh <NOME-DA-FEATURE>
```

3. Abra o arquivo `.specify/specs/<NOME-DA-FEATURE>/spec.md` e preencha:
   - **Header**: nome, tipo, plataformas, descrição
   - **User Scenarios**: pelo menos 1x P1, com formato Gherkin (Given/When/Then)
   - **Requirements**: funcionais (FR-001, FR-002...) e não-funcionais
   - **Success Criteria**: critérios mensuráveis
   - **Out of Scope**: o que NÃO está incluído
   - Marque itens incertos com `[NEEDS CLARIFICATION]`

4. Revise a spec e resolva todos os `[NEEDS CLARIFICATION]` antes de prosseguir.

## Fase 2: Planejamento

5. Abra `.specify/specs/<NOME-DA-FEATURE>/plan.md` e preencha:
   - **Summary**: decisões técnicas e abordagem
   - **Technical Context**: stack, dependências, constraints
   - **Architecture**: estrutura do projeto, design patterns
   - **Constitution Check**: valide contra os 5 princípios
   - **Testing Strategy**: unit, integration, E2E
   - **Risks & Mitigations**: riscos identificados

6. Valide o plan contra a constitution:
   - O componente é standalone e reutilizável? (Princípio 1)
   - Funciona em múltiplos agents/plataformas? (Princípio 2)
   - A spec foi escrita antes do código? (Princípio 3)
   - Documentação está em Markdown? (Princípio 4)
   - Testes estão planejados? (Princípio 5)

## Fase 3: Breakdown de Tasks

7. Abra `.specify/specs/<NOME-DA-FEATURE>/tasks.md` e crie o breakdown:
   - **Phase 1 (Foundation)**: setup, types, infra base
   - **Phase 2 (P1)**: user stories primárias
   - **Phase 3 (P2+)**: features secundárias e polish
   - **Phase 4 (Review)**: code review e merge
   - Marque tasks paralelizáveis com `[P]`
   - Defina dependências entre tasks

## Fase 4: Implementação

8. Crie a branch da feature:
```bash
git checkout -b feature/<NOME-DA-FEATURE>
```

9. Implemente cada task sequencialmente. Após cada task:

// turbo
```bash
pnpm test:run
```

10. Faça commit após cada task completada:
```bash
git add .
git commit -m "[TASK-XXX] Descrição breve do que foi implementado"
```

## Fase 5: Validação

// turbo
11. Rode a validação completa da spec:
```bash
bash .specify/scripts/validate-spec.sh <NOME-DA-FEATURE>
```

// turbo
12. Execute a suíte completa de validação:
```bash
pnpm test:run && pnpm docs:build && pnpm lint:md
```

// turbo
13. Regenere o catálogo:
```bash
node src/loader.js
```

## Fase 6: Review & Merge

14. Faça push e crie o Merge Request:
```bash
git push origin feature/<NOME-DA-FEATURE>
```

15. No MR, inclua:
   - Link para a spec: `.specify/specs/<NOME-DA-FEATURE>/spec.md`
   - Checklist de compliance com a constitution
   - Resultados dos testes
