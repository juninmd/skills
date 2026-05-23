# Node.js Environment and Stack

Guidelines for setting up a modern Node.js 24+ development environment.

## 1. Recommended 2026 Stack
- **Runtime:** Node.js 24 LTS.
- **Package Manager:** **pnpm** (preferred for speed and efficiency).
- **Core Tooling:** TypeScript (strict), **Biome** (linting/formatting), Vitest.
- **Compiler/Bundler:** **SWC** and **Vite 8**.
- **Monorepo:** Turborepo or Nx.

## 2. Package Manager Strategy
- **Standard:** Use `pnpm` for all new projects.
- **Legacy:** Use `npm` if `package-lock.json` exists; plan a migration to `pnpm`.
- **Validation:** Always check for lockfiles (`pnpm-lock.yaml` vs `package-lock.json`) before executing commands.
- **Tool Execution:** Use `pnpm dlx` or `npx` for temporary tools.
