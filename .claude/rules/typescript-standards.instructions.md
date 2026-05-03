---
name: typescript-standards
description: Strict TypeScript coding standards including type safety, null-safety, and avoiding 'any'.
applyTo: '**/*.ts,**/*.tsx'
paths:
  - "**/*.ts"
  - "**/*.tsx"
trigger: glob
globs: "**/*.ts,**/*.tsx"
---

# Rule: TypeScript Standards

## 1. Type Safety
- **No `any`**: The use of `any` is strictly prohibited. Use `unknown` if the type is truly not known ahead of time, and use type guards to narrow it down.
- **Explicit Returns**: Always declare return types for functions and methods to prevent unintended return values.
- **Strict Null Checks**: Always handle `null` and `undefined` explicitly. Use optional chaining (`?.`) and nullish coalescing (`??`).

## 2. Type Declarations
- **Interfaces over Types**: Prefer `interface` for object shapes as they are more extensible. Use `type` for unions, intersections, and utility types.
- **Enums**: Avoid `enum`; prefer union types (e.g., `type Status = 'open' | 'closed'`) or constant objects (`as const`).

## 3. General Practices
- Prefer `readonly` for properties that should not be mutated.
- Ensure all parameters in public APIs are typed.
