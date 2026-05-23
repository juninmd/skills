---
name: validating-typescript
description: |
  **DEVELOPMENT SKILL** - Validate TypeScript code quality, safety, and correctness.
  USE FOR: type safety, tsconfig, advanced types, Biome linting, Vitest algorithms, strict-mode.
  DO NOT USE FOR: non-TS JS (without migration), pure CSS/HTML, non-TS backends.
  INVOKES: tsc, biome, vitest.
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

## Checklist
- [ ] Confirm `strict` and `noUncheckedIndexedAccess` in tsconfig.
- [ ] Zero `any` usage; use `unknown` and type guards.
- [ ] Order function overloads specific to general.
- [ ] Logic has ≥ 80% test coverage with Vitest.
- [ ] Run `biome check --write` for style and smells.
