---
name: developing-node
description: "Node.js Development for Managing project, Implementing fast, Configuring modern via node."
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

## Development Standards
1. **Architecture & Delivery Principles:**
   - **Module boundaries:** Prefer clear modular boundaries; avoid cyclic dependencies.
   - **Transport isolation:** Keep business rules out of HTTP/CLI adapters. Controllers/handlers should delegate to services, never contain logic.
   - **Minimal abstractions:** Use the smallest viable abstraction. Remove speculative complexity (YAGNI).
2. **Asynchronous Programming:**
   - **Async/Await:** Check that asynchronous operations use `async/await` and handle Promise rejections appropriately. Avoid using raw `.then().catch()` chains unless absolutely necessary.

## Checklist
- [ ] Inspect `package.json` and lockfiles before changing dependencies.
- [ ] Prefer existing project tooling over introducing new packages.
- [ ] Verify changes with the narrowest relevant install or test command.
