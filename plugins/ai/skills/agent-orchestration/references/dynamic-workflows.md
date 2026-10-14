# Dynamic Workflows

Open this when a task needs more than one agent and a fixed script would not fit it: the orchestration itself should be written for this problem. Source: [a harness for every task](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/).

## Preflight
```bash
ls ~/.claude/workflows .claude/workflows 2>/dev/null   # saved workflows worth reusing
git worktree list                                       # isolation for writing agents
```

## Why Not One Long Context

| Failure in a single long run | Mechanism | Workflow answer |
|---|---|---|
| Agentic laziness | Declares done after partial progress on a many-part task | One agent per unit; the orchestrator counts units, not vibes |
| Self-preferential bias | Grades its own output favorably | Separate verifier with a clean context and a rubric |
| Goal drift | Fidelity to the original objective erodes across turns and compaction | Each subagent gets the original goal verbatim and one discrete unit |

## Primitives (Claude Code Workflow runtime)

| Call | Does | Use for |
|---|---|---|
| `agent(prompt, { schema, model, isolation, agentType })` | spawns one subagent; `schema` returns validated JSON | any unit; `isolation: "worktree"` when it writes |
| `parallel([...thunks])` | fans out and waits for all | independent units |
| `pipeline(items, stageA, stageB)` | streams items through stages | review then verify, without waiting for the slowest reviewer |

Other clients: the same shapes work with the Agent SDK or headless `claude -p`, but those are static scripts. A dynamic workflow is written for this task, so its fan-out and verification match this task's edge cases.

## Patterns by Use Case

| Use case | Shape |
|---|---|
| Migration or rename | one unit per call site or module in its own worktree, one adversarial reviewer per fix, avoid heavyweight commands so units parallelize |
| Deep research | fan out searches, fetch sources, verify each claim separately, synthesize a cited report |
| Deep verification | extract claims to a list, one verifier per claim, optional source auditor behind each |
| Sorting many items | tournament bracket, fresh judge per pairwise comparison; only the running order stays in context |
| Rule adherence | one verifier per rule in a clean context, plus a skeptic pass to cut false positives |
| Root cause | hypothesis agents over disjoint evidence (logs, code, data), each hypothesis faced by a verifier panel |
| Triage at scale | quarantine: read-only classifiers see untrusted content; a separate actor with privileges sees only their summaries |
| Taste-based work | generate variants, grade against a rubric, order by tournament |
| Skill or prompt evals | one worktree per variant, a comparison agent grades against a rubric |
| Model routing | a cheap classifier estimates complexity, then routes to the smaller or larger model |

## Prompt Shapes That Work
- "This test fails about 1 in 50 runs. Set up a workflow to reproduce it. Form competing theories about the race, and don't stop until one theory survives the evidence."
- "Go through this draft and verify every technical claim against the codebase using a workflow."
- "Use a workflow to rank these candidates against a rubric and double-check the top ten. Interview me for the rubric first."
- "Brainstorm options with a workflow and run a tournament to pick the top three."

State a token budget when cost matters ("use about 10k tokens"). Combine with a goal (run until the condition holds) or a loop (repeat on an interval). Save a workflow that proved useful and reference it from the owning skill.

## Stop
- A regular coding task. A panel of reviewers on a one-file fix is spend without signal.
- Units cannot be named or overlap by file.
- The verifier would share the author's context. Give it a clean one or skip the verification claim.

## Checklist
- [ ] The failure mode the workflow prevents is named.
- [ ] Every writing unit isolated; every verifier independent of its author.
- [ ] Structured output (`schema`) for anything the orchestrator aggregates.
- [ ] Token budget and stop condition stated up front.
