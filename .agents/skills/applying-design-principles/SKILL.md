---
name: applying-design-principles
description: |
  **REFACTORING SKILL** - Apply Clean Code, SOLID, DRY, KISS, and YAGNI principles to code.
  USE FOR: refactoring code, fixing code smells, reducing duplication, improving naming, applying SOLID.
  DO NOT USE FOR: fixing bugs (use diagnosing-bugs), architecture restructuring, performance optimization.
  INVOKES: file reading and editing tools.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, replace, write_file]
---

# Applying Design Principles

Systematically evaluate and refactor code using established software design principles to improve maintainability and readability.

**USE FOR:**
- Refactoring complex or messy code to follow Clean Code standards.
- Eliminating duplication using the DRY (Don't Repeat Yourself) principle.
- Simplifying over-engineered logic using KISS and YAGNI.
- Re-architecting classes and interfaces to follow SOLID principles.
- Improving variable, function, and class naming for better intent disclosure.

**DO NOT USE FOR:**
- Fixing behavioral bugs or runtime errors (use `diagnosing-bugs`).
- Large-scale architecture migrations (use `improving-codebase-architecture`).
- Performance tuning or low-level optimizations.

**INVOKES:**
- File reading tools to inspect code, editing tools to apply refactors.

## Core Principles
Implementation details for each principle are documented in:
- [Design Principles Reference](references/design-principles.md)

## Execution
1. Review the targeted file or module.
2. Identify violations of Clean Code, DRY, KISS, SOLID, or YAGNI.
3. Apply behavior-preserving refactors using appropriate principles.
4. Verify changes with available tests.

## Checklist
- [ ] Identify the smallest design problem worth fixing before touching code.
- [ ] Keep refactors behavior-preserving.
- [ ] Re-run tests or validation after each meaningful refactor.
