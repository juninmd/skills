# Node.js Environment and Stack

Guidelines for setting up and maintaining a Node.js development environment.

## 1. Stack Selection
- Preserve the runtime range, package manager, compiler, test runner, and workspace tooling declared by the repository.
- For new projects, verify a supported LTS runtime and maintained tooling before choosing versions.
- Add monorepo orchestration only when workspace scale or task coordination requires it.

## 2. Package Manager Strategy
- **Standard:** Use the package manager selected by the lockfile and `packageManager` field.
- **Migration:** Change package managers only when requested and validate scripts, CI, publishing, and lockfile behavior.
- **Validation:** Always check for lockfiles (`pnpm-lock.yaml` vs `package-lock.json`) before executing commands.
- **Tool Execution:** Use `pnpm dlx` or `npx` for temporary tools.
