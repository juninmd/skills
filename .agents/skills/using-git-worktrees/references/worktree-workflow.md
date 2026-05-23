# Git Worktree Creation Workflow

Detailed procedures for initializing isolated workspaces.

## 1. Creation Steps
1. **Detect Project:** `project=$(basename "$(git rev-parse --show-toplevel)")`.
2. **Add Worktree:** `git worktree add "$path" -b "$BRANCH_NAME"`.
3. **Environment Setup:** Auto-detect and run `npm install`, `cargo build`, `uv sync`, or `go mod download`.
4. **Baseline Verification:** Run project-specific tests to ensure a clean start.

## 2. Example Workflow Invocations
```bash
# DETERMINING PATH
case $LOCATION in
  .worktrees|worktrees) path="$LOCATION/$BRANCH" ;;
  *) path="~/.config/superpowers/worktrees/$project/$BRANCH" ;;
esac

# EXECUTING
git worktree add "$path" -b "$BRANCH"
cd "$path"
```

## 3. Integration
- **Required By:** `brainstorming`, `subagent-driven-development`, `executing-plans`.
- **Paired With:** `finishing-a-development-branch` (for cleanup).
