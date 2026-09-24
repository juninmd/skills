---
name: documentation
description: |
  Author and verify documentation, visual diagrams, and programmatic office documents. Use for README, docs verification, Mermaid diagrams as code, ASCII figures, terminal figures, code snippet images, PDF/DOCX generation, and OpenAPI reference.
---



# Documentation

**Not this skill:** a PR description (`finishing-dev`), or instructions for agents (`agent-engineering`).

## Preflight
```bash
ls README* docs/ CHANGELOG* adr/ doc/adr/ 2>/dev/null
rg -n '```(bash|sh|console)' README.md | wc -l     # how many claims are executable
find . -name '*.md' -not -path './node_modules/*' | xargs -n1 npx --yes markdown-link-check --quiet   # are the links even valid today
```

Name the reader and the single question the document answers before writing a line.

## Workflow
1. Name the reader and the single question the document answers. One document, one job — a page serving two readers serves neither.
2. Write the README **last**, from what was actually built, with commands you actually ran.
3. Pick the right artifact for the job (below) rather than growing the README.
4. Verify every command and every link.
5. Delete stale content instead of marking it outdated. A section labeled "may be out of date" is read as current by everyone in a hurry.
6. For long documents and decks, check for self-contradiction in numbers, dates, and names; quote each conflict and give its location.

## Artifact by Job

| Reader's question | Artifact | Must contain |
|---|---|---|
| What is this, how do I run it? | README | one-paragraph purpose, prerequisites, install, run, test, one working example |
| Why is it built this way? | ADR | context, decision, **alternatives rejected and why**, consequences, status |
| It is broken at 3am — what do I do? | Runbook | symptom and how it pages, verification, mitigation with exact commands, escalation threshold, rollback |
| How do I call this API? | Generated reference | derived from OpenAPI/types/`--help`, never hand-written |
| What changed? | Changelog | owned by `git-workflow` — not written here |
| How do I do task X? | Guide in `docs/` | prerequisites, numbered steps, expected output, failure cases |
| Which option, what did the run find, what does this diff do? (read once, not maintained) | Single-file HTML report ([why HTML](https://claude.dev/blog/using-claude-code-the-unreasonable-effectiveness-of-html/)) | options side by side, SVG diagrams, collapsed detail, and an export ("copy as JSON/prompt") when the reader's edits feed back |

The table above is the Diátaxis framework (Bhatti et al., *Docs for Developers*): a README quickstart and a guide teach or task-solve (tutorial/how-to), a generated reference describes the surface, an ADR explains why. Mixing modes in one document — a tutorial that digresses into reference tables — serves neither reader; split instead of appending.

## Anti-Drift
Documentation rots because nothing fails when it becomes false. Make something fail.

```bash
# Execute the README's own code blocks in CI: extract fenced blocks and run
# them per language (no single tool covers every language reliably)

# Fail the build when generated reference drifts from source
npm run docs:generate && git diff --exit-code docs/api/

# Link check every build
find . -name '*.md' -not -path './node_modules/*' | xargs -n1 npx --yes markdown-link-check --quiet
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
- Hand off requirements clarification to `starting-dev`, web research to `web-research`, and UI components to `frontend-engineering`.
- No document claims behavior the code does not have. Read the code, not the previous version of the doc.
- New or changed commands should be executed on a clean checkout when practical; pin versions where drift is costly.
- When a Quick Start exists, it must run end to end for a reader with no prior context and no tribal knowledge — including the environment variables nobody remembers needing.
- Document environment variables in a table of name, purpose, required-or-default, and example value. Never a real secret, not even a revoked one.
- When a document already exists, report its weak or missing sections and preserve the rest. Regenerating destroys the corrections people made by hand.
- Prefer a small accurate document over a complete stale one. Coverage is not the goal; being true is.
- Do not create documentation artifacts the user did not request.
- Before publishing prose, audit it for AI-writing tells — chatbot openers, significance inflation, filler transitions, a generic closing line. The external `avoid-ai-writing` skill does this in detect or edit-in-place mode; install it only after `security-ops` has read it at a pinned commit.
- Changelogs and release notes belong to `git-workflow`; diagrams as versioned source to [diagrams-as-code](references/diagrams-as-code.md); agent-facing repository context to `starting-dev`; a figure that must survive plain text to [ascii-figures](references/ascii-figures.md); generated Office and PDF files to [document-generation](references/document-generation.md); doc tests, versioned docs for breaking changes, and OpenAPI-vs-implementation drift to [docs-drift](references/docs-drift.md).

## Checklist
- [ ] Reader and question named; the artifact type matches the job.
- [ ] New or changed commands checked on a clean checkout when practical, with prerequisites recorded.
- [ ] Links checked; generated reference regenerated and diffed.
- [ ] Something in CI fails when this document becomes false.
- [ ] Stale content deleted, not annotated.
- [ ] No secrets, and no claim the code does not support.
