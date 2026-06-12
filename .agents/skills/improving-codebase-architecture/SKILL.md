---
name: improving-codebase-architecture
description: "Improving Codebase Architecture for Finding and, Redefining module, Designing deep via Codebase mapping, dependency analysis, and ADR drafting."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace]
---

# Improving Codebase Architecture

Expert methodology for identifying and resolving architectural friction to make code easier to test, change, and navigate through better module boundaries and deeper interfaces.

**USE FOR:**
- Finding and ranking practical architecture improvements based on maintenance cost.
- Redefining module boundaries to reduce the "change surface" of the system.
- Designing deep interfaces that hide complexity from callers.
- Decoupling tests from internal implementation details.
- Documenting significant architectural decisions via ADRs.

**DO NOT USE FOR:**
- Applying local code-smell fixes (use `applying-design-principles`).
- Proposing generic refactors without evidence of real friction.

**INVOKES:**
- Codebase mapping, dependency analysis, and ADR drafting.

## Methodology and Guidelines
Implementation details for discovery, vocabulary, and ranking are documented in:
1. [Architecture Vocabulary & Ranking](references/architecture-vocabulary.md)
2. [Discovery & Design Workflow](references/architecture-workflow.md)

## Core Principles
1. **Evidence-First:** Proposals must be grounded in observed maintenance friction or testing difficulty.
2. **Depth over Breadth:** Prefer a few high-confidence changes that significantly simplify the system.
3. **Incrementalism:** Keep architectural shifts reversible and testable at every step.

## Checklist
- [ ] Ground recommendations in existing files, tests, and ADRs.
- [ ] Ensure the proposed interface reduces the knowledge required by callers.
- [ ] Verify the testing strategy targets the new public surface.
- [ ] Provide the user with ranked options before initiating implementation.
