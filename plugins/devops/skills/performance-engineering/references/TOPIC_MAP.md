# performance-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `measurement-methodology.md` | USE method, RED method, percentiles vs averages, noise floor guards (warmup, tails, independent processes, Mann-Whitney), measurement bias (environment and process-level variance) and layout bias with instruction-count gates, `coz` causal profiling for flat profiles, measuring before optimizing, load-test traffic-shape mismatches |
| `metric-loop.md` | Running an unattended, verifiable optimization loop (Goal/Scope/Metric/Verify/Guard) with keep/discard/guard-fail verdicts, for iterative perf tuning with a regression guard |
| `optimization-patterns.md` | Concrete fix patterns (caching invalidation, batching/N+1 collapse and its signature, connection pool exhaustion, concurrency bounds, payload/transport, top-k subtree pruning, sync IPC handlers off the desktop UI thread, process-spawn merging, RegexSet/Aho-Corasick multi-pattern prefilters, regression guards) once profiling has already named the bottleneck |
| `profiling-playbook.md` | Per-language profiling commands (Node CPU/heap/event-loop, Python py-spy/cProfile/tracemalloc, SQL EXPLAIN) and N+1 count-assertion tests, once you know which layer to instrument |
| `runtime-profiling.md` | Node/Bun `--cpu-prof`, Rust samply/callgrind/dhat heap with symbols, ruled-out Rust tools, Wasm `twiggy` size and CDP profiles, benchmark harnesses (hyperfine, mitata, coz causal profiling, CI benchmarking), ranking hot spots before porting, frame-time percentiles for games, equivalence-checksum hot-loop benches, plus measured worked cases — once the layer is CPU or binary size |
| `tool-catalog.md` | Tool per case for Rust (samply, flamegraph, Criterion/Divan, hyperfine, DHAT/heaptrack, Rayon, tokio-console, profiles, cargo-pgo, mimalloc), Node (`--cpu-prof`, 0x, Clinic, Piscina, PM2, napi-rs, autocannon/k6), Bun (mitata, tinybench, Workers, FFI), TS/build (TypeScript 7/tsgo, erasableSyntaxOnly, Oxc, Rolldown, SWC, esbuild), a routing table per front, subagent source sweeps, install paths — when choosing the tool |
| `io-bound-and-desktop.md` | File scanners, hashing, duplicate finders, file managers and native GUIs: user/sys/real split, passes over the data, strace counts, warm vs cold cache, parallelism that does not pay off, GUI benchmarks without a GPU |
| `real-world-cases.md` | Backend/frontend perf incident case studies (ORM N+1 spike, event-loop stall, unbounded cache leak, false regression from a cold benchmark, agent-hook latency from spawns and regex fan-out, silent bundle bloat, instruction-count CI gates, frame-budget streaming, costly CSS selectors, a desktop search freezing the window) for pattern-matching a symptom |
| `desktop-idle.md` | Tauri/Electron/tray apps: counting wakeups while hidden, pausing timers on visibility, throttle vs pause, boot benchmarks under CPU throttle — for "uses CPU at rest" or slow first show |
