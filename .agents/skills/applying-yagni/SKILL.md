---
name: applying-yagni
description: Skill for applying the You Aren't Gonna Need It (YAGNI) principle. Use when the code contains features, abstractions, or flexibility added "just in case" that are not currently used.
argument-hint: "[file/module] [options]"
---

# Applying YAGNI (You Aren't Gonna Need It)

## Concept
Always implement things when you actually need them, never when you just foresee that you need them. Unused code adds complexity, maintenance overhead, and testing burden for zero value.

## Guidelines
1. **Remove Unused Code**: Delete classes, methods, or parameters that are not currently used anywhere in the system.
2. **Avoid "Future-Proofing"**: Don't build abstract interfaces or complex configurations for requirements that do not exist yet.
3. **Focus on the Present**: Implement exactly what is needed for the current requirement, and nothing more.

## Execution
- Identify code that was written to support a future feature that hasn't materialized.
- Delete unused branches of logic or "just-in-case" error handling that cannot occur in the current state of the application.
- Simplify interfaces that only have a single concrete implementation, unless that interface is explicitly required by an external boundary.
