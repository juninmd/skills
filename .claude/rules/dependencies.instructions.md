---
name: dependencies
description: "Use when adding, upgrading, auditing, or managing dependencies and lockfiles across any ecosystem. Triggers: dependency management, lockfile, dependency audit, package upgrade, unused dependency, pin version."
applyTo: '**/package.json,**/pnpm-lock.yaml,**/bun.lockb,**/yarn.lock,**/requirements*.txt,**/pyproject.toml,**/poetry.lock,**/go.mod,**/go.sum,**/build.gradle*'
paths:
  - "**/package.json"
  - "**/pnpm-lock.yaml"
  - "**/bun.lockb"
  - "**/yarn.lock"
  - "**/requirements*.txt"
  - "**/pyproject.toml"
  - "**/poetry.lock"
  - "**/go.mod"
  - "**/go.sum"
  - "**/build.gradle*"
trigger: glob
globs: "**/package.json,**/pnpm-lock.yaml,**/bun.lockb,**/yarn.lock,**/requirements*.txt,**/pyproject.toml,**/poetry.lock,**/go.mod,**/go.sum,**/build.gradle*"
---

# Rule: Dependency Management

> **Mission:** Pin everything. Audit continuously. Dependencies are liabilities.

## Core Rules

1. **Always consult official sources** (npmjs.com, pypi.org, pkg.go.dev) for latest stable versions
2. **Pin versions** using lockfiles to ensure reproducibility
3. **Remove unused deps** in the same commit where they become unnecessary
4. **Prefer stdlib** over adding a package for trivial logic
5. **Trusted sources only** — no unverified packages

## Package Manager Commands

```bash
# pnpm (preferred for new JS/TS projects)
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

# npm (CI-safe)
npm ci
npm audit --audit-level=high
```

## Lockfile Governance

- **Always** commit lockfiles (`pnpm-lock.yaml`, `bun.lockb`, `package-lock.json`)
- Run `--frozen-lockfile` in CI — never `--legacy-peer-deps`
- Lockfile changes must be in the **same commit** as `package.json` changes
- Never auto-update lockfiles silently (document why in the commit)

## Security Auditing

```bash
pnpm audit --audit-level=high
bunx snyk test          # deeper static analysis

# Python
pip-audit               # or: uv audit
safety check

# Go
govulncheck ./...
```

Set up **Renovate** or **Dependabot** for automated PR updates.

## Frontend Bundle Budget

| Category | Budget |
|---|---|
| Initial JS bundle | < 200KB gzipped |
| Per component library | < 50KB |
| Utility functions | Prefer native |

Check bundle impact with `bundlephobia.com` before adding frontend deps.

## CI Integration

```yaml
- name: Install
  run: pnpm install --frozen-lockfile

- name: Security Audit
  run: pnpm audit --audit-level=high
```

## Anti-Patterns

- ❌ Adding dependencies "just in case"
- ❌ Committing without lockfile changes
- ❌ Ignoring `audit` warnings in CI
- ❌ Different package managers in the same project

## Checklist

- [ ] Lockfile committed with every `package.json` change
- [ ] Security audit runs in CI (`--audit-level=high`)
- [ ] Unused dependencies removed in same commit
- [ ] `engines` field specifies minimum runtime version
- [ ] Patch critical vulnerabilities before merging
