---
name: parallel-subagents
description: |
  Split one task into concurrent subagents and merge their output safely. Use for fanning out independent fixes, writing the brief each parallel worker gets, isolating writers so they cannot collide on a file, and capping the spend.
---

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

## Stop
- Two slices write the same file. Serialize them.
- A worker reports done with no command output behind it. Treat that as unverified, not done.
- Slices came back contradicting each other. Reconcile the premise before merging — one worked from a wrong assumption.
- The work is exploratory. One agent iterating beats five guessing in parallel; route back to `diagnostics`.
- Fan-out only to look fast. Cost scales with workers; wall-clock does not.

## Rules
- A worker sees none of the others' context. Every fact it needs must be in its brief or reachable from the repo.
- Verify before integrating. The report is a claim; the diff and the test run are the evidence.
- Use an independent checker when risk, uncertainty, or conflicting findings justify it; otherwise a reproducible scoped check is sufficient.
- Read-only fan-out is cheap and safe — reach for it first; it is also the main lever on context pressure (`context-engineering`).
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
