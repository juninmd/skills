---
name: applying-clean-code
description: |
  **CODE QUALITY SKILL** - Apply Clean Code principles to production code.
  USE FOR: naming conventions, function length/complexity, abstraction levels, code reviews, refactoring guidance, identifying technical debt.
  DO NOT USE FOR: performance optimization (use performance-profiling), architectural patterns (use improving-codebase-architecture), testing (use test-driven-development).
  INVOKES: improving-codebase-architecture, auditing-code, test-driven-development, validating-typescript.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Applying Clean Code

Professional guidance for writing code that is readable, maintainable, and minimal. Based on Robert C. Martin's *Clean Code* principles adapted for modern software engineering.

**USE FOR:**
- Evaluating code readability and suggesting concrete naming improvements.
- Identifying functions that violate Single Responsibility Principle (SRP).
- Detecting abstraction levels that mix concerns.
- Reviewing variable/function naming for clarity and discoverability.
- Recognizing overly complex conditional logic and simplification strategies.
- Refactoring to reduce cyclomatic complexity.

**DO NOT USE FOR:**
- Optimizing for performance (use `performance-profiling` skill).
- Designing system architecture (use `improving-codebase-architecture`).
- Writing tests or test strategy (use `test-driven-development`).
- Language-specific idioms and type systems (use language skills).

**INVOKES:**
- `improving-codebase-architecture` for design decisions.
- `auditing-code` for deeper code reviews.
- `test-driven-development` for validation.

## Core Principles

1. **Naming is Hard, So Do It Well**
   - Names reveal intent: avoid `x`, `temp`, `data`; use `userIdFromJWT`, `cachedProductPrice`.
   - Class/Module names should be nouns; method names should be verbs.
   - Avoid disinformation: don't call a List `UserArray` if it's not truly an array.

2. **Small Functions Are Easier to Test and Understand**
   - Ideal function body: 5–20 lines.
   - If a function does more than one thing, break it down.
   - Deep nesting (>2 levels) signals refactoring opportunity.

3. **One Level of Abstraction per Function**
   - Don't mix high-level orchestration with low-level details.
   - Bad: `processOrder()` calls database, then email, then logging.
   - Good: `processOrder()` delegates to `saveOrder()`, `notifyCustomer()`, `logEvent()`.

4. **Use Guard Clauses to Flatten Logic**
   - Avoid deeply nested if/else; use early returns.
   - Bad: `if (valid) { if (hasPermission) { ... } }`.
   - Good: `if (!valid) return; if (!hasPermission) return; ...`.

5. **Comments Are a Failure to Express in Code**
   - Good code is self-documenting.
   - Comments should explain *why*, not *what*.
   - If you need a comment to understand *what* it does, rewrite the code.

6. **Errors Should Be Exceptions, Not Return Codes**
   - Propagate errors cleanly; don't use magic values or tuples.
   - Use strongly-typed error objects.

## Checklist

- [ ] Review each function: does it do one thing only?
- [ ] All function/variable names are self-documenting (no abbreviations, no single-letter vars outside loops).
- [ ] Functions are ≤20 lines; if longer, break into smaller units.
- [ ] Nesting depth ≤2; use guard clauses to flatten.
- [ ] No commented-out code; if dead, delete it.
- [ ] Classes/modules have single responsibility; consider splitting if >200 lines.
- [ ] Avoid side effects in pure functions; data transformations should not mutate input.
- [ ] Error handling is explicit (exceptions, not return codes).
- [ ] Tests validate behavior, not implementation details.
