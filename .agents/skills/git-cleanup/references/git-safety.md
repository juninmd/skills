# Git Cleanup Safety Rules

Principles and rationalizations to prevent accidental data loss.

## 1. Mandatory Rules
- **No Automation:** Never run cleanup without an explicit user trigger.
- **Protected Branches:** Never analyze or delete `main`, `master`, `develop`, or `release/*`.
- **Force Delete:** Use `-D` for squash-merged branches to avoid redundant confirmation prompts.

## 2. Rationalizations to Reject
- "Branch is old" (Old doesn't mean merged).
- "Recover from reflog" (Unreliable safety net).
- "It's just local" (May contain the only copy of work).
- "Remote is gone" (Doesn't mean local work is pushed or merged).

## 3. References
- [Git branch Manual](https://git-scm.com/docs/git-branch)
- [Git worktree Manual](https://git-scm.com/docs/git-worktree)
