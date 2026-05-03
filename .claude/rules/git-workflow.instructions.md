---
name: git-workflow
description: "Use when creating branches, writing commits, or opening PRs. Triggers: git, commit, branch, PR, conventional commits."
applyTo: '**/*'
paths:
  - "**"
trigger: always_on
---

# Rule: Git Workflow

> **Mission:** Safe collaboration. Protected history. Small, reviewable changes.

## Core Protocol

- ❌ **NEVER** commit directly to `main`, `master`, or protected branches
- ✅ **ALWAYS** create a feature branch
- ✅ **ALWAYS** use Conventional Commits: `type(scope): description`
- If user says "commit to main" → stop, ask for confirmation

## Branch Naming

```
feat/add-user-profile
fix/login-redirect
refactor/api-client
```

## Commit Format

```
feat(auth): add OAuth2 login
fix(api): handle 429 rate limit
docs(readme): update installation
```

Rules: imperative mood ("add" not "added"), max 72 chars, explain WHAT and WHY.

## Before Commit

```bash
git status --short
git diff --cached --name-only
```

## Checklist

- [ ] Feature branch (never direct to main)
- [ ] Conventional Commit format
- [ ] No secrets committed