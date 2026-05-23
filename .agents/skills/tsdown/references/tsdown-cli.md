# tsdown CLI and Configuration Features

Reference for command-line usage and dynamic configuration.

## 1. CLI Quick Reference
- **Build:** `tsdown`.
- **Watch:** `tsdown --watch`.
- **Clean:** `tsdown --clean`.
- **Formats:** `tsdown --format esm,cjs`.
- **Migrate:** `npx tsdown-migrate` (from tsup).

## 2. Advanced Configuration
- **Multiple Configs:** Export an array from `tsdown.config.ts`.
- **Conditional Config:** Export a function to toggle features based on `watch` or `env`.
- **Workspaces:** Use `workspace: 'packages/*'` to build multiple packages in a monorepo.
- **Hooks:** Use `hooks` for `build:before` and `build:done` custom logic.
