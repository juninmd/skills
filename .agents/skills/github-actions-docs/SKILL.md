---
name: github-actions-docs
description: |
  **DOCS SKILL** - Official GitHub Actions documentation lookup and guidance.
  USE FOR: Actions YAML syntax, triggers, reusable workflows, OIDC security, runner configuration, CI/CD migration, Action Runner Controller.
  DO NOT USE FOR: repo-specific CI debugging (without docs context), general git commands, non-Actions GitHub features.
  INVOKES: docs.github.com search, official documentation links.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "GitHub Actions"
allowed-tools: [web_fetch, read_file]
---

# GitHub Actions Docs

Expert methodology for navigating and interpreting official GitHub Actions documentation to provide grounded, authoritative workflow guidance.

**USE FOR:**
- Resolving YAML syntax questions for workflows and custom actions.
- Designing secure authentication patterns using OIDC and `GITHUB_TOKEN`.
- Implementing advanced patterns like reusable workflows and matrix builds.
- Configuring various runner types (GitHub-hosted, self-hosted, ARC).
- Planning migrations from other CI/CD platforms to GitHub Actions.

**DO NOT USE FOR:**
- Direct implementation or editing of local pipelines (use `configuring-ci-cd`).
- Investigating transient runner failures or network issues.

**INVOKES:**
- `docs.github.com/en/actions` search and retrieval.

## Methodology and Guidelines
Implementation details for classification, search, and response standards are documented in:
1. [Classification & Search Strategy](references/docs-strategy.md)
2. [Documentation Guidelines](references/docs-guidelines.md)
3. [Topic Map](references/topic-map.md)

## Core Principles
1. **Source of Truth:** Never answer from memory; always verify against the latest docs.
2. **Authoritative Linking:** Provide deep links to specific sections, not just landing pages.
3. **Explicit Inference:** Clearly distinguish between direct documentation and combined reasoning.

## Checklist
- [ ] Classify the request into a specific GitHub Actions bucket.
- [ ] Verify the current documentation on `docs.github.com` before answering.
- [ ] Include exact links to authoritative pages close to the claims.
- [ ] Provide YAML syntax examples only when they improve clarity.
