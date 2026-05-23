# Git Branch Finishing Workflow

Detailed steps for closing out development work and cleaning up environments.

## 1. Verify Tests
Always run the project's test suite before presenting options. If tests fail, stop and report.

## 2. Determine Base Branch
Identify the merge destination (usually `main` or `master`).

## 3. Present Options
Offer exactly these four paths:
1. **Merge back locally:** Checkout base, pull, merge, verify, delete branch.
2. **Push and create PR:** Push to origin, use `gh pr create`.
3. **Keep as-is:** Preserve branch and worktree for later.
4. **Discard:** Permanent deletion of branch and worktree (requires "discard" confirmation).

## 4. Execute Choice
Follow the specific git commands for the selected path. Ensure tests are re-verified after local merges.

## 5. Cleanup Worktree
Remove worktrees for Options 1 and 4. Keep them for Options 2 and 3 unless specifically asked to clean up.
