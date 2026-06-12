---
name: pnpm
description: "pnpm Management for Designing monorepos, Managing dependencies, Optimizing CI/CD via pnpm install."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Node.js"
allowed-tools: [run_shell_command, read_file, write_file]
---

# pnpm Management

Expert guide for fast, disk-efficient package management and monorepos using pnpm.

**USE FOR:**
- Designing monorepos with `pnpm-workspace.yaml`.
- Managing dependencies with overrides, patches, and aliases.
- Optimizing CI/CD with frozen lockfiles and store caching.
- Resolving phantom dependencies through strict symlinking.
- Centralizing versions using pnpm Catalogs.

**INVOKES:**
- `pnpm install`, `pnpm add`, `pnpm recursive`, `pnpm filter`.

## Methodology
Implementation details are documented in:
1. [Features](references/pnpm-features.md) | [Standards](references/pnpm-standards.md) | [CLI](references/core-cli.md)
2. [Config](references/core-config.md) | [Workspaces](references/core-workspaces.md) | [Store](references/core-store.md)
3. [Catalogs](references/features-catalogs.md) | [Overrides](references/features-overrides.md) | [Aliases](references/features-aliases.md)
4. [Hooks](references/features-hooks.md) | [Patches](references/features-patches.md) | [Peers](references/features-peer-deps.md)
5. [CI/CD](references/best-practices-ci.md) | [Migration](references/best-practices-migration.md) | [Perf](references/best-practices-performance.md) | [Generation](references/GENERATION.md)

## Checklist
- [ ] Inspect workspace config and lockfiles before changes.
- [ ] Use `--frozen-lockfile` in CI environments.
- [ ] Prefer `workspace:*` for internal dependencies.
- [ ] Validate the graph with a recursive install.
