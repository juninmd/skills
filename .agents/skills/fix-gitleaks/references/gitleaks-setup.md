# Gitleaks Setup and Collection

Procedures for installing Gitleaks and gathering finding data.

## 1. Installation
- **macOS:** `brew install gitleaks`
- **Linux:** Download binary from GitHub releases and add to `/usr/local/bin`.
- **Docker:** `docker run --rm -v "$PWD:/repo" zricethezav/gitleaks detect`
- **Pre-commit:** Add `gitleaks` hook to `.pre-commit-config.yaml`.

## 2. Collecting Findings
- **From CI Log:** Download via `glab ci trace` or API. Parse `Finding`, `Secret`, `Fingerprint`.
- **Local Scan:** `gitleaks detect --source . -v --report-format json`.
- **Redacted Logs:** Use `Fingerprint` and `File:Line` to locate real values in the local source.
