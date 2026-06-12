---
name: test-driven-development
description: "Test-Driven Development for Implementing new, Securing risky, Performing vertical via vitest."
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

## The Verification Ladder
Before declaring a task "done", climb the ladder:
1. **Compile/Lint:** Builds and lints clean.
2. **Unit:** Scoped tests pass, exit 0.
3. **Integration:** Cross-module/DB contracts hold.
4. **Smoke/Run:** Launch the real app; exercise critical paths.
5. **Evidence:** Capture reproducible proof (logs/output).

## Reproduce-Before-Fix
For bug fixes: Capture the failure (RED) → Change one thing → Re-run the same check (GREEN) → Confirm it now passes. A fix with no prior red state is unfalsifiable.

## Checklist
- [ ] Choose exactly one small vertical slice to implement next.
- [ ] Verify the test fails for the correct reason before starting implementation.
- [ ] Implement only the minimal logic needed to reach a green state.
- [ ] Refactor and clean up only after the current behavior is proven green.
- [ ] Run the full suite of relevant tests before finalizing the slice.
- [ ] Validate test robustness with mutation testing; ensure >80% mutation kill rate.
- [ ] Use property-based tests for complex logic to discover edge cases automatically.
