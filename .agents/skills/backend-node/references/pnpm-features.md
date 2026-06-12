# pnpm Core Features and Workspaces

Detailed guidelines for managing dependencies and monorepos with pnpm.

## 1. Core CLI Commands
- **Install:** `pnpm install` (use `--frozen-lockfile` in CI).
- **Manage:** `pnpm add <pkg>`, `pnpm remove <pkg>`.
- **Run:** `pnpm run <script>`, `pnpm exec <cmd>`.
- **Global/Ad-hoc:** `pnpm dlx <pkg>` (replaces `npx`).

## 2. Workspaces and Monorepos
- **Config:** Managed via `pnpm-workspace.yaml`.
- **Filtering:** `pnpm --filter <pkg> <cmd>` (execute on specific sub-projects).
- **Protocols:** Use `workspace:*` for inter-package dependencies.

## 3. Advanced Features
- **Catalogs:** Centralized version management for workspaces.
- **Overrides:** Force specific versions of transitive dependencies.
- **Patches:** Apply custom fixes to third-party packages via `pnpm patch`.
- **Aliases:** Use `npm:<pkg>@<ver>` to install packages under custom names.
