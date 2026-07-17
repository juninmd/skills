---
name: performance-engineering
description: |
  Measure, diagnose, and improve latency, throughput, memory, and cost with profile-driven evidence. Use for slow endpoints, N+1 queries, memory leaks, event-loop blocking, bundle size, load testing, caching decisions, and performance regressions.
---

# Performance Engineering

## Workflow
1. Define the user-visible metric, target (p50/p95/p99, RPS, RSS, bundle KB), and current baseline before touching code.
2. Reproduce the slowness with a repeatable load: fixed input, warm caches stated, environment recorded.
3. Profile before hypothesizing: CPU flamegraph, heap snapshot, query plan, waterfall, or event-loop lag — pick the layer the symptom points to.
4. Attack the top of the profile only; one change per measurement cycle.
5. Re-measure against the baseline with the same load; keep the change only if the target metric moves and correctness holds.
6. Add a regression guard: benchmark in CI, budget assertion, or alert threshold.

## Reference Routing
- Practical performance cases: [real-world-cases.md](references/real-world-cases.md)
- Profiling by layer (Node, Python, browser, SQL): [profiling-playbook.md](references/profiling-playbook.md)
- Caching, batching, and load-test design: [optimization-patterns.md](references/optimization-patterns.md)

## Rules
- No optimization without a profile; the bottleneck is measured, not guessed.
- Report medians and tails, never single runs or averages alone.
- Caching requires an invalidation story before it ships.
- Reject micro-optimizations that complicate code without moving the user-visible metric.
- Load tests never run against production without explicit approval.

## Checklist
- [ ] Baseline, target, and load are recorded.
- [ ] Fix addresses the top profiled bottleneck.
- [ ] Improvement is re-measured and regression-guarded.
