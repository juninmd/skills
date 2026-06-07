# Logic Prototype Guide

Build a minimal terminal app to validate state machines and business logic through interactive scenarios.

## When to use

When asking: "Does this data model actually let me represent the case where...?"

The goal is to "press buttons and watch state change" to verify that a state model handles edge cases correctly.

## Process

1. **Document the question** — write it down explicitly before writing code.
2. **Use the host project's language and tooling** — do not introduce new dependencies.
3. **Separate concerns** — `logic.ts` is a pure module (reducer, state machine, or function set). The TUI imports it and calls into it; nothing flows the other direction.
4. **Build the TUI** — renders a stable single-screen view updated each keystroke.

## TUI design

Display: current state, then available commands.

```
State: { items: ["a", "b"], mode: "edit" }

[a] add item  [d] delete item  [e] toggle mode  [q] quit
```

Show full state after each change so the user sees what shifted.

## Anti-patterns

- No tests (this is throwaway)
- No real database connections
- No generalization for hypothetical future needs
- Do not conflate logic with terminal code — the logic module is the bit worth keeping; the TUI shell is not

## After the question is answered

Extract the `logic.ts` module into production code if it encodes decisions worth keeping. Delete the TUI shell entirely.
