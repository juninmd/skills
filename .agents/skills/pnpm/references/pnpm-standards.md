# pnpm Standards and Best Practices

Guidelines for security, performance, and store management.

## 1. Store Management
- **Efficiency:** Uses content-addressable storage to deduplicate packages across projects.
- **Commands:** `pnpm store status`, `pnpm store prune` (removes unused packages).

## 2. Best Practices
- **Strict Mode:** Prevents "phantom dependencies" by default; never disable unless legacy-required.
- **CI/CD:** Use `pnpm/action-setup@v4` in GitHub Actions with caching enabled.
- **Docker:** Utilize BuildKit cache mounts for the pnpm store to speed up builds.
- **Migration:** Use `pnpm import` to convert existing `package-lock.json` or `yarn.lock`.

## 3. Configuration
- **.npmrc:** Configure `shamefully-hoist=false` (standard) and `auto-install-peers=true`.
- **Hooks:** Use `.pnpmfile.cjs` to programmatically adjust dependency resolution.

## 4. Dependency Governance
- **Pin Versions:** Use lockfiles (`pnpm-lock.yaml`) to ensure reproducibility.
- **Lockfile Changes:** Lockfile changes must be in the same commit as `package.json` changes.
- **Unused Dependencies:** Remove unused dependencies in the same commit where they become unnecessary.
- **Trusted Sources:** Only install from official/trusted sources. Prefer stdlib over adding a package for trivial logic.
- **Security Audits:** Always run `pnpm audit` (or equivalent) to patch critical vulnerabilities before merging. Set up automated PR updates (Renovate/Dependabot).
