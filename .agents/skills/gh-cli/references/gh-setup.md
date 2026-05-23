# GitHub CLI Setup and Authentication

Guidelines for configuring and authenticating the `gh` CLI.

## 1. Authentication
- **Status:** `gh auth status`.
- **Login:** `gh auth login`.
- **Token-based:** Prefer `GH_TOKEN` or `GITHUB_TOKEN` for CI/CD environments.
- **Git Integration:** `gh auth setup-git` (configure git to use GitHub credentials).

## 2. Repository Operations
- **View:** `gh repo view [owner/repo]` (use `--web` for browser).
- **Clone/Fork:** `gh repo clone`, `gh repo fork`.
- **Default:** `gh repo set-default` to lock context.
