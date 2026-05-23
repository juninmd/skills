# Git Branch Categorization and State Detection

Logic for determining the safety and status of local branches and worktrees.

## 1. Categorization Logic (Phase 3)
- **SAFE_TO_DELETE:** Merged into default branch (`git branch -d`).
- **SQUASH_MERGED:** Work found in main via PR log (`git branch -D`).
- **SUPERSEDED:** Verified in newer branch/main via grouping (`git branch -D`).
- **REMOTE_GONE:** Remote deleted but work not found in main (Needs Review).
- **UNPUSHED_WORK:** Has unique local commits (Keep).
- **SYNCED:** Up to date with remote (Keep).

## 2. Dirty State Detection (Phase 4)
- **Worktree Check:** Run `git status --porcelain` in all worktree paths.
- **Safety Block:** Refuse to remove worktrees with uncommitted changes without explicit data-loss acknowledgment.
- **Warning:** Display LOST CHANGES warnings prominently in the analysis summary.
