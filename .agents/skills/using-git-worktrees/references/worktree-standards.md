# Git Worktree Standards and Red Flags

Guidelines for maintaining reliable workspace isolation.

## 1. Core Rules
- **Announce Inception:** Always state "I'm using the using-git-worktrees skill..." at start.
- **Verification First:** Never skip the baseline test verification.
- **Selective Setup:** Skip dependency installs if no manifest files exist.

## 2. Common Mistakes
- **Polluting Git:** Creating local worktrees that are not ignored.
- **Ghost Bugs:** Proceeding with implementation when the baseline tests already fail.
- **Inconsistency:** Choosing a path that violates existing project conventions.

## 3. Red Flags
- Never force-create a worktree if it already exists at the target path.
- Never assume a directory location when the repository is ambiguous.
- Never skip the `fetch` to ensure the base branch is up to date.
