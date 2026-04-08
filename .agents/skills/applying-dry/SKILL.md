---
name: applying-dry
description: Apply the DRY principle to eliminate duplication and centralize knowledge in the code.
argument-hint: "[file/module] [options]"
---

# Applying DRY

## Concept
Repeated knowledge increases maintenance costs and the risk of inconsistency.

## Guidelines
1. Identify exact or nearly identical duplications.
2. Extract common logic into a reusable function, method, or module.
3. Parameterize small variations instead of copying blocks.
4. Avoid unifying sections that look the same but represent distinct business rules.

## Execution
- Replace duplications with calls to shared abstractions.
- Consolidate repeated constants and configurations.
