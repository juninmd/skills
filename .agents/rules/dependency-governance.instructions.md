---
name: dependency-governance
description: Dependency governance rules for security, reproducibility, and maintainability.
applyTo: '**/package.json, **/pnpm-lock.yaml, **/requirements*.txt, **/pyproject.toml, **/poetry.lock, **/go.mod, **/go.sum, **/build.gradle*'
---

# Rule: Dependency Governance

## 1. Governance
- **Always consult official documentation** (e.g., [npm.io](https://npm.io), [pypi.org](https://pypi.org)) to identify and use the **latest stable versions** of libraries and tools.
- Pin versions using lockfiles to ensure reproducibility.
- Remove unused dependencies immediately in the same change where they become unnecessary.
- Prefer mature, maintained libraries with a clear release cadence.
- Avoid introducing libraries for trivial logic that can be implemented with native features.

## 2. Security
- Run vulnerability scans in CI.
- Patch critical vulnerabilities with priority.
- Document accepted risk for temporary exceptions.
