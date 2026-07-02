---
name: applying-clean-code
description: Ability to refactor code following Clean Code practices. Use to improve readability, maintainability, naming conventions, and code structure.
argument-hint: "[file/module] [options]"
---

# Applying Clean Code Practices

## Concept
Code is read much more often than it is written. Clean Code should be simple, readable, and intent-oriented, reducing ambiguity and maintenance costs.

## Guidelines
1. **Meaningful Names:** Use intention-revealing names for variables, functions, and classes. Avoid abbreviations and generic names like `data` and `info`.
2. **Small Functions:** Functions should be short and do one thing. As a guideline, prefer to keep them under 20 lines.
3. **No Magic Numbers:** Replace literals with named constants.
4. **Purposeful Comments:** Do not use comments to explain bad code. Rewrite the code so that it is self-explanatory. Comments should explain *why*, not *what*.
5. **Consistent Formatting:** Ensure consistent indentation and spacing. Group related concepts vertically.

## Execution
- Rename variables and functions to expressive names.
- Extract complex boolean expressions into variables/functions with clear names.
- Remove redundant comments.

