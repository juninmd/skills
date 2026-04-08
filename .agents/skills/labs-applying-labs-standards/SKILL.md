---
name: labs-applying-labs-standards
description: Consolidate Luizalabs standards for architecture, quality, security, and CI/CD for repository bootstrap and auditing.
metadata:
    works_on: [copilot, antigravity, gemini]
argument-hint: "[project/file]"
---

# Luizalabs Standards Playbook

## Objective
Apply a single corporate baseline for repository structure, quality governance, security, and continuous delivery.

## ✅ Guidelines
1. Never version secrets, `.env`, or credentials.
2. In Node projects, require a minimum Node.js version of 22.
3. Standardize the pipeline with build, testing, security, and deployment.
4. Ensure mandatory artifacts: `.gitignore`, `.gitlab-ci.yml`, `dependency.yaml`, `hangar-info.yaml`, `sonar-project.properties`.
5. Enforce secure logging without PII.

## 🔐 Access
When access to internal repositories/platforms is missing, guide the request to the `luizalabs` group at `https://iam.corp.luizalabs.com`.
