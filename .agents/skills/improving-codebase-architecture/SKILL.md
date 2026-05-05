---
name: improving-codebase-architecture
description: "Find practical architecture improvements that make code easier to test, change, and navigate. Triggers: architecture improvement, refactor architecture, module boundaries, coupling, testability, technical debt."
argument-hint: "[area/module/feature]"
---

# Improving Codebase Architecture

Use this skill to find architecture changes that reduce real friction. The output should be a ranked set of practical opportunities, not a generic refactor wishlist.

## Vocabulary

- **Module:** A function, class, package, route, service, or slice with callers and behavior.
- **Interface:** Everything callers must understand: inputs, outputs, invariants, errors, ordering, configuration, and side effects.
- **Implementation:** The hidden work behind the interface.
- **Depth:** How much useful behavior is hidden behind a small interface.
- **Change surface:** The number of places that must change when one concept changes.
- **Test surface:** The public place where behavior can be verified without coupling tests to internals.

## Workflow

### 1. Read the local language first
Before proposing architecture changes, inspect the nearest project documentation:

- `AGENTS.md`, `README.md`, and relevant package docs.
- `CONTEXT.md` or `CONTEXT-MAP.md` when present.
- `docs/adr/` or local ADR folders when present.
- Existing tests around the target area.

Use the project's domain terms in recommendations. If no domain glossary exists, infer terms from user-facing names, routes, schemas, and tests.

### 2. Explore for friction
Look for evidence that maintainers pay too much cost for small changes:

- Understanding one behavior requires jumping through many thin wrappers.
- Callers know too much about ordering, setup, flags, or internal shape.
- Tests target private helpers because public behavior is hard to reach.
- One business rule is duplicated across handlers, UI, jobs, and tests.
- A module's interface is almost as complex as its implementation.
- A dependency is mocked everywhere because no stable boundary exists.
- Error handling, validation, or observability is scattered across callers.

Apply the deletion question: if this module disappeared, would complexity vanish, or would it reappear across several callers? If it only vanishes, the module may be a pass-through. If it would spread, the module is likely carrying useful depth.

### 3. Rank opportunities
Present candidates with concrete evidence:

- **Files:** The main files or modules involved.
- **Friction:** What makes the current design hard to change, test, or understand.
- **Proposal:** What boundary, interface, or ownership change would improve it.
- **Payoff:** How locality, testability, and future changes improve.
- **Risk:** What could break and what verification would reduce that risk.

Avoid proposing new abstractions before explaining the observed friction. Prefer fewer, higher-confidence candidates.

### 4. Design the selected change
When the user chooses an opportunity:

- Define the public interface first.
- Identify which callers should become simpler.
- Decide what behavior moves behind the module.
- Define tests at the new interface.
- Keep migration incremental and reversible.

Only create an ADR when the decision is hard to reverse, surprising without context, and based on a real trade-off.

## Checklist

- [ ] Recommendations are grounded in files, tests, or observed maintenance friction.
- [ ] The proposed interface reduces caller knowledge instead of moving complexity around.
- [ ] The testing strategy verifies behavior through the new public surface.
- [ ] Existing ADRs or documented domain terms were respected or explicitly challenged.
- [ ] The user gets ranked options before implementation begins.

## References

- [Workspace Agent Conventions](../../../AGENTS.md)
- [Code Design Principles Rule](../../rules/code-design-principles.instructions.md)
- [Applying Design Principles Skill](../applying-design-principles/SKILL.md)
