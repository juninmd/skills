# GitHub CLI Releases and Workflows

Commands for managing builds, actions, and distribution.

## 1. Workflows and Actions
- **List/Run:** `gh workflow list`, `gh workflow run ci.yml`.
- **Runs:** `gh run list`, `gh run view <id> --log`.
- **Monitoring:** `gh run watch` to follow active jobs.

## 2. Releases
- **List/View:** `gh release list`, `gh release view <tag>`.
- **Create:** `gh release create <tag> --generate-notes`.
- **Artifacts:** `gh release upload <tag> dist/*`.
