# Validation Checklist Template

> Checklist de validação para a feature: **init-padrao-labs**
> Spec: `.specify/specs/init-padrao-labs/spec.md`

## Constitution Compliance

- [ ] **Skill-First Architecture**: Componente é standalone e reutilizável
- [ ] **Multi-Agent Compatibility**: Funciona em todas as plataformas declaradas
- [ ] **Specification-First**: Spec foi escrita antes do código
- [ ] **Markdown-First**: Documentação em Markdown com frontmatter válido
- [ ] **Test-Before-Merge**: Testes escritos e passando

## Acceptance Criteria

> Copie os acceptance criteria da spec e verifique cada um:

- [ ] **P1 - Cenário 1**: [Descrever o cenário testado]
- [ ] **P1 - Cenário 2**: [Descrever o cenário testado]
- [ ] **P2 - Cenário 1**: [Descrever o cenário testado]

## Qualidade de Código

- [ ] Testes unitários presentes e passando
- [ ] Testes de integração presentes (se aplicável)
- [ ] Coverage ≥ 80% (idealmente ≥ 90%)
- [ ] Sem erros de lint: `pnpm lint:md`
- [ ] Build sem erros: `pnpm docs:build`
- [ ] Catálogo atualizado: `node src/loader.js`

## Documentação

- [ ] SKILL.md / documentação principal criada
- [ ] Exemplos de uso incluídos
- [ ] Frontmatter metadata completo (name, description, works_on, tags)
- [ ] README atualizado (se necessário)

## Segurança

- [ ] Sem secrets hardcoded no código
- [ ] Inputs do usuário são validados/sanitizados
- [ ] Dependências auditadas (`pnpm audit`)

## Performance

- [ ] Bundle size dentro dos limites (< 5MB)
- [ ] Sem dependências desnecessárias

## Edge Cases

- [ ] Comportamento com input inválido testado
- [ ] Comportamento com serviço indisponível testado
- [ ] Limites de input (máximo/mínimo) testados

## Aprovação

- **Revisado por**: [Nome do revisor]
- **Data**: [Data da revisão]
- **Decisão**: `aprovado` | `aprovado com ressalvas` | `requer revisão`
- **Observações**: [Notas adicionais]
