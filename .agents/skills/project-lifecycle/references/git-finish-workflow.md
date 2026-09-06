# Git Branch Finishing Workflow

Detailed steps for closing out development work and cleaning up environments.

## 1. Verify Tests
Run the relevant project checks before presenting options when the disposition depends on the change. If required checks fail, stop and report.

## 2. Determine Base Branch
Identify the merge destination (usually `main` or `master`).

## 3. Present Options
Offer the applicable paths when the disposition is undecided:
1. **Merge back locally:** Checkout base, pull, merge, verify, delete branch.
2. **Push and create PR:** Push to origin, use `gh pr create`.
3. **Keep as-is:** Preserve branch and worktree for later.
4. **Discard:** Permanent deletion of branch and worktree (requires "discard" confirmation).

## 4. Execute Choice
Follow the specific git commands for the selected path. Ensure tests are re-verified after local merges.

## 5. Cleanup Worktree
Remove worktrees for Options 1 and 4. Keep them for Options 2 and 3 unless specifically asked to clean up.
