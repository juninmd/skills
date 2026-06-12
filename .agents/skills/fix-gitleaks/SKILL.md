---
name: fix-gitleaks
description: "Fix Gitleaks for Analyzing Gitleaks, Distinguishing real, Replacing secrets via gitleaks."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Git, GitHub, GitLab"
allowed-tools: [run_shell_command, read_file, ask_user]
---

# Fix Gitleaks

Expert methodology for triage and remediation of secrets, API keys, and credentials in source code and git history.

**USE FOR:**
- Analyzing Gitleaks findings from CI or local scans.
- Distinguishing real credentials from false positives.
- Replacing secrets with env vars or placeholders.
- Purging data from git history using `git-filter-repo`.
- Maintaining `.gitleaksignore` with precise fingerprints.

**DO NOT USE FOR:**
- Fixing general logic bugs or linting errors.

**INVOKES:**
- `gitleaks`, `git-filter-repo`, `gh`, `glab` CLI tools.

## Methodology and Guidelines
Refer to these modules:
1. [Setup/Collection](references/gitleaks-setup.md) | [Interactive Triage](references/gitleaks-triage.md)
2. [Action Execution](references/gitleaks-actions.md) | [Criteria/Validation](references/gitleaks-criteria.md)

## Core Principles
1. **Revoke First:** Real secrets must be revoked at the provider.
2. **Precision:** Use fingerprints in `.gitleaksignore`.
3. **Determinism:** Re-run scans until zero findings remain.

## Checklist
- [ ] Classify each finding before taking action.
- [ ] Confirm before running destructive history purges.
- [ ] Verify that the fix passes a local `gitleaks detect` scan.
- [ ] Ensure rotated credentials work in the updated environment.
