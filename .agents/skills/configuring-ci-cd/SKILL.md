---
name: configuring-ci-cd
description: "Write robust GitHub Actions and GitLab CI pipelines. Triggers: CI/CD, GitHub Actions."
argument-hint: "[workflow/pipeline file path] [options]"
---

# Configuring CI/CD Pipelines

This skill provides guidelines and best practices for configuring CI/CD pipelines using GitHub Actions or GitLab CI.

## Instructions
1. **Pipeline Triggers:** Define explicit triggers. Trigger builds on pull requests/merge requests and pushes to the main branch. Avoid triggering on every branch push if not necessary.
2. **Caching Dependencies:** Always use caching for dependencies (e.g., `node_modules`, `.m2`, `pip cache`) to speed up build times. Utilize built-in caching actions or features.
3. **Environment Separation:** Use separate environments for testing, staging, and production. Handle environment variables and secrets securely.
4. **Failing Fast:** Put faster jobs (like linting and unit tests) before slower ones (like integration tests or deployments).
5. **Reusable Workflows:** Prefer reusable workflows (GitHub Actions) or `include` (GitLab CI) for repetitive tasks across different projects or microservices.

## Example (GitHub Actions - Node.js)
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'
        cache: 'npm' # Enables automatic caching
    - run: npm ci
    - run: npm run lint
    - run: npm test
    - run: npm run build
```

## Checklist

- [ ] Define the pipeline stages, triggers, and required secrets before writing YAML.
- [ ] Fail fast on lint, typecheck, tests, and build instead of hiding errors behind later stages.
- [ ] Validate cache behavior, matrix coverage, and deployment gates before calling the pipeline complete.

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
