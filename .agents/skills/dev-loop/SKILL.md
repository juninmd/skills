---
name: dev-loop
description: |
  Orchestrate the end-to-end delivery loop across research, prototype, plan, implement, and finalize stages. Use for autonomous dev loop execution, stage handoffs, vertical slicing, prototype variants, and task tracking.
---


# Dev Loop Driver

This skill dispatches. It never does the stage's work itself.

## Preflight
```bash
ls .workflow/*/loop-state.json 2>/dev/null
jq '{slug, stage, awaiting, rounds, skipped}' .workflow/<slug>/loop-state.json
```

The state file on disk is the truth. Never dispatch from what you remember it said.

## Workflow — Dispatch
1. A request with no matching workspace → start a new loop at phase-research.
2. Later entry: work with no direction or UX decision (bugfix, refactor, mechanical change) may start at `plan`, or at a stage the user names. Record every bypassed stage in `skipped`.
3. A slug, an issue number, or nothing → load `.workflow/<slug>/loop-state.json`. Several active and none named: list them and ask.
4. `awaiting` is set → the user's message answers **that** gate. Route it to the owning skill, then continue.
5. Otherwise, run the skill that owns the current `stage`.

| stage | skill | after it returns |
|---|---|---|
| `research` | phase-research | chain automatically |
| `prototype` | phase-prototype | **stop** — variant selection |
| `plan` | phase-plan | **stop** — questionnaire answers |
| `implement` | phase-implement | **stop** — iterate or ship it |
| `finalize` | phase-finalize | chain automatically |
| `done` | phase-done | **stop** — human review and merge |

## Reference Routing

```bash
ls .workflow/*/loop-state.json 2>/dev/null           # which loops exist
jq '{slug, stage, awaiting, rounds, skipped}' .workflow/<slug>/loop-state.json
```

| Field | Means |
|---|---|
| `stage` | which skill owns the next turn |
| `awaiting` | non-null: the loop is stopped, waiting on that answer |
| `rounds` | iteration counters per stage — prototype and implement expect several |
| `skipped` | stages bypassed at entry, and why |
| `scratch` | prototypes, worktrees, test branches — everything phase-done must clean up |

## Chain or Stop

| Condition | Action |
|---|---|
| `awaiting` is null **and** `stage` advanced | chain into the next stage |
| `awaiting` is set | stop; report the pending decision |
| `stage` unchanged after the skill ran | **stall** — stop and report; never retry blindly |
| Red gate | stop and report the failure verbatim |

A red gate is a failing test, red CI, a blocking lint or type error, or the user rejecting the stage output.

## Recovery

| Symptom | Do |
|---|---|
| `loop-state.json` unparseable | stop; show the file; never rewrite it silently |
| Two workspaces for the same issue | list both and ask which is live |
| `awaiting` set but the user's message does not answer it | re-ask the pending question; do not advance |
| Stage skill errored mid-run | report where it stopped; the state file is the truth, not memory |

Contract, gates, and full recovery detail: [loop-state.md](references/loop-state.md)

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- `loop-state.json` is unparseable. Show it; never rewrite it silently.
- `stage` did not advance after the stage skill ran. That is a stall — report it, never retry.
- Two workspaces match the same issue. List both and ask which is live.

## Rules
- Hand off requirements to `project-lifecycle`, verification suites to `test-engineering`, and release tagging to `git-workflow`.
- Re-read `loop-state.json` from disk after every stage. Never trust what you remember it said — a stage skill may have written to it.
- One skill per stage per pass. Never reorder stages, and reopen an earlier one only when the user names it.
- Never commit, push, merge, or deploy on the loop's own authority. Those gates belong to their stages and to the user.
- Report a stall instead of retrying. A retried stall repeats the failure and buries its cause.
- On every stop, report three things: the stage reached, what is pending, and the decision needed.
- Standalone delivery outside a loop belongs to finishing-dev; standalone planning to `project-lifecycle`.

## Checklist
- [ ] Workspace resolved or created; `loop-state.json` parsed and valid.
- [ ] Entry stage justified; bypassed stages recorded in `skipped`.
- [ ] Only the current stage's skill ran.
- [ ] State re-read from disk between stages.
- [ ] Unattended stages chained; every gate stopped the loop.
- [ ] Stalls and red gates reported verbatim, never retried.
- [ ] Stop message names the stage, what is pending, and the decision needed.
