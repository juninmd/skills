# Gitleaks Action Execution

Detailed steps for removing secrets and managing ignore files.

## 1. Remove Secret
1. Replace the secret in the source file with env vars or placeholders.
2. Commit and push the fix on a new branch.
3. **Purge History:** Use `git-filter-repo` (preferred) or BFG Repo-Cleaner to remove the secret from all git history.
4. **Rotate:** Immediately rotate the credential at the provider.

## 2. Add to .gitleaksignore
Format: `commit:file:ruleID:line`
Example:
```
# False positive: README example
91f7ac1d:README.md:generic-api-key:27
```

## 3. Skip
Record skipped findings for later follow-up; do not mark as resolved.
