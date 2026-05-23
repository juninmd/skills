# Git Best Practices and References

Guidelines for safe and efficient branch management.

## 1. Quick Reference Table

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | ✓ | - | - | ✓ |
| 2. Create PR | - | ✓ | ✓ | - |
| 3. Keep as-is | - | - | ✓ | - |
| 4. Discard | - | - | - | ✓ (force) |

## 2. Common Mistakes to Avoid
- **Skipping Tests:** Never merge broken code.
- **Ambiguous Options:** Always present the 4 structured options.
- **Auto-Cleanup:** Only remove worktrees when work is merged or explicitly discarded.
- **Silent Deletion:** Always require a typed confirmation before force-deleting a branch.

## 3. Red Flags
- Never proceed with failing tests.
- Never force-push without an explicit user request.
- Never delete work without verification and confirmation.
