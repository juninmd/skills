# Specification Template - Skill

> This template is used to define a new skill, agent, or rule for the Luizalabs catalog.
> Fill in each section thoroughly. Mark uncertain items with `[NEEDS CLARIFICATION]`.

## Header Section

- **Feature Name**: [Name of the skill/agent/rule]
- **Type**: `skill` | `agent` | `rule` | `hook` | `workflow`
- **Branch**: `feature/[descriptive-identifier]`
- **Date**: [date created]
- **Status**: `draft` | `review` | `approved` | `implemented`
- **Spec Version**: 1.0
- **Description**: [Brief 1-2 sentence description]
- **Platforms**: [comma-separated: gemini_cli, copilot, antigravity, claude, cursor, windsurf, cline]

---

## User Scenarios & Testing

> Define priority-based user stories that are independently testable.
> Technology-agnostic - focus on "what" and "why", not "how".

### P1: [Primary User Story Name]

**Narrative**:
- Who is the user?
- What are they trying to achieve?
- Why is this important?

**Independent Testing Approach**:
- How will you verify this works without deploying?
- What manual/automated tests validate this scenario?

**Acceptance Criteria**:
```gherkin
Given [precondition - system state]
When [action - what user or system does]
Then [expected outcome - what happens as a result]
```

### P2: [Secondary User Story Name]

[Same structure as P1]

### Edge Cases

- **Error Scenario 1**: What happens if [invalid input]?
- **Error Scenario 2**: What happens if [system unavailable]?
- **Boundary Case 1**: What is the maximum/minimum [value]?

---

## Requirements

### Functional Requirements

- **FR-001**: [Specific, measurable capability]
  - Definition: [What exactly must it do?]
  - Scope: [What is included/excluded?]

- **FR-002**: [NEEDS CLARIFICATION] [Unclear requirement that needs refinement]
  - Questions: [What needs to be clarified?]

### Non-Functional Requirements

- **Performance**: [Response time, throughput targets]
- **Scalability**: [How many users/requests must it handle?]
- **Security**: [What data must be protected? How?]
- **Accessibility**: [WCAG standards, screen reader support]
- **Compatibility**: [Which versions of platforms must work?]

### Key Entities & Data Model

**Primary Entity: [Entity Name]**
- `attribute_1` (string, required): [Description]
- `attribute_2` (enum: value1, value2): [Description]
- Relationships: [How does this entity relate to others?]

**Secondary Entity: [Entity Name]**
- [Similar structure]

---

## Dependencies & Constraints

### External Dependencies
- **Platform APIs**: [Which external services/APIs are required?]
- **Libraries**: [Required third-party libraries]
- **Services**: [Required backend services]

### Constraints
- **Technical**: [Any technical limitations?]
- **Business**: [Any business constraints?]
- **Legal/Compliance**: [Any regulatory requirements?]

### Assumptions
- [Assumption 1 about system behavior]
- [Assumption 2 about user behavior]

---

## Testing Strategy

> Defina a estratégia de testes já na fase de especificação.

### Testes Unitários
- [Quais funções/componentes devem ter testes unitários?]
- Coverage target: ≥ 80% (idealmente ≥ 90%)

### Testes de Integração
- [Quais fluxos devem ser testados end-to-end?]
- [Abordagem: mocks ou chamadas reais?]

### Testes Manuais
- [Quais cenários precisam de validação manual?]

---

## Contracts

> Defina as interfaces e APIs esperadas para a feature.

### Interface Principal
```typescript
// Defina a interface esperada
interface [FeatureName] {
  // [property]: [type]; // [description]
}
```

### Inputs & Outputs
- **Input**: [Formato e tipo dos dados de entrada]
- **Output**: [Formato e tipo dos dados de saída]
- **Erros**: [Tipos de erro esperados e como são comunicados]

---

## Success Criteria

> Define measurable outcomes that determine if this feature is complete and working.

- **SC-001**: [All P1 user scenarios execute successfully]
- **SC-002**: [Test coverage > 80%]
- **SC-003**: [Documentation complete with examples]
- **SC-004**: [Works on all required platforms (defined in Header)]
- **SC-005**: [Catalog entries generated with proper metadata]
- **SC-006**: [[NEEDS CLARIFICATION] Performance target - what should it be?]

---

## Out of Scope

> Explicitly list what is NOT included in this feature to prevent scope creep.

- [Feature/capability that could be added but isn't in this scope]
- [Integration that might be useful but is handled separately]
- [Future enhancement that's documented but not implemented]

---

## Related Documents

- **Constitution**: See `.specify/memory/constitution.md` for development principles
- **Plan**: Will be created in `.specify/specs/[feature]/plan.md` after approval
- **Tasks**: Will be created in `.specify/specs/[feature]/tasks.md` from the plan
