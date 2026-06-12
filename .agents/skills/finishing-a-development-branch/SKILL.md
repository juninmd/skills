---
name: finishing-a-development-branch
description: "Finishing a Development Branch for Verifying local, Creating Pull, Merging feature via git checkout."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Git, GitHub"
allowed-tools: [run_shell_command, read_file]
---

# Finishing a Development Branch

Expert methodology for systematically completing development tasks, ensuring code quality through test verification, and managing repository hygiene.

**USE FOR:**
- Verifying local test state before finalizing a feature.
- Creating Pull Requests on GitHub using the `gh` CLI.
- Merging feature branches back into main/master with post-merge verification.
- Safely discarding unwanted experimental work and cleaning up worktrees.

**DO NOT USE FOR:**
- Complex rebase/conflict resolution that requires deep manual intervention.
- Repository-wide git configurations or user settings.

**INVOKES:**
- `git checkout`, `git merge`, `git push`, `gh pr create`.

## Methodology and Guidelines
Implementation details for the 5-step process and best practices are documented in:
1. [Git Branch Finishing Workflow](references/git-finish-workflow.md)
2. [Git Best Practices and References](references/git-best-practices.md)

## Core Principles
1. **Test First:** No branch is finished until the test suite passes.
2. **Structured Choice:** Present exactly 4 options (Merge, PR, Keep, Discard) to reduce ambiguity.
3. **Safety:** Require explicit confirmation for destructive actions.

## Checklist
- [ ] Verify that all local tests pass before suggesting any finish path.
- [ ] Determine the correct base branch before attempting a merge or PR.
- [ ] Require the user to type "discard" before force-deleting any branch.
- [ ] Clean up associated worktrees only after a successful merge or discard.
