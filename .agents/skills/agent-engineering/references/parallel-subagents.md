
# Parallel Subagents

## Preflight
```bash
git status --porcelain              # a dirty tree cannot be split; workers will collide on it
git worktree list                   # isolation that already exists
rg -l 'sharedModule' src/ | wc -l   # files two slices would both edit — the collision count
```

Count the overlap before spawning anything; one shared file turns concurrency into a merge you pay for twice.

## What Actually Parallelizes

| Work | Fan out? | Why |
|---|---|---|
| Read-only search across many directories | yes | No writes, no shared state |
| One failing test per file, unrelated files | yes | Disjoint edits, independent verdicts |
| Review of one diff along separate dimensions | yes | Same input, different lenses |
| Independent doc pages or eval fixtures | yes | Append-only, no cross-reads |
| A feature that lands in one shared module | **no** | Serialized writes wearing a parallel costume |
| Refactor plus its call sites | **no** | Step two needs step one's output |
| Exploratory debugging | **no** | Each finding changes the next question |
| Anything whose slices you cannot name yet | **no** | Cut the work first, then decide |

## Workflow
1. Name every slice, its owned files, and what blocks it. Slices form a task graph, not a list; the **frontier** is what nothing blocks, and only the frontier launches.
2. Kill the overlaps: merge two slices that touch the same file into one, or serialize them.
3. Write the brief per worker (table below). Ambiguity does not average out across workers — it multiplies.
4. Give every **writing** worker its own worktree or branch. Read-only workers share the tree safely.
5. Set the ceiling before launching: worker count, wall-clock, and what happens when one returns nothing.
6. Launch the whole frontier in one dispatch, and dispatch again as landed slices unblock new ones. Staggering inside a frontier serializes the wait for no benefit.
7. Collect structured reports, then verify every claim against the tree, never against the report.
8. Integrate serially, in dependency order, and run the full suite **once** after the last merge.

## The Brief Each Worker Gets

| Field | Why it exists |
|---|---|
| Goal, one sentence | The worker cannot ask a follow-up mid-run |
| Files it owns | The only place it may write |
| Files it must not touch | Prevents helpful drive-by edits that conflict |
| Done condition, as a command | `pnpm test path/to/file` beats "make it work" |
| Report shape | Same fields from every worker, so results compare |
| What to do when blocked | Report and stop, never improvise |
| Pointers, not copies | Point at the spec, the ticket, the notes file; pasted context drifts from its source |

```bash
git worktree add ../wt-slice-a -b slice-a   # one per writing worker
git worktree remove ../wt-slice-a           # after the merge, always
```

## Staged Delivery with Checkpoints

Reserve this for big, risky changes: stages that depend on each other, a change that cuts across the codebase, or a migration that must not land partially. A high file count alone does not qualify.

1. The coordinating agent plans, dispatches, and merges results; implementation goes to workers by default.
2. Split the work into a few stages that follow real dependencies and shippable boundaries, and end each stage with a required review checkpoint. Never cut a stage smaller only to make its review easier.
3. Do not start the next stage while a worker it depends on is still running or a returned result has not been merged into the plan. With nothing independent left to do, wait for the completion notice instead of polling.
4. Give the checkpoint reviewer the stage goal, the changed paths, the validation output, the research already accepted, and file pointers, so it judges known context instead of rediscovering it.
5. **One review per checkpoint, plus at most two follow-up reviews.** Ask for a follow-up only when the fix changes what was reviewed in substance, or the original concern could not be checked. Needing a third means the brief or the plan is wrong: stop and report.
6. Commit at the end of every stage that can ship on its own.
7. Keep the stage-progress file out of the project diff and ignored by git.

## Failure Modes Beyond File Overlap
Two workers never touching the same file is not the same as two workers being safe to run together.

| Failure | Mechanism | Mitigation |
|---|---|---|
| Context poisoning crosses the trust boundary | A subagent's tool call returns attacker-controlled or simply wrong content; the subagent folds it into a confident-sounding report; the parent treats that report as verified fact instead of one more hop of untrusted content | Verify any claim that will trigger a further tool call or a write against the tree itself, the same way a "done" claim gets verified — never against the report alone |
| Race condition on a shared resource | Two workers write disjoint files but both increment a counter, append to one log, bind the same port, or draw on one rate-limit budget that neither brief named as owned | Preflight lists every external resource, not only files; a resource neither worker can own outright is a serialization point, not a fan-out point |

## Stop
- Two slices write the same file. Serialize them.
- A worker reports done with no command output behind it. Treat that as unverified, not done.
- Slices came back contradicting each other. Reconcile the premise before merging — one worked from a wrong assumption.
- The work is exploratory. One agent iterating beats five guessing in parallel; route back to defect diagnosis in `observability`.
- Fan-out only to look fast. Cost scales with workers; wall-clock does not.

## Rules
- A worker sees none of the others' context. Every fact it needs must be in its brief or reachable from the repo.
- Verify before integrating. The report is a claim; the diff and the test run are the evidence.
- Use an independent checker when risk, uncertainty, or conflicting findings justify it; otherwise a reproducible scoped check is sufficient.
- Read-only fan-out is cheap and safe — reach for it first; it is also the main lever on context pressure ([context-engineering](context-engineering.md)).
- Never silently re-dispatch a failed slice; the brief is usually what was wrong.
- Depth beats width. Three well-briefed workers land more than ten vague ones, at half the cost.
- Keep integration serial even when the work was parallel; concurrent merges turn a green branch red with nobody at fault.
- The orchestrator may do independent read-only work when it can still track worker ownership and reports.
- Building the agent runtime, its tool schemas, or its guardrails is a different job — that is `agent-engineering`.

## Excuses

| Excuse | Why it is false |
|---|---|
| "The slices barely overlap" | One shared file is a merge conflict you scheduled on purpose |
| "The worker reported it finished" | A report is a claim; the diff and the test run are the evidence |
| "More workers means it lands sooner" | Cost scales with workers; wall-clock only scales with disjoint slices |
| "That slice failed, send a fresh worker" | Re-dispatching without reading the failure repeats the brief that caused it |
| "I will cut the slices as I go" | A slice you cannot name yet is not a slice |

## Checklist
- [ ] Slices named, disjoint by file, and cut before any worker launched.
- [ ] Every writing worker isolated in its own worktree or branch; worktrees removed after merge.
- [ ] Each brief carries goal, owned files, forbidden files, a done command, and a report shape.
- [ ] Worker count and wall-clock ceiling set in advance.
- [ ] Every claim verified against the tree, not the report.
- [ ] Integration done serially, full suite green once after the last merge.
