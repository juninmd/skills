# Skill: Git Workflow Manager

## Description
This skill enables the agent to manage the full Git lifecycle, including branching strategies, commit management, and pull request workflows. It is essential for collaborative development and maintaining clean version history.

## Capabilities
- Create and manage local and remote branches.
- Stage changes and create meaningful commits following project conventions.
- Handle merges and rebases to keep feature branches up-to-date.
- Prepare and manage Pull Requests/Merge Requests.
- Resolve basic merge conflicts.

## Usage
1. **Branching:** Always create a descriptive feature branch from the main branch before starting work.
2. **Commits:** Group logical changes into atomic commits with clear, descriptive messages.
3. **Synchronization:** Regularly fetch and pull changes from the remote repository to avoid drift.
4. **Review:** Before finalizing, verify changes against the base branch to ensure no regressions.

## Constraints
- Do not force push (`--force`) to shared branches (e.g., `main`, `master`, `develop`).
- Ensure all commits are signed if required by the repository policy.
- Verify that tests pass locally before pushing changes.
