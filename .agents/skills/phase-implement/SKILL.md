---
name: phase-implement
description: |
  Implement stage of the delivery loop. Use for executing the approved plan step by step, opening the pull request, handing over a branch to test locally, and iterating on comments until ship it.
---

# Stage 4 — Implement and Iterate

## Preflight
```bash
jq -r '.stage, .awaiting' .workflow/<slug>/loop-state.json   # must be implement / null
rg -n 'verify:' .workflow/<slug>/plan.md                      # every step has one, or stop
```

A plan step without a `verify:` command is not executable. Send it back to `phase-plan` rather than improvising one.

## Contract
- **Entry:** `.workflow/<slug>/plan.md` with an answered questionnaire.
- **Output:** a branch, a pull request, and `progress.md` with per-step evidence and iteration rounds.
- **Human gate:** iteration continues until the user explicitly ships it.

## Workflow
1. Branch from the default branch and record `branch` in the state. **One plan step in progress at a time.**
2. Write or update the test first when the step has observable behavior, then make the minimum change.
3. Run that step's `verify:` command and paste the decisive output into `progress.md`. On failure, fix the cause — never the assertion.
4. If reality contradicts the plan, record the drift, update `plan.md`, and confirm scope changes before continuing.
5. Show the diff and ask for explicit confirmation before any push.
6. Once confirmed, use `finishing-dev` for the push and pull-request mechanics; record the number or URL in `pr`.
7. Hand over a clean test surface plus the run command. Append worktrees, test branches, and child sessions to `scratch`.
8. Increment `rounds.implement`, set `awaiting: "iterate"`, and notify.
9. Repeat until the user ships it, then set `stage: "finalize"` and `awaiting: null` in one write.

## `progress.md` Per Step
Evidence, not narration. Someone who was not here must be able to check it.

| Field | Content |
|---|---|
| Step | the plan's step number and intent |
| Change | the files actually touched |
| Command | the `verify:` command, verbatim |
| Output | the decisive lines — pass counts, the assertion, the status code |
| Result | pass, or what failed and what was done |

"Tests pass" is not evidence. The output is.

## The Handover
The user must be able to see it working without reconstructing your environment.

```bash
git worktree add ../review-412 <branch>       # a clean surface, not your working tree
cd ../review-412 && pnpm install && pnpm dev  # the exact run command they need
```

Append the worktree path to `scratch` so `phase-done` removes it. Handing over your own working tree means their next command destroys your state.

## Drift

| Situation | Action |
|---|---|
| A step turns out unnecessary | strike it in `plan.md`, record why |
| A step reveals hidden work | add it; confirm the scope change before continuing |
| The approach is wrong | stop; return the loop to `phase-plan` |
| An out-of-scope problem appears | record in `progress.md`, **do not fix it** |

That last row is the discipline. Fixing an unrelated bug opportunistically makes the diff unreviewable and the plan a fiction.

## Stop
- A `verify:` command fails. Fix the cause; never loosen the assertion to make it pass.
- The change would touch files the plan did not name. Record the drift and confirm before continuing.
- A push or pull request is about to happen without explicit confirmation. Stop and ask.

## Rules
- No push, pull request, or merge without explicit confirmation. A quiet pull request is not approval.
- Iteration rounds are the **norm**, not a failure — each one increments `rounds.implement`. That counter is the honest record of how much iteration this took.
- A red lint, type check, or test blocks progress. Not "note it and continue".
- The diff stays limited to the files the plan named. Anything else is drift that needs recording and confirming.
- On comments: fix inside the same pull request, re-verify, increment again, notify. Never open a second PR for feedback on the first.

## Checklist
- [ ] One step in progress at a time; test written first where behavior is observable.
- [ ] Every plan step verified with its decisive output captured in `progress.md`.
- [ ] Failures fixed at the cause; no assertion loosened to pass.
- [ ] Diff limited to the files the plan named; drift recorded and confirmed.
- [ ] Push and pull request confirmed by the user before either happened.
- [ ] PR open with local run instructions; `branch` and `pr` recorded in the state.
- [ ] Test surface handed over clean, its artifacts listed in `scratch`.
- [ ] Rounds counted in `rounds.implement` until an explicit ship-it.
