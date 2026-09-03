---
name: phase-finalize
description: |
  Finalize stage of the delivery loop, unattended. Use for hardening a shipped pull request by making two reviewers spar over it, each refuting the other, and resolving whatever survives before code review.
---

# Stage 5 — Finalize

## Preflight
```bash
git diff --stat <base>...HEAD
git diff <base>...HEAD | rg -n 'console\.log|debugger|TODO|XXX|FIXME'   # debris before review
```

Both review passes run over the **full** PR diff, not over the last commit.

## Contract
- **Entry:** a shipped pull request and `.workflow/<slug>/progress.md`.
- **Output:** `evidence.md` — both critiques, the refutations, the fixes, and the gate results.
- **Unattended:** advance to `phase-done` when the diff is production-ready.

## Workflow — The Adversarial Pass
Two reviews that agree prove only that they share a blind spot. Making each refute the other is what separates a real finding from a plausible one.

| Step | Do |
|---|---|
| 1 | `expert-review` pass A: correctness and regressions |
| 2 | `expert-review` pass B: security, operations, API contract — on a **different model** when one is reachable |
| — | The two passes **never see each other's output** while reviewing |
| 3 | Feed each pass the other's findings; each must refute with evidence **from the code** |
| 4 | Drop refuted findings. Keep survivors. |
| 5 | Rank survivors: blocking · should-fix · note |

No finding is accepted **or** dismissed without a refutation attempt. "Both reviewers flagged it" is not proof; both may be reading the same wrong assumption.

## Disposition

| Rank | Means | Action |
|---|---|---|
| Blocking | data loss, security, broken contract, broken build | fix in this PR |
| Should-fix | wrong behavior on a real path, or untested risk | fix in this PR |
| Note | preference, or debt this change did not create | PR comment, never a silent fix |

Fixing a "note" quietly is scope creep with good intentions, and it makes the diff unreviewable.

## The Full Gate
Capture the commands **and** their output into `evidence.md`. A gate whose output you cannot show did not run.

```bash
pnpm format --check && pnpm lint && pnpm typecheck
pnpm test --run && pnpm test:integration
pnpm build
```

Then re-read the final diff and remove what the plan never called for: debug output, commented-out attempts, stray `console.log`, a rename that crept in.

## Final Sweep

| Check | Looking for |
|---|---|
| Secrets | anything in the diff, the logs, or the PR body |
| Authorization | a new route or field without its check |
| Migrations | destructive DDL, or one that cannot be rolled back |
| Backward compatibility | N-1 still works during the rollout |
| Observability | a new failure path with no log, metric, or trace |
| Acceptance criteria | every one from `plan.md`, passed or explicitly deferred |

`plan.md` supersedes `research.md` — and name any `research.md` criterion the plan dropped, so the drop is visible rather than lost.

## Stop
- A gate is red. Report it verbatim; never claim done while one is failing.
- A finding was accepted or dismissed without a refutation attempt. Agreement is not proof.
- A fix would reach outside the reviewed scope. Stop — it restarts the review that just finished.

## Rules
- Two reviewers on one model share its blind spots; the refutation only bites when pass B runs on a second model. Record which model answered each pass in `evidence.md`.
- Report red gates verbatim. Never claim done while one is failing, and never summarize a failure into something that sounds smaller.
- Fixes stay inside the reviewed scope. A fix outside it restarts the review that just finished.
- Secrets stay out of commits, logs, and summaries — including the evidence file.
- State residual risk explicitly. A finalize pass that found nothing and says nothing about what remains untested is not finished.

## Checklist
- [ ] `expert-review` run twice, blind to each other, on the two lenses.
- [ ] Every finding either survived a refutation attempt or was dropped with a reason.
- [ ] Survivors ranked; blocking and should-fix resolved in this PR; notes left as comments.
- [ ] Final diff re-read; debug output and unplanned changes removed.
- [ ] Full gate run with commands and output captured in `evidence.md`.
- [ ] Secrets, authorization, migrations, compatibility, and observability all swept.
- [ ] Every `plan.md` acceptance criterion passed or explicitly deferred; dropped criteria named.
- [ ] Residual risk stated.
