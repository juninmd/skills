---
name: test-driven-development
description: |
  **STRATEGY SKILL** - Implement features and fixes using the Red/Green/Refactor cycle.
  USE FOR: test-first implementation, TDD workflows, regression testing, defining behavior through tests, vertical slice development.
  DO NOT USE FOR: pure unit testing without implementation (use vitest), non-coding tasks, speed-biased prototyping without verification.
  INVOKES: vitest, pytest, engineering-test-scenarios, generative-testing, verifying-changes, performance-profiling.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Test-Driven Development

Expert methodology for building robust software by specifying behavior through tests before implementing code, ensuring maintainability and reducing regressions.

**USE FOR:**
- Implementing new features with a test-first approach.
- Securing risky changes with concrete behavioral specifications.
- Performing vertical slice development that crosses multiple layers.
- Designing clean interfaces by forcing early "caller-first" thinking.
- Establishing repeatable regression suites for reported bugs.
- Validating test robustness using mutation testing and property-based testing (generative-testing).

**DO NOT USE FOR:**
- Trivial, low-risk changes where tests add no value.
- Exploratory coding where the public interface is not yet stable.

**INVOKES:**
- Project-specific test runners (e.g., `vitest`, `pytest`, `dotnet test`).

## Methodology and Guidelines
Implementation details for the TDD cycle, principles, and anti-patterns are documented in:
- [TDD Principles & Workflow](references/tdd-methodology.md)

## Core Principles
1. **Behavior First:** Tests describe *what* the system does, not *how* it does it.
2. **Minimalism:** Write only the code required to make the current failing test pass.
3. **Refactor Safety:** Ensure the public surface remains stable while cleaning up internals.

## Checklist
- [ ] Choose exactly one small vertical slice to implement next.
- [ ] Verify the test fails for the correct reason before starting implementation.
- [ ] Implement only the minimal logic needed to reach a green state.
- [ ] Refactor and clean up only after the current behavior is proven green.
- [ ] Run the full suite of relevant tests before finalizing the slice.
- [ ] Validate test robustness with mutation testing; ensure >80% mutation kill rate.
- [ ] Use property-based tests for complex logic to discover edge cases automatically.
