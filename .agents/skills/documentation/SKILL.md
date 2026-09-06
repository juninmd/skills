---
name: documentation
description: |
  Author and verify documentation, visual diagrams, and programmatic office documents. Use for README, docs verification, Mermaid diagrams as code, ASCII figures, terminal figures, code snippet images, PDF/DOCX generation, and OpenAPI reference.
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
| What changed? | Changelog | owned by release-management — not written here |
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

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- A new or changed command has not been checked on a clean checkout when its prerequisites permit. Verify it or mark the prerequisite and limitation clearly.
- The document would claim behavior the code does not have. Read the code first.
- The user did not ask for this artifact. Do not create it.

## Rules
- Hand off requirements clarification to `project-lifecycle`, web research to `web-research`, and UI components to `frontend-engineering`.
- No document claims behavior the code does not have. Read the code, not the previous version of the doc.
- New or changed commands should be executed on a clean checkout when practical; pin versions where drift is costly.
- When a Quick Start exists, it must run end to end for a reader with no prior context and no tribal knowledge — including the environment variables nobody remembers needing.
- Document environment variables in a table of name, purpose, required-or-default, and example value. Never a real secret, not even a revoked one.
- When a document already exists, report its weak or missing sections and preserve the rest. Regenerating destroys the corrections people made by hand.
- Prefer a small accurate document over a complete stale one. Coverage is not the goal; being true is.
- Do not create documentation artifacts the user did not request.
- Before publishing prose, audit it for AI-writing tells — chatbot openers, significance inflation, filler transitions, a generic closing line. The external `avoid-ai-writing` skill does this in detect or edit-in-place mode; install it only after plugin-vetting has read it at a pinned commit.
- Changelogs and release notes belong to release-management; diagrams as versioned source to diagrams-as-code; agent-facing repository context to agents-md; a figure that must survive plain text to ascii-figures; generated Office and PDF files to document-generation.

## Checklist
- [ ] Reader and question named; the artifact type matches the job.
- [ ] New or changed commands checked on a clean checkout when practical, with prerequisites recorded.
- [ ] Links checked; generated reference regenerated and diffed.
- [ ] Something in CI fails when this document becomes false.
- [ ] Stale content deleted, not annotated.
- [ ] No secrets, and no claim the code does not support.
