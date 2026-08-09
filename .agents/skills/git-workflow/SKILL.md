---
name: git-workflow
description: |
  Operate Git safely and recover from history problems. Use for bisect, cherry-pick, reflog, submodules, hooks, stash, rebase, amend, detached HEAD, conflict resolution, and history rewrite safety.
---

# Git Workflow

## Workflow
1. Inspect `git status`, branch, remotes, and `git log --oneline -5` before any mutation.
2. Choose the smallest command for the intent; prefer non-rewriting operations.
3. Before any history rewrite (rebase, amend, reset, filter-repo), confirm no pushed commits are affected unless force-push is explicitly approved.
4. Recover lost work with `git reflog` before assuming it is gone; branches and stashes are the last resort, never the first.
5. Use `git bisect` with an automated pass/fail command, not manual checks, and start from a known-good range.
6. Verify every operation with `git status --porcelain`, `git diff --stat`, and `git log --oneline`.

## Rules
- Never rewrite pushed history without explicit confirmation.
- Never use `git push --force`; use `--force-with-lease` so remote refs are verified first.
- Submodules: update with `--init --recursive`, pin by commit, and never push a submodule move that orphans the pointer.
- Hooks must live in-repo (`.githooks/` with `core.hooksPath`), never copied to `.git/hooks`.
- Prefer `git stash push --include-untracked`; keep stashes short-lived and always note their contents.
- Resolve conflicts with the final intent in mind: check `git status` per path, keep the smallest correct change, and verify with the build and tests after.

## Checklist
- [ ] Intent maps to the smallest safe command.
- [ ] No pushed history rewritten without confirmation.
- [ ] State verified after the operation (status, diff, log).
