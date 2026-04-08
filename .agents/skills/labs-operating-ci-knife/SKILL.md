---
name: labs-operating-ci-knife
description: The official CI/CD Swiss Army knife of Luizalabs for deployments, releases, validations, and security following the Senior standard.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/cluster] [options]"
disable-model-invocation: true
---

# CI Knife Operations Senior

This skill encapsulates commands for the `ci-knife` tool, the gold standard for pipeline automation, release management, and security (Atena) at Luizalabs.

## When to Use
- During CI/CD flow to perform deployments in HML or PROD environments.
- When performing releases (Semantic Versioning) and generating automatic GMUDs.
- To run security scans (Atena) and validate Quality Gates.
- Whenever automation is needed involving ArgoCD, GitLab, or GCR.

## How to Use
The agent should prioritize `ci-knife` over manual scripts. Use specific subcommands for each pipeline stage (security, test, deploy).

## Instructions
1.  **Prefer Tooling:** NEVER use manual scripts for deployments if `ci-knife` can perform the task. Standardization is essential for Magalu scale.
2.  **Security First:** The `security-scanner` command (Atena) is mandatory in `main` and `staging` pipelines. Analyze generated reports.
3.  **ArgoCD Sync:** Use `argocd-deploy` to sync applications. Ensure image tag (`DEPLOY_TAG`) is based on commit SHA.
4.  **Semantic Release:** To generate new versions, use `create-release`. This ensures consistent changelogs and traceability (Kaizen).
5.  **Quality Gate:** Use `sonar-scanner` integrated with `ci-knife` to ensure quality metrics are published correctly.

## Resources
- `resources/REFERENCE.md`: Complete guide to commands and environment variables.

## Capabilities
- **Deploy:** `argocd-deploy`, `gcs-deploy`, `mgc-bucket-deploy`.
- **Release:** `create-release` (Semantic Versioning), `create-gmud`.
- **Quality:** `sonar-scanner`, `mr-sla`, `lint`.
