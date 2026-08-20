---
name: phase-finalize
description: |
  Finalize stage of the delivery loop, unattended. Use for hardening a shipped pull request by making two reviewers spar over it, each refuting the other, and resolving whatever survives before code review.
---

# Stage 5 — Finalize

## Contract
- Entry: a shipped PR and `.workflow/<slug>/progress.md`.
- Output: `evidence.md` with both critiques, refutations, fixes, and gate results.
- Unattended stage; advance to `phase-done` when the diff is production-ready.

## Workflow
1. Run two independent reviewers over the full PR diff with different lenses — correctness and regressions versus security, ops, and API contract.
2. Have each reviewer attempt to refute the other's findings with evidence from the code. Drop refuted findings; keep survivors.
3. Rank survivors as blocking, should-fix, or note.
4. Fix blocking and should-fix items inside the same PR; leave notes as PR comments rather than silent scope creep.
5. Re-read the final diff: remove debug output, stray comments, and anything the plan did not call for.
6. Run the full gate — format, lint, type check, unit and integration tests, build — and capture the commands and output.
7. Re-verify every acceptance criterion from `research.md`; each passes or is explicitly deferred.
8. Check secrets, authz boundaries, migrations, backward compatibility, and observability.
9. Write `evidence.md` and set `stage: "done"`.

## Rules
- No finding is accepted or dismissed without a refutation attempt; agreement between reviewers is not proof.
- Report red gates verbatim; never claim done while one is failing.
- Fixes stay inside the reviewed scope.
- Secrets stay out of commits, logs, and summaries.

## Checklist
- [ ] Two independent critiques run with different lenses.
- [ ] Each finding survived or was refuted with evidence.
- [ ] Blocking and should-fix items resolved in the PR.
- [ ] Full gate run with output captured in `evidence.md`.
- [ ] Acceptance criteria passed or explicitly deferred.
- [ ] Residual risk stated.
