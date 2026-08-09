---
name: documentation
description: |
  Write and maintain documentation that stays true: README, API docs, ADRs, runbooks, changelogs, and docs-as-code. Use for project onboarding docs, OpenAPI-derived reference, decision records, release notes, and doc drift prevention.
---

# Documentation

## Workflow
1. Identify the reader and the question the document answers; one document, one job.
2. Derive reference material from the source of truth (OpenAPI spec, type definitions, CLI `--help`) instead of hand-copying.
3. Write the README last, from what was actually built; include run, test, and deploy commands that were executed and verified.
4. Record an ADR only for decisions with meaningful alternatives or long-lived consequences.
5. Verify every command and link; delete stale content instead of marking it outdated.
6. Generate changelogs from conventional commits or write them per release, not per commit.

## Rules
- No document claims behavior the code does not have.
- Commands in documents must have been executed recently; pin versions where drift is costly.
- Prefer a small accurate document over a complete stale one.
- Do not create documentation artifacts the user did not request.

## Checklist
- [ ] Reader and question are explicit.
- [ ] Commands and links verified.
- [ ] Content matches the actual code; no stale claims remain.
