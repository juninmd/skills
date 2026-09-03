---
name: documentation
description: |
  Write and maintain documentation that stays true: README, API docs, ADRs, runbooks, changelogs, and docs-as-code. Use for project onboarding docs, OpenAPI-derived reference, decision records, release notes, and doc drift prevention.
---

# Documentation

## Preflight
```bash
ls README* docs/ CHANGELOG* adr/ doc/adr/ 2>/dev/null
rg -n '```(bash|sh|console)' README.md | wc -l     # how many claims are executable
npx lychee --offline README.md 'docs/**/*.md'      # are the links even valid today
```

Name the reader and the single question the document answers before writing a line.

## Workflow
1. Name the reader and the single question the document answers. One document, one job — a page serving two readers serves neither.
2. Write the README **last**, from what was actually built, with commands you actually ran.
3. Pick the right artifact for the job (below) rather than growing the README.
4. Verify every command and every link.
5. Delete stale content instead of marking it outdated. A section labeled "may be out of date" is read as current by everyone in a hurry.

## Artifact by Job

| Reader's question | Artifact | Must contain |
|---|---|---|
| What is this, how do I run it? | README | one-paragraph purpose, prerequisites, install, run, test, one working example |
| Why is it built this way? | ADR | context, decision, **alternatives rejected and why**, consequences, status |
| It is broken at 3am — what do I do? | Runbook | symptom and how it pages, verification, mitigation with exact commands, escalation threshold, rollback |
| How do I call this API? | Generated reference | derived from OpenAPI/types/`--help`, never hand-written |
| What changed? | Changelog | owned by `release-management` — not written here |
| How do I do task X? | Guide in `docs/` | prerequisites, numbered steps, expected output, failure cases |

## Anti-Drift
Documentation rots because nothing fails when it becomes false. Make something fail.

```bash
# Execute the README's own code blocks in CI
npx markdown-code-runner README.md    # or extract fences and run them

# Fail the build when generated reference drifts from source
npm run docs:generate && git diff --exit-code docs/api/

# Link check every build (relative links offline, external in CI)
npx lychee --offline README.md 'docs/**/*.md'
```

An untested code block is a claim, not a fact — and it is the first thing a new reader copies.

## Placement

| Document | Lives |
|---|---|
| README | repo root, answering "what and how to run" |
| Deeper guides | `docs/` |
| Module documentation | beside the module, so it moves and dies with the code |
| ADRs | one append-only numbered directory, never edited after acceptance — supersede instead |
| Runbooks | beside the service, linked from the alert that fires |

## The README Trap
Everything ends up in the README because it is the path of least resistance, and then nobody reads any of it. When a section grows past a screen, move it to `docs/` and leave one link. The README's job is to get someone running in under five minutes.

## Stop
- A command in the document has not been executed on a clean checkout. Run it or delete it; a wrong command is worse than a missing one.
- The document would claim behavior the code does not have. Read the code first.
- The user did not ask for this artifact. Do not create it.

## Rules
- No document claims behavior the code does not have. Read the code, not the previous version of the doc.
- Commands in documents must have been executed recently, on a clean checkout, by the person writing them. Pin versions where drift is costly.
- When a Quick Start exists, it must run end to end for a reader with no prior context and no tribal knowledge — including the environment variables nobody remembers needing.
- Document environment variables in a table of name, purpose, required-or-default, and example value. Never a real secret, not even a revoked one.
- When a document already exists, report its weak or missing sections and preserve the rest. Regenerating destroys the corrections people made by hand.
- Prefer a small accurate document over a complete stale one. Coverage is not the goal; being true is.
- Do not create documentation artifacts the user did not request.
- Changelogs and release notes belong to `release-management`; diagrams as versioned source to `diagrams-as-code`; agent-facing repository context to `agents-md`; a figure that must survive plain text to `ascii-figures`; generated Office and PDF files to `document-generation`.

## Checklist
- [ ] Reader and question named; the artifact type matches the job.
- [ ] Every command executed on a clean checkout before being written down.
- [ ] Links checked; generated reference regenerated and diffed.
- [ ] Something in CI fails when this document becomes false.
- [ ] Stale content deleted, not annotated.
- [ ] No secrets, and no claim the code does not support.
