---
name: git-workflow
description: "Use when creating branches, writing commits, opening PRs, or enforcing PR-first Git collaboration. Triggers: git workflow, conventional commits, feature branch, pull request, commit message."
applyTo: '**/*'
---

# Rule: Git Workflow

> **Mission:** Safe collaboration. Protected history. Small, reviewable changes.

## Core Protocol (CRITICAL)

- ❌ **NEVER** commit directly to `main`, `master`, or protected branches
- ✅ **ALWAYS** create a feature branch
- ✅ **ALWAYS** open a PR/MR for review
- If user says "commit to main" → ask for confirmation first
- If user says "push to main" → explain PR workflow instead

## Branch Naming

```bash
feat/add-user-profile-page
fix/login-redirect-loop
refactor/api-client-layer
docs/api-endpoints
chore/update-dependencies
test/user-auth-flow
ci/github-actions-setup
```

## Commit Convention (Conventional Commits)

```bash
feat(auth): add OAuth2 login
fix(api): handle 429 rate limit errors
docs(readme): update installation steps
refactor(stores): migrate to zustand
test(auth): add login failure tests
ci: add audit step

# Rules:
# - Imperative mood: "add" not "added"
# - Max 72 characters in subject
# - Body: explain WHAT and WHY, not HOW
# - Footer: reference issues (#123)
```

## Workflow

```bash
# 1. Sync
git fetch origin && git checkout main && git pull origin main

# 2. Branch
git checkout -b feat/my-feature

# 3. Commit
git add -p   # stage hunks, not whole files
git commit -m "feat(scope): description"

# 4. Push + PR
git push -u origin feat/my-feature
gh pr create --title "feat: my feature" --body "## Summary\n\n## Test plan"
```

## PR Best Practices

| Rule | Reason |
|---|---|
| < 400 lines per PR | Easier to review |
| One feature per PR | Clear rollback path |
| Include tests | Maintains coverage gate |
| Update docs if needed | Future maintainers |

## Anti-Patterns

- ❌ `git commit -m "fixed stuff"` — no Conventional Commit
- ❌ `git commit -m "WIP"` — no context
- ❌ PRs > 1000 lines — impossible to review
- ❌ Committing without running tests first

## Checklist

- [ ] Branch follows naming convention
- [ ] Commits follow Conventional Commits format
- [ ] Tests pass before commit
- [ ] PR description explains WHY, not just WHAT
- [ ] No secrets committed
