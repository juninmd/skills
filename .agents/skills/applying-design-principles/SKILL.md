---
name: applying-design-principles
description: "Clean Code, SOLID, DRY, KISS, YAGNI. Triggers: refactor."
argument-hint: "[file/module] [options]"
---

# Applying Design Principles

## Concept
High-quality software is built upon established design principles. By unifying these principles, developers can systematically evaluate and refactor code. This skill covers Clean Code, DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid), SOLID, and YAGNI (You Aren't Gonna Need It).

## Clean Code
Code is read much more often than it is written. It should be simple, readable, and intent-oriented.
1. **Meaningful Names:** Use intention-revealing names for variables, functions, and classes. Avoid abbreviations.
2. **Small Functions:** Functions should be short (ideally under 20 lines) and do one thing.
3. **No Magic Numbers:** Replace literals with named constants.
4. **Purposeful Comments:** Comments should explain *why*, not *what*. Code should be self-explanatory.
5. **Consistent Formatting:** Group related concepts vertically and ensure consistent indentation.

## DRY (Don't Repeat Yourself)
Repeated knowledge increases maintenance costs and the risk of inconsistency.
1. Extract exact or nearly identical duplications into reusable functions or modules.
2. Parameterize small variations instead of copying blocks.
3. Consolidate repeated constants and configurations.
*Caution:* Avoid unifying sections that look similar but represent distinct business rules.

## KISS (Keep It Simple, Stupid)
Simple solutions are easier to maintain, test, and evolve.
1. Avoid over-engineering for hypothetical scenarios.
2. Prefer straightforward logic over "clever" constructs that are hard to maintain.
3. Reduce nesting with guard clauses.
4. Remove unused parameters and unnecessary flexibility.

## SOLID
Five object-oriented design principles to make software understandable, flexible, and maintainable.
1. **Single Responsibility (SRP):** A class should have only one reason to change. (If you use "and" to describe it, extract it).
2. **Open/Closed (OCP):** Open for extension, closed for modification. Use interfaces/abstract classes.
3. **Liskov Substitution (LSP):** Subclasses should be substitutable for their superclasses without breaking the application.
4. **Interface Segregation (ISP):** Split large interfaces into smaller, more specific ones.
5. **Dependency Inversion (DIP):** Depend on abstractions, not concretions. Use Dependency Injection.

## YAGNI (You Aren't Gonna Need It)
Implement only what is necessary now. Future-proofing increases complexity without immediate value.
1. Delete classes, methods, and parameters with no actual use.
2. Do not create abstract interfaces for non-existent requirements.
3. Remove "just-in-case" logic flows.

## Execution
- Review the targeted file or module.
- Identify violations of Clean Code, DRY, KISS, SOLID, or YAGNI.
- Refactor the code applying the appropriate principle.
- Ensure all existing tests pass after refactoring.

## Checklist

- [ ] Identify the smallest design problem worth fixing before touching code.
- [ ] Keep refactors behavior-preserving unless the task explicitly asks for logic changes.
- [ ] Re-run the narrowest available tests or validation after each meaningful refactor.

## References

- [Workspace Agent Conventions](../../../AGENTS.md)
- [Code Design Principles Rule](../../rules/code-design-principles.instructions.md)
