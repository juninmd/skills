# performance-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `measurement-methodology.md` | USE method, RED method, percentiles vs averages, measuring before optimizing, layout bias and instruction-count gates, `coz` causal profiling for flat profiles, load-test traffic-shape mismatches |
| `cost-engineering.md` | Attributing and cutting cloud/token spend per unit (request, tenant, job) — cost-per-unit ranking by cost x growth, tag-based attribution, sweeping idle resources before touching code |
| `metric-loop.md` | Running an unattended, verifiable optimization loop (Goal/Scope/Metric/Verify/Guard) with keep/discard/guard-fail verdicts, for iterative perf tuning with a regression guard |
| `optimization-patterns.md` | Concrete fix patterns (caching invalidation, batching/N+1 collapse, concurrency bounds, payload/transport, top-k subtree pruning, sync IPC handlers off the desktop UI thread, process-spawn merging, RegexSet/Aho-Corasick multi-pattern prefilters, regression guards) once profiling has already named the bottleneck |
| `profiling-playbook.md` | Per-language profiling commands (Node CPU/heap/event-loop, Python py-spy/cProfile/tracemalloc, SQL EXPLAIN) and N+1 count-assertion tests, once you know which layer to instrument |
| `runtime-profiling.md` | Node/Bun `--cpu-prof`, Rust samply/callgrind/dhat heap with symbols, ruled-out Rust tools, hyperfine A/B, Coz causal profiling, Wasm `twiggy` size and CDP profiles, ranking hot spots before porting, plus a measured worked case — once the layer is CPU or binary size |
| `io-bound-and-desktop.md` | File scanners, hashing, duplicate finders, file managers and native GUIs: user/sys/real split, passes over the data, strace counts, warm vs cold cache, parallelism that does not pay off, GUI benchmarks without a GPU |
| `real-world-cases.md` | Backend/frontend perf incident case studies (ORM N+1 spike, event-loop stall, unbounded cache leak, false regression from a cold benchmark, agent-hook latency from spawns and regex fan-out, silent bundle bloat, instruction-count CI gates, frame-budget streaming, costly CSS selectors, a desktop search freezing the window) for pattern-matching a symptom |
| `vitals-and-field-data.md` | Core Web Vitals thresholds at p75, where field data comes from (own RUM vs public 28-day dataset vs lab), and root causes per metric — for judging real-user performance, not one lab run |
| `web-performance.md` | Step-by-step Core Web Vitals workflow — pick the one failing vital at p75, rule out the server via TTFB, then route to that vital's cause — for a perf regression or Lighthouse audit |
| `desktop-idle.md` | Tauri/Electron/tray apps: counting wakeups while hidden, pausing timers on visibility, throttle vs pause, boot benchmarks under CPU throttle — for "uses CPU at rest" or slow first show |
