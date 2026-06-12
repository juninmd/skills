---
name: validating-typescript
description: "TypeScript Validation for Hardening type, Implementing complex, Standardizing code via tsc --noEmit."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Node.js, Browser, TypeScript 5+"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# TypeScript Validation

Expert guide for ensuring production-ready TypeScript code using strict checks and testing.

**USE FOR:**
- Hardening type safety with strict compiler options.
- Implementing complex types (mapped/conditional).
- Standardizing code quality with Biome.
- Verifying algorithms with Vitest and AAA.
- Configuring fast CI/CD with SWC.

**INVOKES:**
- `tsc --noEmit`, `biome check`, `vitest run`.

## Methodology
Implementation details are in:
1. [Safety/Config](references/ts-safety.md) | [Advanced Types](references/ts-patterns.md)
2. [Quality/CI](references/ts-quality.md) | [Testing](references/ts-testing.md) | [Optimization](references/ts-troubleshooting.md)

## Core Principles
1. **Strict:** Enable all strict compiler checks.
2. **Proven:** Algorithms must have automated tests.
3. **Purity:** Avoid `any` and `@ts-ignore`.

## Development Standards
1. **Type Safety:**
   - **No `any`:** The use of `any` is strictly prohibited. Use `unknown` if the type is truly not known ahead of time, and use type guards to narrow it down.
   - **Explicit Returns:** Always declare return types for functions and methods to prevent unintended return values.
   - **Strict Null Checks:** Always handle `null` and `undefined` explicitly. Use optional chaining (`?.`) and nullish coalescing (`??`).
2. **Type Declarations:**
   - **Interfaces over Types:** Prefer `interface` for object shapes as they are more extensible. Use `type` for unions, intersections, and utility types.
   - **Enums:** Avoid `enum`; prefer union types (e.g., `type Status = 'open' | 'closed'`) or constant objects (`as const`).
3. **General Practices:**
   - Prefer `readonly` for properties that should not be mutated.
   - Ensure all parameters in public APIs are typed.

## Checklist
- [ ] Confirm `strict` and `noUncheckedIndexedAccess` in tsconfig.
- [ ] Zero `any` usage; use `unknown` and type guards.
- [ ] Order function overloads specific to general.
- [ ] Logic has ≥ 80% test coverage with Vitest.
- [ ] Run `biome check --write` for style and smells.
