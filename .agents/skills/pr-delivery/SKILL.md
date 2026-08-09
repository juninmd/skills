---
name: pr-delivery
description: |
  Review work, create a branch, commit, push, and open a pull request with a description and screenshots when the change is user-visible. Use for finishing development work, PR descriptions, GitHub CLI, and delivery evidence.
---

# PR Delivery

## Workflow
1. Review the diff: `git status`, `git diff`, and the changed paths; verify tests, lint, and build pass; confirm no secrets staged.
2. Create or switch to a branch: `git switch -c feat/<scope>-<summary>` from the up-to-date base.
3. Commit with a conventional message (`type(scope): summary`); stage only intended files.
4. Push and open the PR with `gh pr create`: title from the commit, body covering what changed, why, and how to verify.
5. Capture evidence: run the app or command and screenshot user-visible results (UI, reports, dashboards); use command output or logs for backend and refactor changes.
6. Reference the screenshots or output in the PR body; never screenshot code.
7. Verify the PR: base branch, diff scope, CI status, and reviewer context. Do not merge without approval.

## Rules
- No commit, push, or PR without explicit confirmation.
- Run `git diff --cached --name-only` before staging; commit only intended files.
- PR description states what changed, why, and how it was verified.
- Screenshots only when they add evidence for user-visible behavior; skip them for pure logic changes.
- Merge only after CI is green and the review is approved.

## Checklist
- [ ] Diff reviewed; tests, lint, and build pass.
- [ ] Conventional commit on the correct branch.
- [ ] PR open with description and evidence (screenshots when user-visible).
