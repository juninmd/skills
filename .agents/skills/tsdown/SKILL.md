---
name: tsdown
description: |
  **BUNDLER SKILL** - Fast library bundling using Rolldown and Oxc.
  USE FOR: building libraries, generating .d.ts files, multi-format bundling, standalone executables, tsup migration.
  DO NOT USE FOR: application bundling (use vite), non-JS/TS, legacy Rollup.
  INVOKES: tsdown cli, rolldown, oxc.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Node.js"
allowed-tools: [run_shell_command, read_file, write_file]
---

# tsdown - Library Bundler

Expert guide for building high-performance TS/JS libraries using tsdown.

**USE FOR:**
- Creating optimized library bundles for npm.
- Generating TypeScript declaration files automatically.
- Bundling for multiple environments (Node, Browser).
- Building cross-platform standalone executables.
- Migrating from tsup with minimal friction.

**INVOKES:**
- `tsdown`, `tsdown-migrate`.

## Methodology
Implementation details are in:
1. [Build & Deps](references/tsdown-build.md) | [Patterns](references/tsdown-patterns.md) | [CLI](references/tsdown-cli.md)
2. [Complete Topic Map](references/TOPIC_MAP.md)

## Core Principles
1. **Speed:** Leverage Oxc and Rolldown for instant builds.
2. **Types:** Always provide `.d.ts` files for consumers.
3. **Externals:** Never bundle peer dependencies.

## Checklist
- [ ] Define entry points and formats in `tsdown.config.ts`.
- [ ] Externalize runtime dependencies via `neverBundle`.
- [ ] Verify that declaration files match the public API.
- [ ] Validate the package using `publint` and `attw`.
