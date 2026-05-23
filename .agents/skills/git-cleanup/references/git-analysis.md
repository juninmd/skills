# Git Cleanup: Analysis and Grouping

Procedures for gathering git state and identifying related work.

## 1. Comprehensive Analysis (Phase 1)
- **Default Branch:** Identify `main` or `master`.
- **Protected Branches:** Exclude `main`, `master`, `develop`, `release/*`.
- **Status Sync:** `git fetch --prune`.
- **Commits Check:** For each branch, identify commits not in the default branch and commits not pushed to remote.

## 2. Grouping Related Branches (Phase 2)
- **Identify Groups:** Group by common name prefixes (e.g., `feat/auth-*`).
- **Analyze Group:** Compare commit histories to find the "final" iteration.
- **Merge Evidence:** Search the default branch for PRs that incorporated work from any group member.
- **Superseded Logic:** Mark older iterations as superseded only if work is verified in a newer branch or main.
