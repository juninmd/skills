---
name: using-git-worktrees
description: "Using Git Worktrees for Setting up, Ensuring worktree, Automating environment via git worktree add."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Git 2.5+"
allowed-tools: [run_shell_command, read_file, write_file, ask_user]
---

# Using Git Worktrees

Expert methodology for creating reliable, isolated workspaces using Git worktrees to allow concurrent development on multiple branches without polluting the primary workspace.

**USE FOR:**
- Setting up new, branch-specific directories for implementation.
- Ensuring worktree paths are correctly ignored in the repository's `.gitignore`.
- Automating environment setup and baseline verification for new workspaces.
- Managing multiple active development streams simultaneously.

**DO NOT USE FOR:**
- Deleting or merging branches (use `finishing-a-development-branch`).
- Troubleshooting complex repository-wide corruption.

**INVOKES:**
- `git worktree add`, `git check-ignore`, and project setup commands.

## Methodology and Guidelines
Implementation details for setup, workflow, and standards are documented in:
1. [Setup & Verification](references/worktree-setup.md)
2. [Creation Workflow](references/worktree-workflow.md)
3. [Standards & Red Flags](references/worktree-standards.md)

## Core Principles
1. **Isolation Integrity:** Mandatory `.gitignore` verification for all local worktree paths.
2. **Clean Baseline:** Verify that the environment is functional *before* implementing changes.
3. **Convention First:** Prioritize existing `.worktrees` or repository-specific instructions.

## Checklist
- [ ] Resolve the worktree location using the priority order (Existing > Instruction > Ask).
- [ ] Verify that project-local worktree paths are explicitly ignored.
- [ ] Run the project's setup and verify a clean test baseline.
- [ ] Report the ready-to-use path and test status to the user.
