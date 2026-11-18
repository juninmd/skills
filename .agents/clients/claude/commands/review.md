---
description: Review the current change in two passes: spec, then quality
argument-hint: [branch, PR, or file list]
---
Target: $ARGUMENTS (empty means the current diff)

Pass 1, spec: does the change do what was asked, nothing more, nothing less? Pass 2, quality: bugs, error handling, security, tests, contracts. Prefer the `code-reviewer` and `security-auditor` subagents so each pass starts with fresh context. Report only real defects, with file and line, most severe first, then a verdict: APPROVE or REQUEST_CHANGES.
