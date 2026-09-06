---
name: context-engineering
description: |
  Manage agent context windows: pruning, summarization, routing, and token budgets. Use for long sessions, context overflow, memory strategies, sliding windows, and keeping the right files in context.
---

# Context Engineering

## Preflight
```bash
wc -lc path/to/file           # chars/4 ≈ tokens, before opening anything
git diff --stat               # size before content
cmd > /tmp/out.log 2>&1; wc -l /tmp/out.log
```

Know the current window pressure before deciding what to read. Estimating after the paste is not estimating.

## Workflow
1. Estimate large reads before opening them; use judgment for small, targeted reads.
2. Route by volatility: invariants stay verbatim, volatile content becomes a conclusion.
3. Isolate with subagents — this is the primary lever, ahead of pruning.
4. Slide the window: recent verbatim, older folded into one running summary of decisions.
5. Persist durable state to disk so a compaction reloads it instead of rediscovering it.
6. Re-estimate at checkpoints and surface an overrun **before** it forces an uncontrolled compaction.

## Price It First

| Rule of thumb | Value |
|---|---|
| Characters per token | ~4 |
| Line of code | ~10–12 tokens |
| 200-line source file | ~2k tokens |
| Typical `npm test` output | 5k–50k tokens |
| `git diff` of a medium PR | 10k+ tokens |

```bash
wc -lc path/to/file          # lines and chars → tokens ≈ chars/4
git diff --stat              # size before content
cmd > /tmp/out.log 2>&1; wc -l /tmp/out.log   # never paste blind
```

Large artifacts should be read narrowly or summarized when context pressure warrants it.

## Volatility Routing

| Content | Keep as | Why |
|---|---|---|
| Task statement, acceptance criteria | verbatim, always | the thing being optimized against |
| Contracts, schemas, config | verbatim | exact values are load-bearing |
| Decisions and their stated reasons | verbatim | re-deriving them changes them |
| File paths, symbol names, line numbers | verbatim | unusable when paraphrased |
| Error messages, stack frames | verbatim | the literal text is the signal |
| Logs, test output, search results | **conclusion only** | volatile, huge, mostly noise |
| Large file bodies | the relevant range only | the rest is not being reasoned about |

## Subagent Isolation
A wide search run inline costs the full tool output forever. Run in a subagent, it costs only the report.

| Delegate | Keep |
|---|---|
| "Find every caller of X across the repo" | the list of callers |
| "Which of these 40 files match pattern Y" | the matching paths |
| "Read this 3k-line file and answer Z" | the answer |
| "Run the suite and triage failures" | the triage |

## Before an Overrun
Write durable state to disk **while you still have room to write it well** — a compaction that catches you unprepared loses exactly the reasoning you needed.

```
.workflow/<slug>/state.md
  goal · decisions made and why · files touched (path:line)
  open questions · next concrete step · what has been ruled out
```

## Stop
- A read would exceed the remaining window. Delegate it to a subagent or summarize it first — never paste and hope.
- A summary would lose an exact number, path, error string, or a user decision. Keep those verbatim; cut prose instead.
- Compaction is imminent and durable state is not on disk. Write it now, while there is room to write it well.

## Rules
- Never summarize away exact numbers, file paths, symbol names, literal error text, or a decision the user made and its reason. Those are the load-bearing tokens; the prose around them is what gets cut.
- A summary that cannot be acted on without re-reading the source saved nothing — it cost tokens and bought a second read.
- Record the conclusion, not the artifact. "The build fails because `tsconfig` targets ES5" beats 400 lines of build log.
- Prefer targeted `rg` with line caps and ranged reads over full-file reads.
- Re-reading a file you already summarized is correct when a decision must change. Refusing to re-read in order to save tokens is how a wrong summary becomes permanent.
- Agent loops, tools, and handoffs belong to `agent-engineering`; notes that must outlive the session to `session-learnings`.

## Checklist
- [ ] Large reads were bounded or summarized when context pressure warranted it.
- [ ] Wide searches delegated to subagents, not run inline.
- [ ] Volatile content reduced to conclusions; invariants and exact values kept verbatim.
- [ ] Durable state written to disk before the window gets tight.
- [ ] No log, diff, or command dump pasted whole.
