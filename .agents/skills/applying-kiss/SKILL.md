---
name: applying-kiss
description: Habilidade para aplicar o princípio Keep It Simple, Stupid (KISS). Use quando o código for excessivamente complexo, sobre-projetado ou difícil de entender.
argument-hint: "[file/module] [options]"
---

# Applying KISS (Keep It Simple, Stupid)

## Concept
Systems work best if they are kept simple rather than made complicated. Simplicity should be a key goal in design, and unnecessary complexity should be avoided.

## Guidelines
1. **Avoid Over-Engineering**: Don't build for complex use cases that might never happen.
2. **Simple Logic**: Prefer straightforward logic over complex, "clever" one-liners or deep nesting.
3. **Familiar Patterns**: Use well-known design patterns and language idioms instead of creating custom, complex solutions for solved problems.
4. **Readability First**: Code must be easy to read and understand by a junior developer.

## Execution
- Replace complex code with a simpler, more naive approach if it achieves the same result and performance is acceptable.
- Flatten deeply nested loops or conditionals using early returns (guard clauses).
- Remove unused "flexible" parameters that only have one actual usage.
