---
name: applying-yagni
description: Ability to apply the You Aren't Gonna Need It (YAGNI) principle. Use when the code contains features, abstractions, or flexibility added "just in case" that are not currently used.
argument-hint: "[file/module] [options]"
---

# Applying YAGNI (You Aren't Gonna Need It)

## Concept
Implement only what is necessary now. Code created "just in case" increases complexity, maintenance cost, and testing effort without generating immediate value.

## Guidelines
1. **Remove Unused Code:** Delete classes, methods, and parameters with no actual use in the system.
2. **Avoid "Future-Proofing":** Do not create abstract interfaces or complex configurations for non-existent requirements.
3. **Focus on the Present:** Implement exactly what the current requirement asks for, nothing more.

## Execution
- Identify code written for future features that have not yet materialized.
- Remove "just-in-case" logic flows and error handling that cannot occur in the application's current state.
- Simplify interfaces with a single implementation, unless abstraction is required by an external boundary.

