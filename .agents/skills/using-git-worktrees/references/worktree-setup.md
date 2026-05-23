# Git Worktree Setup and Verification

Guidelines for selecting and securing worktree directories.

## 1. Directory Selection Priority
1. **Existing Directories:** Check `.worktrees/` (preferred) then `worktrees/`.
2. **Repository Instructions:** Check `AGENTS.md` for specific preferences.
3. **User Input:** Ask the user if no conventions or existing folders are found.

## 2. Safety Verification (Critical)
For project-local directories, you MUST verify they are ignored by git:
```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```
**Failure Path:** If NOT ignored, add the directory to `.gitignore` and commit immediately before proceeding.

## 3. Quick Reference

| Situation | Action |
|-----------|--------|
| `.worktrees/` exists | Use it (verify ignored) |
| Neither folder exists | Check AGENTS.md -> Ask user |
| Folder not ignored | Add to .gitignore + commit |
| Global directory used | No ignore check needed |
