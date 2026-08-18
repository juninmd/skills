---
name: ui-state-design
description: |
  Design every state a screen can be in, not just the happy one. Use for loading skeletons, empty states, error and retry, partial and stale data, offline behavior, optimistic updates, form validation feedback, and confirming destructive actions.
---

# UI State Design

## Workflow
1. Enumerate the states before writing markup: idle, loading, empty, partial, error, stale, offline, and success.
2. Decide what the user sees and can do in each one, including which controls stay enabled.
3. Model state as one value with named cases, not a pile of independent booleans that can contradict each other.
4. Choose the loading treatment by expected wait: nothing under 200ms, a skeleton that matches the final layout beyond that.
5. Make errors recoverable — say what failed, whether it retries itself, and give the user the action that fixes it.
6. Walk the screen once per state with real data, including the slow and failing paths, before calling it done.

## Rules
- `isLoading` plus `isError` plus `data` allows states that make no sense. One discriminated status field cannot lie.
- An empty state is a first-run experience: explain what goes here and give the action that creates it. Never ship a blank panel.
- Distinguish "no results" from "no data yet" from "request failed"; they look alike and need different words.
- Spinners that replace the whole page throw away context. Keep the layout and mark the region that is updating.
- Optimistic updates need a defined rollback and a visible failure; silent reversion reads as data loss.
- Validate on blur and on submit, not on every keystroke; show the message next to the field that caused it.
- Destructive actions get a confirmation that names the target, or an undo window. Prefer undo.
- Disable a submit control while in flight and keep its width stable so the layout does not jump.

## Checklist
- [ ] Every state is enumerated and has a defined appearance.
- [ ] Status is one value with named cases, not conflicting booleans.
- [ ] Errors are recoverable and destructive actions are reversible.
