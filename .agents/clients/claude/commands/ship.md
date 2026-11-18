---
description: Prepare the change for a pull request with evidence
argument-hint: [branch or task]
---
Target: $ARGUMENTS (empty means the current branch)

Run lint, tests, and build; show the real output lines. Review the staged file list before committing (`git diff --cached --name-only`). Open the pull request with what changed, why, and how it was verified, plus rollback notes if it runs in production. Do not push, merge, or deploy without explicit approval.
