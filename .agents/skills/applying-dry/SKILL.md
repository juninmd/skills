---
name: applying-dry
description: Habilidade para aplicar o princípio Don't Repeat Yourself (DRY). Use ao identificar duplicação de código, lógica copiada e colada ou padrões repetidos no repositório.
argument-hint: "[file/module] [options]"
---

# Applying DRY (Don't Repeat Yourself)

## Concept
Every piece of knowledge must have a single, unambiguous, authoritative representation within a system. Code duplication leads to maintenance nightmares, as bugs fixed in one place might be missed in another.

## Guidelines
1. **Identify Duplication**: Look for blocks of code that are identical or very similar across different functions or classes.
2. **Extract Reusable Logic**: Move duplicated code into a shared function, method, or class.
3. **Parameterize**: If duplicated code has slight variations, extract it into a function and pass the variations as arguments.
4. **DRY vs. Accidental Duplication**: Ensure the duplicated code actually represents the same knowledge/concept. Sometimes two pieces of code look the same but serve entirely different business purposes. In that case, coupling them is worse than duplication.

## Execution
- Replace duplicated code blocks with a call to a newly created shared function or abstraction.
- Consolidate repeated constants or configuration strings.
