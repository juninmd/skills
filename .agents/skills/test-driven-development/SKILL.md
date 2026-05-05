---
name: test-driven-development
description: "Behavior-first development with red/green/refactor cycles and vertical slices. Triggers: TDD, test-first, red green refactor, regression test, acceptance criteria."
argument-hint: "[feature/bug/module]"
---

# Test-Driven Development

Use this skill when the user wants test-first implementation or when a change is risky enough that behavior should be specified before code.

## Principles

- Tests describe observable behavior through public interfaces.
- A useful test should survive internal refactors.
- Prefer integration-style checks around real code paths over tests that mirror private structure.
- Mock only unstable boundaries such as network, time, filesystem, randomness, or paid/external services.
- Do not write a batch of imagined tests before the first implementation path exists.

## Workflow

### 1. Choose one vertical slice
Pick the smallest end-to-end behavior that can be demonstrated or falsified. A slice should cross the necessary layers instead of finishing one layer in isolation.

Before editing, identify:

- Public interface or user action being exercised.
- Behavior to prove.
- Existing test style and helper patterns.
- Minimal command that runs the affected tests.

### 2. Red
Write one failing test for one behavior. The assertion should name the outcome a user or caller cares about, not an internal implementation detail.

Good targets:

- Returned value or rendered UI state.
- HTTP status/body through a route handler.
- CLI exit code and output.
- Persisted behavior through the public repository/service API.
- Published event or side effect at an explicit boundary.

### 3. Green
Write the smallest implementation that makes the current test pass. Avoid anticipatory options, generalization, and extra edge cases not yet represented by behavior.

### 4. Refactor
Only refactor while tests are green. Keep the public behavior stable, then re-run the focused command after each meaningful cleanup.

Look for:

- Duplicate setup that hides intent.
- Awkward interface shape revealed by the test.
- Complex logic that belongs behind a smaller public surface.
- Test helpers that improve readability without hiding assertions.

### 5. Repeat
Add the next behavior only after the current slice is green and readable. Continue until the acceptance criteria are covered by behavior tests.

## Anti-Patterns

- Writing all tests first, then all implementation.
- Testing private functions because they are easier to reach.
- Mocking internal collaborators that should be exercised together.
- Encoding current object shapes instead of user-visible behavior.
- Keeping a test that passes even when the feature is broken.

## Checklist

- [ ] Each test describes behavior through a public interface.
- [ ] Only one new behavior is added per red/green cycle.
- [ ] Implementation is minimal for the current failing test.
- [ ] Refactoring happens only after tests are green.
- [ ] The final focused test command was run and passed.

## References

- [Workspace Agent Conventions](../../../AGENTS.md)
- [Testing Rule](../../rules/testing.instructions.md)
- [Vitest Skill](../vitest/SKILL.md)
