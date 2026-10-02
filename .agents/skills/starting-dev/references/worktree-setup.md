# Git Worktree Setup and Verification

Guidelines for selecting and securing worktree directories when worktree isolation is explicitly chosen or accepted by the user (never default).

## 1. Directory Selection Priority
1. **Standard:** `.worktrees/<slug>` at the repository root, created on first use.
2. **Repository Instructions:** an `AGENTS.md` that names a different location wins; follow it and report it.
3. **Legacy:** an existing `worktrees/` is kept when the project already uses it; never create it new.

## 2. Safety Verification (Critical)
For project-local directories, you MUST verify they are ignored by git:
```bash
git check-ignore -q .worktrees
```
**Failure Path:** If NOT ignored, add `.worktrees/` to `.gitignore` and ask before committing it; until then add it to `.git/info/exclude` so it never reaches a commit.

Paths use forward slashes and stay short: on Windows a deep `node_modules` inside a long worktree path can exceed the 260-character limit.

## 3. Quick Reference

| Situation | Action |
|-----------|--------|
| `.worktrees/` exists or not | Use it, creating it if needed (verify ignored) |
| AGENTS.md names another location | Follow AGENTS.md |
| Folder not ignored | `.git/info/exclude` now, `.gitignore` after confirmation |
| Work finished | Suggest removal per [worktree-workflow.md](worktree-workflow.md) |
