
# Stage 3 — Plan

## Preflight
```bash
ls .workflow/<slug>/research.md .workflow/<slug>/prototype.md 2>/dev/null
jq -r '.stage' .workflow/<slug>/loop-state.json
```

Enumerate every unresolved decision before writing the first question. A questionnaire assembled as you go becomes three rounds.

## Contract
- **Entry:** `.workflow/<slug>/research.md` and `prototype.md` with the selected variant. On the fast path, the request alone.
- **Output:** questionnaire, answers, and `plan.md`.
- **Human gate:** the loop stops until the questionnaire is answered.

## Workflow
1. Enumerate every unresolved decision: scope boundary, data model, migration, permissions, edge cases, UX states, rollout.
2. Shape and batch them into **one** questionnaire with `requirements-clarification`.
3. Set `awaiting: "questionnaire"` and stop. Accept the answers as a single submission.
4. Decide autonomously whether blocking ambiguity remains. If it does, emit exactly **one** more batched round; otherwise proceed without asking.
5. Write `plan.md`: chosen approach, rejected alternatives with the evidence that decided them, ordered steps.
6. Restate the acceptance criteria there, marking anything the answers changed since `research.md`.
7. Give every step an intent, its files, a `verify:` command, and the expected result.
8. Name the tests to add — unhappy paths included — plus rollback and any step needing confirmation.
9. Set `stage: "implement"` and `awaiting: null` in the same write.

## The Questionnaire
Every question is answerable by picking, and carries a recommended default so silence still moves the work.

```
1. Empty cart at checkout:     (a) 422 CART_EMPTY [default]  (b) 200 empty body  (c) 400
2. Duplicate submit in 5s:     (a) idempotent, return first [default]  (b) 409  (c) both
3. Existing violating rows:    (a) grandfather [default]  (b) migrate  (c) reject on next write
4. Rollout:                    (a) flag off, enable per tenant [default]  (b) ship on
```

Batching is mandatory. Single-question ping-pong turns a five-minute decision into three days of calendar time — it is the failure mode this stage exists to remove.

## What a Step Looks Like

| Field | Example |
|---|---|
| Intent | Reject checkout when the cart is empty |
| Files | `src/checkout/validate.ts`, `src/checkout/validate.test.ts` |
| `verify:` | `pnpm vitest run src/checkout/validate.test.ts` |
| Expected | 2 tests pass; empty cart returns 422 with code `CART_EMPTY` |
| Confirm first? | no |

A step without a verification command is not a step. It is an intention with a checkbox, and it will be marked done without evidence.

## `plan.md` Skeleton

| Section | Contains |
|---|---|
| Approach | what was chosen, in one paragraph |
| Rejected alternatives | each with the evidence that decided against it |
| Acceptance criteria | restated, with changes from `research.md` marked |
| Steps | ordered, each with intent, files, `verify:`, expected result |
| Tests | including the unhappy paths, named |
| Rollback | how each step is undone |
| Backlog | everything cut from scope, so it is not silently lost |

## Stop
- A decision is still open after two batched rounds. The questionnaire was wrong — re-enumerate rather than asking a third time.
- A step has no `verify:` command. It is not a step; rewrite it.
- Code is about to be written here. Stop — this stage plans, and writing skips the confirmation the loop exists to collect.

## Rules
- `plan.md` is the authority on acceptance criteria. It supersedes `research.md` wherever the two disagree; name any `research.md` criterion the plan drops.
- Scope is the smallest slice meeting the acceptance criteria. The rest goes to the backlog section — visibly, not silently.
- **No code is written in this stage.** Writing it here skips the confirmation the loop exists to collect.
- Record rejected alternatives with evidence. Without the reason, the same alternative gets re-proposed at review by someone who was not here.
- One extra batched round is allowed for blocking ambiguity. A third round means the questionnaire was wrong, not the answers.

## Checklist
- [ ] Every open decision enumerated before any question was asked.
- [ ] All questions issued in one batch, each with a recommended default.
- [ ] Answers received; blocking ambiguity resolved in at most one extra round.
- [ ] Acceptance criteria restated in `plan.md`, changes from `research.md` marked.
- [ ] Approach and rejected alternatives justified by evidence.
- [ ] Every step names files, a `verify:` command, and an expected result.
- [ ] Tests, rollback, confirmation-required steps, and the cut backlog all written down.
- [ ] No code written; `awaiting` cleared in the same write as the stage advance.
