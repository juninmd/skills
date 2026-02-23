---
name: applying-clean-code
description: Skill for refactoring code to follow Clean Code practices. Use to improve readability, maintainability, naming conventions, and structure of the code.
---

# Applying Clean Code Practices

## Concept
Code is read much more often than it is written. Clean code is elegant, simple, and reads like well-written prose. It hides the implementation details and exposes the intention clearly.

## Guidelines
1. **Meaningful Names**: Use intention-revealing names for variables, functions, and classes. Avoid abbreviations and generic names like `data` or `info`.
2. **Small Functions**: Functions should be small and do one thing. They should ideally be shorter than 20 lines.
3. **No Magic Numbers**: Replace literal numbers with named constants.
4. **Comments**: Don't use comments to explain bad code. Rewrite the code to make it self-explanatory. Comments should explain the "why", not the "what".
5. **Formatting**: Ensure consistent indentation and spacing. Group related concepts vertically.

## Execution
- Rename variables/functions to be expressive.
- Extract complex boolean expressions into well-named variables or functions.
- Remove redundant comments.
