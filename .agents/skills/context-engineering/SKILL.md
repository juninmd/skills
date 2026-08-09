---
name: context-engineering
description: |
  Manage agent context windows: pruning, summarization, routing, and token budgets. Use for long sessions, context overflow, memory strategies, sliding windows, and keeping the right files in context.
---

# Context Engineering

## Workflow
1. Track what is in context: files, outputs, and chat history; estimate the token cost of each.
2. Route: keep stable invariants (contracts, configs); summarize volatile content (logs, diffs).
3. Prune aggressively: remove read artifacts once their conclusion is captured.
4. Summarize decisions at checkpoints so later steps do not re-read sources.
5. Use the token report and budgets as the feedback loop; surface overruns before they happen.

## Rules
- Context is a budget: the model re-reads nothing, so everything must fit.
- Never keep a raw log or full diff in context when a summary suffices.
- Record the conclusion, not the artifact.
- Prefer targeted `rg` and `sed` over full-file reads.

## Checklist
- [ ] Token cost per context component is estimated.
- [ ] Volatile content summarized; stable content preserved.
- [ ] Overruns surfaced before they happen.
