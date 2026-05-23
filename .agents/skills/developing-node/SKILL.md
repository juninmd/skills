---
name: developing-node
description: |
  **DEVELOPMENT SKILL** - Build and manage modern Node.js applications.
  USE FOR: dependency management (pnpm/npm), JS/TS build automation, lockfile reconciliation, pnpm migrations, Biome linting, Vite/SWC configurations.
  DO NOT USE FOR: client-side-only tasks (without build context), non-JS scripting (use developing-python/developing-go).
  INVOKES: pnpm, npm, npx, node, biome.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Node.js 20+"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Node.js Development

Expert methodology for efficient dependency management, JS/TS build automation, and standardizing the 2026 Node.js toolchain.

**USE FOR:**
- Managing project dependencies using `pnpm` or `npm`.
- Implementing fast linting and formatting with Biome.
- Configuring modern build pipelines with Vite 8 and SWC.
- Automating JS/TS scripts and task execution.
- Migrating legacy npm/yarn projects to pnpm.

**DO NOT USE FOR:**
- Pure frontend UI components (unless managing their build system).
- Intensive CPU tasks better suited for Rust or Go.

**INVOKES:**
- `node`, `pnpm`, `npm`, `npx` CLI tools.

## Methodology and Guidelines
Implementation details for setup, operations, and troubleshooting are documented in:
1. [Node.js Environment and Stack](references/node-setup.md)
2. [Node.js Operations and Troubleshooting](references/node-operations.md)

## Core Principles
1. **Efficiency:** Prefer `pnpm` for its speed and content-addressable storage.
2. **Determinism:** Always use lockfiles (`pnpm-lock.yaml`) and exact versions (`npm ci`).
3. **Speed:** Utilize SWC and Biome to minimize feedback loops.

## Checklist
- [ ] Inspect `package.json` and lockfiles before changing dependencies.
- [ ] Prefer existing project tooling over introducing new packages.
- [ ] Verify changes with the narrowest relevant install or test command.
