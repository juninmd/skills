# TypeScript Quality and CI Integration

Standards for linting, formatting, and automated quality gates.

## 1. Biome (Standard Tooling)
- **Check & Fix:** `biome check --write .`.
- **Format:** `biome format --write .`.
- **Rules:** No redundant `else` blocks; mandatory async patterns.

## 2. CI/CD Integration
- **Gated Merges:** Every PR must pass `tsc --noEmit`, `biome check`, and `vitest run`.
- **Performance:** Use SWC (`@swc/jest`, `swc-loader`) for transpilation in CI to reduce feedback loops.
- **Incremental:** Enable `incremental: true` in tsconfig to speed up subsequent `tsc` runs.
