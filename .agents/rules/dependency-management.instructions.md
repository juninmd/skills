---
name: dependency-management
description: "Use when adding, upgrading, auditing, or pruning dependencies and lockfiles. Triggers: dependency management, lockfile, dependency audit, package upgrade, unused dependency."
applyTo: '**/package.json, **/bun.lockb, **/pnpm-lock.yaml, **/yarn.lock'
---

# Rule: Dependency Management

> **Mission:** Pin everything. Audit continuously. Dependencies are liabilities.

## Package Manager Commands

```bash
# pnpm (preferred for new projects)
pnpm install --frozen-lockfile
pnpm add <package>
pnpm add -D <package>
pnpm remove <package>
pnpm audit

# bun
bun install --frozen-lockfile
bun add <package>
bun add -d <package>
bun audit
```

## package.json Standards

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "lint": "biome check src",
    "typecheck": "tsc --noEmit"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

## Lockfile Governance

- **Always** commit lockfiles (`pnpm-lock.yaml`, `bun.lockb`, `package-lock.json`)
- Run `--frozen-lockfile` in CI — never `--legacy-peer-deps`
- Lockfile changes must be in the same commit as `package.json` changes

## Security Auditing

```bash
pnpm audit          # or bun audit / npm audit
npx snyk test       # deeper analysis
```

Set up Renovate or Dependabot for automated PR updates.

## Dependency Rules

1. **Pin major versions** with `^` in `package.json`; always commit lockfiles
2. **Remove unused deps** in the same commit they become unused
3. **Minimal dependencies** — prefer stdlib over adding a package
4. **Trusted sources only** — npm/pnpm registries; no unverified packages
5. **Check bundle impact** before adding frontend dependencies

## Bundle Size Budget

| Category | Budget |
|---|---|
| Initial JS bundle | < 200KB gzipped |
| Per component library | < 50KB |
| Utility functions | Prefer native + minimal deps |

## CI Integration

```yaml
- name: Install
  run: pnpm install --frozen-lockfile

- name: Security Audit
  run: pnpm audit --audit-level=high
```

## Anti-Patterns

- ❌ Adding dependencies "just in case"
- ❌ `npm install` without committing lockfile changes
- ❌ Ignoring `audit` warnings in CI
- ❌ `require()` in ESM projects without proper config

## Checklist

- [ ] Lockfile committed with every `package.json` change
- [ ] Security audit runs in CI (`--audit-level=high`)
- [ ] Unused dependencies removed in same commit
- [ ] `engines` field specifies minimum Node version
- [ ] No new `any` types introduced to bypass type checking
