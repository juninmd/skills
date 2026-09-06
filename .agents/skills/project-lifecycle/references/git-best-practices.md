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
- **Ambiguous Options:** Present structured options when the branch disposition is undecided.
- **Auto-Cleanup:** Only remove worktrees when work is merged or explicitly discarded.
- **Silent Deletion:** Always require a typed confirmation before force-deleting a branch.

## 3. Red Flags
- Never proceed with failing tests.
- Never force-push without an explicit user request.
- Never delete work without verification and confirmation.
- **NEVER** commit directly to `main`, `master`, or protected branches without explicit authorization and a check of actual branch policy.

## 4. Branch Naming
- Use clear prefixes: `feat/add-user-profile`, `fix/login-redirect`, `refactor/api-client`.

## 5. Conventional Commits (MANDATORY)
- Format: `type(scope): description`
- Examples:
  - `feat(auth): add OAuth2 login`
  - `fix(api): handle 429 rate limit`
  - `docs(readme): update installation`
- Use the imperative mood ("add" not "added"), max 72 characters. Explain WHAT and WHY.

## 6. Before Commit Checks
- ALWAYS verify the status using `git status -s`.
- ALWAYS verify staged changes using `git diff --cached --name-only`.
- Ensure no secrets are committed.
