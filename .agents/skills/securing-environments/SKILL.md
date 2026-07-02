---
name: securing-environments
description: Protection of secrets and rigorous management of .env and .gitignore files to prevent leaks.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Environment Security

This skill focuses on the protection of credentials and secrets in the repository.

## Instructions
- Audit `.gitignore` before each commit.
- Use the `scripts/audit_secrets.sh` script to verify the repository.

## Resources
- See `assets/FORMS.md` for the PR security checklist.

