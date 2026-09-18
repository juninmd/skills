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

## 4. Parallel Workstreams
- **Ask Before Any Git Change:** Confirm with the user before creating, moving, merging, or removing a workstream's worktree, after checking whether it already exists, whether its base branch is fetched, and whether its path matches the project's convention.
- **Single Writer:** Each workstream has one owner and a declared list of paths. No two workstreams write to the same path; overlapping work becomes one workstream or runs one after the other.
- **Keep a Register:** Record workstreams in the register described in [worktree-workflow.md](worktree-workflow.md), so merging and cleanup rely on facts, not memory.
