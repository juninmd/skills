# performance-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `measurement-methodology.md` | USE method, RED method, percentiles vs averages, measuring before optimizing, load-test traffic-shape mismatches |
| `cost-engineering.md` | Attributing and cutting cloud/token spend per unit (request, tenant, job) — cost-per-unit ranking by cost x growth, tag-based attribution, sweeping idle resources before touching code |
| `metric-loop.md` | Running an unattended, verifiable optimization loop (Goal/Scope/Metric/Verify/Guard) with keep/discard/guard-fail verdicts, for iterative perf tuning with a regression guard |
| `optimization-patterns.md` | Concrete fix patterns (caching invalidation, batching/N+1 collapse, concurrency bounds, payload/transport, regression guards) once profiling has already named the bottleneck |
| `profiling-playbook.md` | Per-language profiling commands (Node CPU/heap/event-loop, Python py-spy/cProfile/tracemalloc, SQL EXPLAIN) and N+1 count-assertion tests, once you know which layer to instrument |
| `real-world-cases.md` | Backend/frontend perf incident case studies (ORM N+1 spike, event-loop stall, unbounded cache leak, false regression from a cold benchmark, silent bundle bloat) for pattern-matching a symptom |
| `vitals-and-field-data.md` | Core Web Vitals thresholds at p75, where field data comes from (own RUM vs public 28-day dataset vs lab), and root causes per metric — for judging real-user performance, not one lab run |
| `web-performance.md` | Step-by-step Core Web Vitals workflow — pick the one failing vital at p75, rule out the server via TTFB, then route to that vital's cause — for a perf regression or Lighthouse audit |
