---
name: dependency-management
description: Dependency governance rules for security, reproducibility, and maintainability.
applyTo: '**/package.json, **/pnpm-lock.yaml, **/requirements*.txt, **/pyproject.toml, **/poetry.lock, **/go.mod, **/go.sum, **/build.gradle*'
---

# Rule: Dependency Management

## Governance Rules
- Pin dependency versions using lockfiles whenever ecosystem supports it.
- Remove unused dependencies in the same change where they become unused.
- Prefer mature, maintained libraries with clear release cadence.
- Avoid introducing libraries for trivial logic.

## Security Rules
- Run dependency vulnerability scans in CI.
- Patch critical vulnerabilities with priority.
- Document accepted risk when temporary exceptions are required.

