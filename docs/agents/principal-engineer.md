# Principal Engineer

**File:** `.agents/agents/principal-engineer.agent.md`

Architect-level guidance for system design, technology selection, ADR writing, and technical debt strategy. Not for implementation — for decisions.

## When to Invoke

- Designing a new system or major feature
- Selecting a technology or framework
- Writing Architecture Decision Records (ADRs)
- Planning technical debt paydown
- Evaluating scalability and performance architecture
- Getting a second opinion on a design

## Invoke

```
/principal-engineer
```

## Capabilities

### System Architecture
- Distributed system design (microservices, monolith, modular monolith)
- Service boundaries and domain modeling
- Data flow and state management patterns
- API design (REST, GraphQL, gRPC)
- Event-driven and message-queue architecture

### Design Patterns
- GoF patterns applied to real problems
- Clean Architecture, Hexagonal, CQRS, Event Sourcing
- Pattern trade-offs with explicit pros/cons
- Anti-pattern detection and refactoring paths

### Architecture Decision Records (ADRs)
Produces structured ADRs:
```
# ADR-001: Use PostgreSQL over MongoDB

## Status: Accepted

## Context
...

## Decision
...

## Consequences
...
```

### Technology Evaluation
- Framework and library selection with justification
- Build vs. buy analysis
- Migration path planning
- Compatibility and ecosystem maturity assessment

### Technical Debt Strategy
- Debt categorization (intentional vs. accidental)
- Paydown prioritization by risk × impact
- Incremental refactoring plans
- Team enablement and documentation

### Risk Assessment
- Likelihood × impact matrix
- Mitigation strategies
- Monitoring and observability requirements

## What This Agent Does NOT Do

- Write production code (use the assistant directly or delegate to a skill)
- Line-by-line code review (use `code-reviewer`)
- Infrastructure configuration (use `devops-engineer`)

## Output Format

Delivers one or more of:
- Architecture diagrams (Mermaid)
- Trade-off tables
- ADR documents
- Risk registers
- Technology comparison matrices
- Migration roadmaps
