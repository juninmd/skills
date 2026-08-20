---
name: phase-implement
description: |
  Implement stage of the delivery loop. Use for executing the approved plan step by step, opening the pull request, handing over a branch to test locally, and iterating on comments until ship it.
---

# Stage 4 — Implement and Iterate

## Contract
- Entry: `.workflow/<slug>/plan.md` with answered questionnaire.
- Output: a branch, a pull request, and `progress.md` with per-step evidence and iteration rounds.
- Human gate: iteration continues until the user explicitly ships it.

## Workflow
1. Branch from the default branch. Keep exactly one plan step in progress at a time.
2. Write or update the test first when a step has observable behavior, then make the minimum change.
3. Run that step's `verify:` command and paste the decisive output into `progress.md`. On failure fix the cause, never the assertion.
4. If reality contradicts the plan, record the drift, update `plan.md`, and confirm scope changes before continuing.
5. Open the pull request: what changed, why, how to run it locally, and screenshots for UI work.
6. Hand over a clean test surface — a separate session or a worktree with the PR branch checked out — plus the exact run command.
7. Set `awaiting: "iterate"` and notify. On comments, fix inside the same PR, re-verify, log the round, and notify again.
8. Repeat until the user ships it, then set `stage: "finalize"`.

## Rules
- Never merge here, and never treat a quiet PR as approval.
- Iteration rounds are the norm; the first implementation is not expected to be final.
- Out-of-scope problems are reported in `progress.md`, not fixed opportunistically.
- A red lint, type check, or test blocks progress.

## Checklist
- [ ] Every plan step verified with output captured.
- [ ] Tests cover new behavior, including failure paths.
- [ ] Diff limited to the files the plan named.
- [ ] PR open with local run instructions.
- [ ] Test branch handed over on a clean surface.
- [ ] Iteration rounds logged until an explicit ship-it.
