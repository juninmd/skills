---
name: software-architecture
description: |
  Improve codebase structure and system design with simple, evidence-based boundaries. Use for modularization, dependency direction, technical debt, distributed systems, Electron architecture, failure modes, and ADRs.
---

# Software Architecture

## Workflow
1. Map the current entry points, dependencies, ownership, runtime boundaries, and change pain.
2. State the invariant or failure the design must improve; collect coupling, test, latency, or incident evidence.
3. Compare the smallest viable options and their migration, operational, and reversibility costs.
4. Protect behavior with characterization tests before moving boundaries.
5. Change one boundary at a time and verify dependency direction, behavior, and deployability.
6. Record an ADR only when the decision has meaningful alternatives or long-lived consequences.

## Reference Routing
- Practical architecture cases: [real-world-cases.md](references/real-world-cases.md)
- Design principles: [design-principles.md](references/design-principles.md)
- Distributed systems: [distributed-architecture.md](references/distributed-architecture.md)
- Electron main/renderer/security: [main-process.md](references/main-process.md), [renderer-patterns.md](references/renderer-patterns.md), [security.md](references/security.md)
- Native integration/performance: [native-performance.md](references/native-performance.md)
- Intake forms and consolidated reference: [FORMS.md](references/FORMS.md), [REFERENCE.md](references/REFERENCE.md)

## Rules
- Prefer fewer, deeper modules over layers that only forward calls.
- Do not introduce a service, queue, cache, or abstraction without a measured problem.
- Distributed designs must define retries, idempotency, ordering, timeout, consistency, and observability.
- Electron renderers must not receive unrestricted Node.js access.

## Checklist
- [ ] Design solves an evidenced problem.
- [ ] Migration is incremental and reversible.
- [ ] Boundaries, failures, and tests are explicit.
