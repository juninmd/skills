---
name: dev-loop
description: |
  Single driver for the delivery loop: it reads the loop state file, dispatches the stage that owns the turn, and chains unattended stages. Use for starting a loop, resuming an interrupted one, or checking which stage is waiting on you.
---

# Dev Loop Driver

## Dispatch
1. With a request as argument and no matching workspace, start a new loop at `phase-research`.
2. With a slug, issue number, or no argument, load `.workflow/<slug>/loop-state.json`. If several loops are active and none was named, list them and ask which one.
3. If `awaiting` is set, the user's message is the answer to that gate: route it to the owning skill, then continue.
4. Otherwise run the skill that owns the current `stage`.

| stage | skill | after it returns |
|---|---|---|
| `research` | `phase-research` | chain automatically |
| `prototype` | `phase-prototype` | stop — variant selection |
| `plan` | `phase-plan` | stop — questionnaire answers |
| `implement` | `phase-implement` | stop — iterate or ship it |
| `finalize` | `phase-finalize` | chain automatically |
| `done` | `phase-done` | stop — human review and merge |

State contract and recovery: [loop-state.md](references/loop-state.md)

## Loop Rules
- Re-read `loop-state.json` from disk after every stage; never trust the in-memory stage.
- Chain only when `awaiting` is null and the stage actually advanced.
- If a stage runs and `stage` is unchanged, stop and report a stall — never retry blindly.
- Run at most one skill per stage per pass, and never skip or reorder stages.
- Reopen an earlier stage only when the user names it explicitly.
- On a red gate, stop the loop and report the failure verbatim.
- Never commit, push, merge, or deploy on the loop's own authority.
- On each stop, report: stage reached, what is pending, and what the user must decide.

## Checklist
- [ ] Workspace resolved or created, and `loop-state.json` valid.
- [ ] Only the skill owning the current stage was run.
- [ ] State re-read from disk between stages.
- [ ] Unattended stages chained; every gate stopped the loop.
- [ ] Stalls and red gates reported instead of retried.
- [ ] Stop message names the pending decision.
