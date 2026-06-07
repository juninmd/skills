---
name: grill-with-docs
description: |
  **INTERVIEWING SKILL** - Structured Socratic questioning that validates plans against existing domain language and documentation.
  USE FOR: sharpening terminology, validating architectural decisions, exposing imprecision in design plans, updating CONTEXT.md and ADRs as decisions solidify.
  DO NOT USE FOR: general code review, implementation, bug diagnosis. For adversarial questioning without docs use grill-me.
  INVOKES: CONTEXT.md updates, ADR creation, codebase cross-reference.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, run_shell_command]
---

# Grill With Docs

Socratic questioning that validates plans against project documentation and domain language.

Ask **one question at a time**. Wait for the answer. Never batch questions.

## Core approach

1. **Read the docs first.** Check `CONTEXT.md`, `CLAUDE.md`, `AGENTS.md`, `docs/adr/`, and any domain glossary files.
2. **Surface terminology conflicts.** When user language conflicts with existing glossary:
   > "Your docs define X as A, but you seem to mean B — which is correct?"
3. **Stress-test domain relationships.** Use concrete edge-case scenarios to expose imprecise boundaries.
4. **Cross-reference against code.** Flag contradictions:
   > "The code does X, but you said Y — which reflects reality?"
5. **Update docs inline.** As terms crystallize, update `CONTEXT.md` and create ADRs without waiting.

See [document formats](references/doc-formats.md) for CONTEXT.md and ADR format details.

## Document creation (lazy)

- Create `CONTEXT.md` only when the **first term** resolves.
- Create `docs/adr/NNNN-slug.md` only when an **ADR-worthy decision** is reached.

### ADR threshold — all three conditions must hold

1. Costly to reverse later
2. Future readers will question why this approach
3. Result of genuine trade-offs between alternatives

If any condition is missing, skip the ADR.

## Session flow

1. Read all existing context files
2. Ask first probing question
3. Wait for answer → update docs if a term resolves → ask next question
4. Repeat until plan is validated or user ends session
5. Summarize: what was confirmed, what changed, what remains open

## Checklist

- [ ] Read CONTEXT.md, ADRs, and domain glossary before asking anything.
- [ ] Questions asked one at a time — never batched.
- [ ] Terminology conflicts surfaced and resolved.
- [ ] CONTEXT.md updated lazily as terms crystallize.
- [ ] ADRs created only when all three threshold conditions hold.
- [ ] Session summary: confirmed items, changes, open questions.
