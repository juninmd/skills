
# Incremental Delivery

## Preflight
```bash
git log --oneline origin/main..HEAD | wc -l    # how long has this branch been alive
git diff --stat origin/main...HEAD            # is this still one slice?
rg -n 'featureFlag|isEnabled\(' src/ | head    # what flags already exist
```

Describe the end state and find the thinnest path a real user could exercise before slicing anything.

## Workflow
1. Describe the end state, then find the thinnest path through it a real user could exercise.
2. Build that path end to end as a tracer bullet — real boundaries, narrow behavior, no stubs.
3. Slice the rest vertically. Each slice crosses every layer it needs and leaves the system working.
4. Order slices by **uncertainty removed**, not by ease of writing. The scary slice goes first, while there is still time to be wrong.
5. Choose the landing discipline per slice (below).
6. A slice with a schema change slices the data too — delegate the expand/backfill/contract shape to `migration-engineering`.
7. After each slice, re-plan from what you learned instead of executing a plan written before you knew anything.

## Vertical, Not Horizontal

| Horizontal (lies) | Vertical (ships) |
|---|---|
| All models → all endpoints → all UI | One entity, end to end, for one user action |
| Demonstrates nothing until the last week | Demonstrates something on day one |
| Integration risk discovered at the end | Integration risk discovered first |
| Cannot be released partway | Every step is releasable |

A step that only makes sense together with the next one is not a step.

## Tracer Bullet
Real boundaries, narrow behavior, no stubs: one request travels the whole system and comes back. It proves the wiring, the deploy, and the assumptions — the three things a design document cannot.

**Decide up front whether the tracer ships.** Nobody ever comes back to replace it; if you do not choose, it becomes production by default.

## Landing Discipline

| Situation | Land it as |
|---|---|
| Default | Trunk the same day, flagged off if not ready to be seen |
| Slice blocked on unmerged review of the previous one | Stacked PR — shallow, merged bottom-up, whole stack rebased after each merge |
| Cannot be reverted alone | **Split it** — this is the signal, not an exception |
| Needs a week of work before anything runs | Wrong slice; find a thinner path |

A branch living longer than a day or two is a merge conflict accruing interest.

## Feature Flags Are Code You Must Test

| Rule | Why |
|---|---|
| Default off, and the off path is what is already in production | The flag adds no risk until deliberately flipped |
| Exercise the **on** path in CI | Otherwise the flagged code breaks the day someone enables it |
| Flip the kill switch once in a real environment before shipping | An untested rollback is not a rollback |
| Record the removal condition when you add it | Otherwise the flag is permanent, and so is the dead branch behind it |

## Stop
- A slice cannot be reverted on its own. Split it; this rule has no exceptions worth taking.
- The branch has lived longer than a day or two. Land what is green behind a flag rather than growing it.
- A flag is being added with no removal condition. Write the condition, or the dead branch behind it is permanent.

## Rules
- Every step leaves the build green and the product usable.
- No abstraction on slice one. Wait for the third case to show what actually varies; slice two is usually a coincidence.
- If a slice cannot be reverted alone, split it. This rule has no exceptions worth taking.
- Work in progress behind a flag still costs review, merge conflicts, and cognitive load. Ship it or delete it — do not park it.
- The plan after slice three should differ from the plan before slice one. If it does not, the slices were not teaching you anything.
- Sequencing the delivery is here; executing the pull requests belongs to `finishing-dev`, and running the full stage loop to `dev-loop`.

## Checklist
- [ ] End state described, and the thinnest exercisable path identified.
- [ ] First slice runs end to end through real boundaries, no stubs.
- [ ] Slices ordered by uncertainty removed; the scary one first.
- [ ] Every step ships independently and leaves trunk releasable.
- [ ] Every slice revertible alone; anything that is not was split.
- [ ] Each flag has an exercised on-path, a tested kill switch, and a written removal condition.
