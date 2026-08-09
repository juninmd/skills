---
name: docs-verification
description: |
  Verify knowledge against current official documentation before acting. Use for checking if a library API, config, or best practice is outdated, reading docs before answering, and updating stale local knowledge.
---

# Docs Verification

## Workflow
1. Identify the knowledge claim and its official source: docs page, changelog, or spec.
2. Fetch the current version of the relevant page; note the doc version and date.
3. Compare the claim against the doc; mark it outdated, unchanged, or conflicting.
4. If outdated, record the correct current behavior with the doc reference.
5. Update the local reference material or flag it for cleanup with a link to the current source.

## Rules
- The live doc outranks memory and stale references.
- Record the doc version and date for every verification.
- Never patch local references with unverified content; link to the source instead.
- Check the installed version's docs, not just the latest major.

## Checklist
- [ ] Claim checked against live official docs.
- [ ] Doc version and date recorded.
- [ ] Outdated local knowledge flagged or updated.
