# CI/CD Configuration and Best Practices

Guidelines for building efficient pipelines in GitHub Actions and GitLab CI.

## 1. Pipeline Design
- **Failing Fast:** Sequence faster jobs (linting, unit tests) before slower integration or deployment jobs.
- **Triggers:** Define explicit triggers (PRs, merges to main). Avoid unnecessary branch-push triggers.
- **Environment Separation:** Securely manage secrets and variables across test, staging, and prod.

## 2. Optimization Techniques
- **Caching:** Use native caching (e.g., `actions/setup-node` with `cache: 'npm'`) for all dependency managers.
- **Reusable Workflows:** Use GitHub Reusable Workflows or GitLab `include` to standardize tasks.
- **Matrix Builds:** Use matrices to test across multiple versions or platforms efficiently.

## 3. GitHub Actions Template (Node.js)
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
```

## 4. Shell & Automation Safety
- **Bash Safety:** Use `#!/usr/bin/env bash` and `set -euo pipefail` to exit on errors, unset variables, or pipe failures. Always quote variables.
- **PowerShell Safety:** Use `Test-Path` before deletion. Validate variable expansions. Use `-WhatIf` for dry-runs.
- **Idempotency:** Scripts should be safely rerunnable (e.g., `mkdir -p`, `rm -f`, `cp -n`).
- **Destructive Commands:** Guard `rm -rf` by validating the path first. *Never* use unexpanded variables like `rm -rf $DIR/`. Always implement a dry-run protocol before destructive operations.
- **Least Privilege:** Avoid `sudo` unless strictly necessary (never for `npm/pip/bun`). Never use `chmod 777`.
- **Makefiles:** Standardize targets (`run`, `test`, `coverage`, `clean`). Use `SHELL := /bin/bash` at the top.

## 5. Secrets and Identity in CI

Prefer short-lived federated credentials over long-lived cloud keys stored as CI secrets. A static
`AWS_SECRET_ACCESS_KEY` in repo secrets is a standing liability — it works from anywhere until
someone rotates it, and nothing forces that rotation. OIDC federation trades it for a token minted
per run, scoped to that run, expired within the hour, with no secret an attacker could exfiltrate
and reuse later.

```yaml
permissions:
  id-token: write   # required to request the OIDC token; nothing else by default
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/deploy-role
      aws-region: us-east-1
```

The cloud side must trust the token's issuer and subject claims (repo, branch, environment) —
scope the trust policy to the exact workflow, not `repo:org/*:*`, or any workflow in the org can
assume the role.

| Practice | Why it matters |
|---|---|
| `id-token: write` only on the job that needs it | a repo-wide default grants every workflow the ability to mint cloud tokens |
| Never `echo`, `env`, or dump a secret to logs | GitHub Actions masks registered secrets by exact string match only — a base64, JSON-escaped, or partially-transformed copy of the same secret prints in cleartext |
| Do not pass secrets as CLI arguments | arguments are visible in process listings and often echoed by shell tracing (`set -x`) |
| Scope `permissions:` per job, not the repo default | least privilege limits blast radius when a workflow is compromised via a malicious dependency or PR |

See `docs.github.com`'s Actions security hardening guide for the full OIDC trust-policy mechanics
per cloud provider.

## References
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)
