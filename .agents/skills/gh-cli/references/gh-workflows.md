# GitHub CLI Workflows: Issues and PRs

Commands for managing collaborative features on GitHub.

## 1. Issue Management
- **List:** `gh issue list --limit 20`.
- **View/Create:** `gh issue view <num>`, `gh issue create --title "..." --body-file file.md`.
- **Comments:** `gh issue comment <num> --body "..."`.

## 2. Pull Requests
- **Status:** `gh pr status`.
- **View/Create:** `gh pr view <num>`, `gh pr create --fill`.
- **Merge:** `gh pr merge <num> --squash --delete-branch`.
- **Checks:** `gh pr checks` (verify CI status).
