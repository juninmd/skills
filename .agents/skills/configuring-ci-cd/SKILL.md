---
name: configuring-ci-cd
description: |
  **DEVOPS SKILL** - Configure and optimize CI/CD pipelines for GitHub and GitLab.
  USE FOR: GitHub Actions, GitLab CI, pipeline configuration, YAML workflows, caching dependencies, automated testing, deployment gates.
  DO NOT USE FOR: infrastructure as code (use managing-iac), cloud provider configuration (use managing-cloud-infrastructure).
  INVOKES: YAML editing tools, pipeline design checklists.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "GitHub, GitLab"
allowed-tools: [read_file, write_file, replace]
---

# Configuring CI/CD Pipelines

Expert guidance for designing, implementing, and optimizing automated CI/CD pipelines to ensure code quality and reliable deployments.

**USE FOR:**
- Authoring and debugging GitHub Actions (`.github/workflows/`) and GitLab CI (`.gitlab-ci.yml`) configurations.
- Implementing "fail-fast" strategies by sequencing linting and unit tests before builds.
- Optimizing pipeline performance through dependency caching and parallel job execution.
- Standardizing repetitive CI tasks using reusable workflows or includes.
- Configuring secure environment secrets and deployment protection rules.

**DO NOT USE FOR:**
- Managing underlying infrastructure (e.g., AWS/GCP resources) without CI/CD context.
- General server administration or Kubernetes cluster management.

**INVOKES:**
- YAML configuration for GitHub Actions and GitLab CI.

## Methodology and Guidelines
Implementation details for pipeline triggers, caching, and environment separation are documented in:
- [CI/CD Configuration and Best Practices](references/ci-cd-best-practices.md)

## Checklist
- [ ] Define pipeline stages, triggers, and required secrets before writing YAML.
- [ ] Fail fast on lint, typecheck, tests, and build instead of hiding errors.
- [ ] Validate cache behavior, matrix coverage, and deployment gates.
