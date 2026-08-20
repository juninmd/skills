---
name: phase-plan
description: |
  Plan stage of the delivery loop and its most intensive. Use for asking every open decision in one batched questionnaire instead of one at a time, then writing the executable plan with its verification steps.
---

# Stage 3 — Plan

## Contract
- Entry: `.workflow/<slug>/research.md` and `prototype.md` with the selected variant.
- Output: questionnaire, answers, and `plan.md`.
- Human gate: the loop stops until the questionnaire is answered.

## Workflow
1. Enumerate every unresolved decision: scope boundary, data model, migration, permissions, edge cases, UX states, rollout.
2. Emit one questionnaire containing all questions at once. Never drip them one at a time.
3. Give each question numbered options plus a recommended default, so the user can accept the whole set fast.
4. Set `awaiting: "questionnaire"` and stop. Accept the answers as a single submission.
5. Decide autonomously whether the answers leave blocking ambiguity. If they do, emit exactly one more batched round; otherwise proceed without asking.
6. Write `plan.md`: chosen approach, rejected alternatives with the evidence that decided them, and ordered steps.
7. Give every step an intent, the files it touches, a `verify:` command, and the expected result.
8. Name the tests to add, including unhappy paths, plus rollback and any step needing confirmation.
9. Set `stage: "implement"`.

## Rules
- Batching is mandatory; single-question ping-pong is the failure mode this stage exists to remove.
- A step without a verification command is not a step.
- Scope is the smallest slice meeting the acceptance criteria; the rest goes to a backlog section.
- No code is written in this stage.

## Checklist
- [ ] All questions issued in one batch with recommended defaults.
- [ ] Answers received and blocking ambiguity resolved.
- [ ] Approach and rejected alternatives justified by evidence.
- [ ] Each step names files and a `verify:` command.
- [ ] Tests, rollback, and confirmation-required steps specified.
