---
name: test-engineering
description: "Comprehensive Test Engineering covering TDD, Vitest, Generative Testing, and Performance Profiling."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Test Engineering & Quality Assurance

Expert methodology for ensuring software reliability through robust testing strategies. This skill unifies Test-Driven Development (TDD), the Vitest framework, negative test scenarios, generative/fuzz testing, and runtime performance profiling.

**USE FOR:**
- Implementing features using the Red/Green/Refactor cycle (TDD).
- Designing unhappy-path tests (boundary values, fault injection, concurrency).
- Authoring unit and integration tests using Vitest.
- Implementing generative and property-based testing.
- Profiling runtime performance (flame graphs, memory, CPU) and preventing regressions.

**DO NOT USE FOR:**
- Contract testing (use `backend-node` or `backend-python`).
- UI component design (use `frontend-engineering`).

**INVOKES:**
- `vitest`, `pytest`, `stryker`, profiling tools.

## Core Principles
1. **Tests Encode Intent:** Tests should assert *why* behavior matters, not just state changes.
2. **Deterministic:** Tests must be reliable; eliminate flaky tests immediately.
3. **Negative Space:** Happy path is insufficient; explicitly test boundaries and failure modes.
4. **Performance is a Feature:** Validate optimization claims with empirical profiling data.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Test-Driven Development (TDD)](references/tdd-best-practices.md)
- [Vitest Framework](references/vitest-guide.md)
- [Engineering Test Scenarios](references/test-scenarios.md)
- [Generative & Property Testing](references/generative-testing.md)
- [Performance Profiling](references/performance-profiling.md)

## Checklist
- [ ] Define success criteria and failure scenarios before writing implementation code.
- [ ] Ensure mocks and side-effects are isolated and restored after each test.
- [ ] Run coverage tools to identify untested boundary conditions.
- [ ] Profile performance before and after optimization attempts to prove impact.
