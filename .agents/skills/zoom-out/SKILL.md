---
name: zoom-out
description: |
  **ARCHITECTURE SKILL** - Stop and get broader architectural context before implementing. Produces a conceptual map of relevant modules and their relationships using domain terminology.
  USE FOR: when unfamiliar with a code section, before a significant change, when the solution feels wrong, when you need to understand integration points.
  DO NOT USE FOR: trivial one-liner changes, when the scope is already fully understood.
  INVOKES: codebase exploration, domain glossary, ADR review.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, run_shell_command]
---

# Zoom Out

Tell the agent to zoom out and give a broader architectural perspective before proceeding.

Use when unfamiliar with a code section, when integration points are unclear, or when the proposed solution feels like it might be solving the wrong problem.

## What to produce

A conceptual map of the relevant system area that covers:

1. **Domain language** — key terms and concepts used in this area (check `CONTEXT.md` or equivalent domain docs)
2. **Module boundaries** — what each module owns, what it exposes, what it consumes
3. **Integration points** — how modules communicate (events, function calls, shared types, APIs)
4. **ADRs in scope** — any architecture decisions that constrain the area being changed
5. **Current path** — where the user's proposed change sits within this map
6. **Tension check** — does the proposed approach align with the existing architecture, or does it cut across concerns?

## Process

1. Explore the codebase starting from the entry points related to the task.
2. Read `CONTEXT.md`, `CLAUDE.md`, `AGENTS.md`, or any domain glossary files.
3. Check `docs/adr/` for relevant decisions.
4. Map module dependencies — who imports whom.
5. Produce the conceptual map in plain language using the project's own terminology.
6. State clearly: "Given this architecture, the proposed approach is / is not aligned because..."

## Output format

```
## Module Map: [area name]

### Modules
- **ModuleA** — owns X, exposes Y, consumes Z
- **ModuleB** — ...

### Integration points
- A → B via [event / call / type]

### Relevant ADRs
- ADR-0003: [brief summary and implication]

### Assessment
The proposed change [fits cleanly / cuts across / conflicts with] this architecture because [reason].
Recommended adjustment (if any): ...
```

## When to recommend stopping

If the proposed approach conflicts with the architecture in a way that would require significant rework, say so **before** any implementation begins. It is cheaper to redirect now than to rewrite after.

## Checklist

- [ ] Read CONTEXT.md, CLAUDE.md, AGENTS.md, and any domain glossary.
- [ ] Checked docs/adr/ for relevant decisions.
- [ ] Module map produced using project's own terminology.
- [ ] Assessment states whether proposed approach aligns with architecture.
- [ ] Recommendation given before any implementation begins.
