---
name: git-cleanup
description: |
  **GIT SKILL** - Safely clean up merged branches and stale worktrees.
  USE FOR: local branch cleanup, removing stale worktrees, squash-merge detection, identifying superseded branches, grouping related feature branches.
  DO NOT USE FOR: remote branch management, repository maintenance (gc/prune), non-interactive automation.
  INVOKES: git branch, git worktree, git log (PR history).
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Git"
allowed-tools: [run_shell_command, read_file, ask_user]
---

# Git Cleanup

Expert methodology for safely cleaning up accumulated git artifacts by categorizing work into deletable, related, and active states with a focus on data preservation.

**USE FOR:**
- Identifying and deleting local branches already merged into the default branch.
- Finding and removing stale worktrees.
- Grouping related iterations of a feature to identify the superseded work.
- Detecting squash-merged branches by tracing commit history and PR numbers.
- Cleaning up local tracking for deleted remote branches (`[gone]`).

**DO NOT USE FOR:**
- Deleting branches on the remote server.
- Running low-level repository optimization commands.

**INVOKES:**
- `git branch -d`, `git branch -D`, `git worktree remove`.

## Methodology and Guidelines
Implementation details for analysis, categorization, and execution are documented in:
1. [Analysis & Grouping](references/git-analysis.md)
2. [Categorization & State](references/git-categorization.md)
3. [Execution & Reporting](references/git-execution.md)
4. [Safety Rules & Principles](references/git-safety.md)

## Core Principles
1. **Safety First:** Never delete without explicit, two-gate user confirmation.
2. **Evidence-Based:** Categorization requires commit-level proof, not just name matching.
3. **Atomicity:** Run deletions as separate commands to ensure partial success.

## Checklist
- [ ] Sync remote state with `git fetch --prune` before starting analysis.
- [ ] Filter out all protected branches (main, master, develop, release/*).
- [ ] Check every worktree for uncommitted changes before proposing removal.
- [ ] Present the exact commands to be executed in the final confirmation gate.
