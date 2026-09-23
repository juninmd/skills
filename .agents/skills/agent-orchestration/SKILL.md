---
name: agent-orchestration
description: |
  Coordinate multi-agent work: fan-out subagents, dynamic workflows, adversarial verification, tournaments, multi-model councils, and long unattended runs. Use for parallel audits or migrations, verifying subagent claims, goal or loop runs with stop rules and a task file, and supervising headless agents through auth expiry and quotas.
---

# Agent Orchestration

**Not this skill:** building the agent runtime, its tool schemas, guards, or MCP servers (`agent-engineering`), writing a skill (`skill-authoring`), or a single-threaded bug hunt (`observability`).

## Preflight
```bash
git status --porcelain | head       # a dirty tree cannot be split safely between writers
git worktree list                   # isolation that already exists
ls TASKS.md .workflow/ 2>/dev/null  # a run already in progress keeps its state here
```

Name the units of work and their owned files before spawning anything. A unit you cannot name is not ready to hand to a worker.

## Workflow
1. Ask whether the task needs more compute at all. Most coding tasks do not need a panel of reviewers; orchestration earns its token cost only on breadth, isolation, or independent judgment.
2. Pick the pattern from the table below, then cut the work into units with disjoint file ownership.
3. Write one brief per worker: goal, owned files, forbidden files, done command, report shape, what to do when blocked.
4. Give every writing worker its own worktree; read-only workers share the tree.
5. Set the ceiling before launch: worker count, token budget, wall clock, and the stop condition.
6. Verify each report against the tree or an independent verifier before accepting it; a report is a claim.
7. Integrate serially, run the full suite once, and end with one table: unit, result, evidence.

## Pick the Pattern

| Situation | Pattern | Guards against |
|---|---|---|
| Mixed inputs needing different handling | classify, then act | one prompt stretched over unlike cases |
| Many independent units (services, call sites, tests) | fan out, then synthesize | agentic laziness: stopping after partial progress |
| Output that must be right (claims, fixes, findings) | adversarial verification against a rubric | self-preferential bias when judging its own work |
| Open design or naming space | generate, then filter; or tournament | settling on the first idea |
| Unknown amount of work (bugs, flaky race) | loop until no new findings | declaring done early |
| Many turns, likely compaction | goal plus task file, fresh subagent per unit | goal drift across long runs |
| Untrusted inputs driving privileged actions | quarantine: read-only classifiers, separate actor | prompt injection reaching a privileged tool |

Details, runtime primitives, and verbatim prompt shapes: [dynamic-workflows.md](references/dynamic-workflows.md).

## Brief Shape
```text
Audit every service in services/ for <bug>. One subagent per service.
When a subagent reports back, check its evidence before accepting it.
Finish with one table: service | affected yes/no | evidence.
Done means: every service has a row backed by a file:line or a command result.
```

## Stop
- Two units write the same file. Serialize them.
- A worker reports done with no command output behind it. Treat it as unverified.
- Results contradict each other. Reconcile the premise before merging.
- The work is exploratory debugging where each finding changes the next question. One agent iterating beats five guessing.
- A destructive or outward-facing step (delete, force-push, deploy, publish) is next in an unattended run. Stop and ask.

## Rules
- A worker sees none of the others' context; every fact it needs is in its brief or reachable from the repo.
- The verifier is never the author: use a fresh agent, and a different model when self-preference is the risk.
- Keep the task list in a file that is updated as units land; it survives compaction and shows progress at a glance.
- Long runs follow written stop/continue rules: continue when a step needs no input, stop only when blocked or before anything destructive. See [long-run-steering.md](references/long-run-steering.md).
- Keep permission prompts on for destructive commands, even in long unattended runs.
- Depth beats width: three well-briefed workers land more than ten vague ones, at a fraction of the cost.
- Deeper references: [parallel-subagents.md](references/parallel-subagents.md) for slicing and staged delivery, [multi-model-council.md](references/multi-model-council.md) for consensus on irreversible decisions, [headless-agent-supervision.md](references/headless-agent-supervision.md) for runs with no human attached. Map: [TOPIC_MAP.md](references/TOPIC_MAP.md).

## Checklist
- [ ] The task justified orchestration; the pattern is named.
- [ ] Units disjoint by file; writing workers isolated in worktrees, removed after merge.
- [ ] Each brief has goal, owned and forbidden files, done command, report shape.
- [ ] Worker count, token budget, and stop condition set before launch.
- [ ] Every accepted claim verified against the tree or by an independent verifier.
- [ ] Task file current; final table lists unit, result, and evidence.
