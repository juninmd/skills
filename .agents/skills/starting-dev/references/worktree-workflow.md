# Git Worktree Creation Workflow

Detailed procedures for initializing isolated workspaces.

## 1. Creation Steps
1. **Detect Project:** `project=$(basename "$(git rev-parse --show-toplevel)")`.
2. **Add Worktree:** `git worktree add "$path" -b "$BRANCH_NAME"`.
3. **Environment Setup:** Auto-detect and run `npm install`, `cargo build`, `uv sync`, or `go mod download`.
4. **Baseline Verification:** Run project-specific tests to ensure a clean start.

## 2. Example Workflow Invocations
```bash
# DETERMINING PATH (standard: .worktrees/ at the repository root)
root=$(git rev-parse --show-toplevel)
path="$root/.worktrees/$SLUG"

# EXECUTING
git worktree add "$path" -b "$BRANCH"
cd "$path"
```

## 3. Integration
- **Optional/Opt-in:** Never default. Use only when explicitly requested or accepted by the user.
- **Used By:** `starting-dev`, `agent-engineering` (when authorized).
- **Paired With:** `finishing-dev` (for cleanup).

## 4. Workstream Register
When several workstreams run at once, keep one local register, ignored by git, with one entry each:

| Field | Content |
|---|---|
| `slug` | short workstream name, reused as the directory name |
| `branch`, `base` | its branch and the branch it started from |
| `path` | worktree location |
| `purpose` | one line on what it delivers |
| `owner` | the single agent or person who writes in it |
| `areas` | the paths it may change, disjoint from every other active workstream |
| `status` | `active`, `integrated`, or `abandoned`, with the date |

Committing the register as a project convention is a separate decision; ask first.

## 5. Integrate and Prune
When the work in a worktree is finished (PR opened and checks inspected, or the branch merged), suggest removing it and wait for the user's answer; never remove it unprompted.
1. Diff the workstream against its `base` and confirm every change stays inside its `areas`.
2. Merge workstreams one by one, dependencies first, running the test suite after each.
3. Remove finished workstreams only once the user confirms, and only those this task created:
```bash
git worktree remove "$path"      # fails on uncommitted changes; do not reach for --force
git branch -d "$BRANCH"          # -d keeps unmerged work safe by refusing
git worktree prune               # clears entries for worktrees deleted by hand
```
4. Set its status in the register to `integrated` or `abandoned`.
