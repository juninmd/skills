---
name: developing-node
description: Package management and scripting for Node.js/TypeScript ecosystem. Prioritizes pnpm, but supports npm for legacy projects.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Node.js Development

This skill focuses on efficient dependency management and JS/TS build automation, standardizing `pnpm` usage for new projects and migrations.

## 🧱 Recommended 2026 Stack
- **Runtime:** Node.js 24 LTS.
- **Package Manager:** pnpm (latest).
- **Base Tooling:** TypeScript strict, **Biome** (replacing ESLint and Prettier for linting/formatting), Vitest.
- **Build / Compiler:** **SWC** (Speedy Web Compiler) for fast execution, **Vite 8** for frontend and bundlers.
- **Monorepo:** Turborepo (Nx when enterprise governance requires).

## Instructions
1.  **Package Manager Strategy:**
    *   **Standard:** Use `pnpm` for new projects. It is faster and more disk-efficient.
    *   **Legacy:** If you find `package-lock.json`, use `npm` to maintain consistency, but plan migration.
    *   **Validation:** Check project root.
        *   `pnpm-lock.yaml` → Use `pnpm`.
        *   `package-lock.json` → Use `npm` (and consider migrating).
2.  **Tool Execution:**
    *   **pnpm:** Use `pnpm dlx` for temporary tools.
    *   **npm:** Use `npx`.
3.  **Scripts:** Execute scripts via `pnpm run <script>` or `npm run <script>`.

## Common Tasks
*   **Install Dependencies:**
    *   `pnpm install` (Ideal)
    *   `npm ci` (For reproducible builds with npm)
*   **Add Package:**
    *   `pnpm add <package>`
    *   `npm install <package>`
*   **Run Tests:** `pnpm test` or `npm test`.
*   **Migration (npm → pnpm):**
    *   Run: `pnpm import` (Generates pnpm-lock.yaml from package-lock.json).
    *   Run: `rm package-lock.json` and `rm -rf node_modules`.
    *   Run: `pnpm install`.

## Troubleshooting
*   **Error `EACCES`:** Never use `sudo` for global package installation. Use nvm/volta.
*   **Phantom Dependencies:** If a package works but is not in `package.json`, `npm` may be "leaking" dependencies (hoisting). `pnpm` fixes this by default, which may break unintended imports after migration.
*   **Certificates (Netskope):** `npm config set cafile /path/to/cert.pem` works for both (pnpm reads npm config).

## Resources
- `assets/FORMS.md`: Checklist for new dependencies (Security/License).