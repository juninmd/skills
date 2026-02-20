---
name: sdd-review
description: Workflow para review de spec/plan por agents - análise contra constitution e identificação de gaps
---

# SDD: Review de Spec e Plan

Use este workflow para fazer review de uma especificação ou plano de implementação.

## 1. Leitura da Constitution

// turbo
1. Carregue os princípios constitucionais:
```bash
cat .specify/memory/constitution.md
```

## 2. Análise da Spec

2. Abra e leia a spec da feature:
```bash
cat .specify/specs/<NOME-DA-FEATURE>/spec.md
```

3. Verifique cada uma das seguintes dimensões:

### Completude
- [ ] **Header** preenchido com todos os campos (nome, tipo, branch, status, plataformas)
- [ ] **User Scenarios** tem pelo menos 1 cenário P1
- [ ] **Acceptance Criteria** usa formato Gherkin (Given/When/Then)
- [ ] **Requirements** tem pelo menos 1 FR (funcional) e 1 NFR (não-funcional)
- [ ] **Success Criteria** tem métricas mensuráveis
- [ ] **Out of Scope** define limites claros

### Qualidade
- [ ] Cenários são específicos e testáveis (não vagos)
- [ ] Edge cases estão cobertos (erros, limites, inputs inválidos)
- [ ] Nenhum `[NEEDS CLARIFICATION]` remanescente (se status ≥ `approved`)
- [ ] Entidades e data model estão definidos

### Constitution Compliance
- [ ] Feature é modular e standalone (Princípio 1: Skill-First)
- [ ] Declara `works_on` com plataformas suportadas (Princípio 2: Multi-Agent)
- [ ] Spec escrita antes do código (Princípio 3: Specification-First)
- [ ] Usa Markdown com frontmatter (Princípio 4: Markdown-First)
- [ ] Testes são parte dos acceptance criteria (Princípio 5: Test-Before-Merge)

## 3. Análise do Plan (se existir)

4. Abra e leia o plan:
```bash
cat .specify/specs/<NOME-DA-FEATURE>/plan.md
```

5. Verifique:
- [ ] **Technical Context** é realista (dependências existem, stack compatível)
- [ ] **Architecture** segue os patterns do projeto existente
- [ ] **Data Model** é consistente com a spec
- [ ] **Testing Strategy** cobre unit, integration e edge cases
- [ ] **Constitution Check** foi preenchido
- [ ] **Risks** foram identificados com mitigações

## 4. Gerar Relatório

6. Após a análise, gere um relatório com o seguinte formato:

```markdown
## Review Report: <NOME-DA-FEATURE>

### Status: ✅ Aprovado | ⚠️ Com Ressalvas | ❌ Requer Revisão

### Pontos Fortes
- [O que está bem feito]

### Gaps Encontrados
- [GAP-001] [Descrição do gap] — Severidade: Alta/Média/Baixa
- [GAP-002] [Descrição] — Severidade: ...

### Violações Constitucionais
- [Nenhuma | Lista de violações com justificativa necessária]

### Recomendações
1. [Recomendação acionável]
2. [...]

### Decisão
- [ ] Aprovado para implementação
- [ ] Requer revisão (ver gaps acima)
```
