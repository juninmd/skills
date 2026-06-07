---
name: prototype
description: |
  **EXPLORATION SKILL** - Build disposable code to answer a specific design or logic question quickly.
  USE FOR: validating state machines, exploring UI variations, resolving design ambiguity before committing to implementation.
  DO NOT USE FOR: production code, tasks with already-clear designs, when shipping is the goal.
  INVOKES: throwaway terminal apps (logic) or variant UI routes (UI exploration).
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, run_shell_command]
---

# Prototype

A prototype is disposable code designed to answer a specific question about design or logic.

**Before starting:** State the question in one sentence:
> "Does [state model / UI layout / algorithm] actually handle [edge case / scenario]?"

If you can't state the question, think more first — you don't need a prototype yet.

## Path A — Logic Prototype (terminal app)

Use when the question is about state machines, business logic, or data model correctness.

See [logic prototype guide](references/logic-prototype.md).

**Key structure:**
```
[feature-name]-proto/
  index.ts    # TUI shell — throwaway
  logic.ts    # Pure logic module — the bit worth keeping
  README.md   # "Prototype — delete after [question] is answered"
```

**Non-negotiable:** `logic.ts` is a pure module. The TUI imports it; nothing flows the other direction.

## Path B — UI Prototype (variant switcher)

Use when the question is about layout, information hierarchy, or primary affordance.

See [UI prototype guide](references/ui-prototype.md).

- **Shape A (preferred):** Variants on existing route via `?variant=N` URL parameters
- **Shape B (fallback):** Dedicated throwaway route
- Aim for 3 variants; cap at 5
- Each variant must differ in **structure**, not just colors

## Completion

1. Document the question and answer (ADR, PR description, or comment) before deletion.
2. Extract validated logic into real code if worth keeping.
3. Delete the prototype directory entirely.

The lessons stay. The code goes.

## Checklist

- [ ] Question stated in one sentence before starting.
- [ ] Prototype clearly marked as throwaway (README with deletion note).
- [ ] Logic path: pure logic module separated from TUI shell.
- [ ] UI path: variants differ structurally, not just cosmetically.
- [ ] No tests, no error handling, no generalization.
- [ ] Question answered and documented before prototype is deleted.
- [ ] Prototype directory deleted after extraction.
