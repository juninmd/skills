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

## References
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)
