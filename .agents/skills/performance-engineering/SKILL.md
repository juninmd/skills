---
name: performance-engineering
description: |
  Measure, optimize, and reduce latency, memory, Core Web Vitals, and cloud/token spend. Use for endpoint profiling, latency bottlenecks, N+1 query bottlenecks, memory leaks, LCP/INP web vitals, autonomous metric loops, and rightsizing costs.
---



# Performance Engineering

**Not this skill:** a correctness bug that is merely slow to hit (its domain skill), or an active incident with no measurement yet (`observability`).

## Preflight
```bash
# Baseline before any change — you cannot prove an improvement without it
autocannon -c 50 -d 30 http://localhost:3000/endpoint | tee /tmp/before.txt
nproc && free -m && cat /sys/fs/cgroup/cpu.max 2>/dev/null   # is the box throttled?
```

Write the target down first: the metric, the percentile, and today's number. "Make it faster" is not a target.

## Workflow
1. Write the target down before touching code: the user-visible metric, the percentile that matters (p50/p95/p99, RPS, RSS), and today's baseline. "Make it faster" is not a target.
2. Reproduce the slowness under a repeatable load — fixed input, cache state stated, environment recorded.
3. Profile before hypothesizing. Pick the layer the symptom points at; guessing here is how a week disappears into the wrong subsystem.
4. Attack the top of the profile only. One change per measurement cycle.
5. Re-measure against the baseline under the same load. Keep the change only if the metric moves beyond run-to-run variance **and** correctness holds.
6. Add a regression guard: a CI benchmark, a budget assertion, or an alert threshold.

## Pick the Profiler by Symptom
Two lenses choose what to look at before any tool runs: **USE** — Utilization, Saturation, Errors — per resource (CPU, memory, disk, network), from Brendan Gregg's *Systems Performance*; and **RED** — Rate, Errors, Duration — per request-driven service. The table below already routes along both: rows above the fold are USE questions about a resource, rows below are RED questions about a request path.

| Symptom | Layer | Tool |
|---|---|---|
| CPU pegged, one endpoint slow | CPU | `node --cpu-prof` · `py-spy record -p <pid>` · `pprof` |
| Memory grows and never returns | Heap | `node --heapsnapshot-signal=SIGUSR2` · `tracemalloc` · `objgraph` |
| Latency fine alone, awful under load | Concurrency | event-loop lag probe · pool saturation metrics |
| One request slow, CPU idle | I/O wait | distributed trace waterfall |
| Slow only with real data volume | Database | `EXPLAIN (ANALYZE, BUFFERS)` · `pg_stat_statements` |
| Throughput plateaus below CPU limit | Saturation | connection pool size, queue depth, thread pool |

```bash
# Node: CPU profile of a running server
node --cpu-prof --cpu-prof-dir=./prof server.js
# Python: sample a live process without stopping it
py-spy record -o profile.svg --pid $(pgrep -f 'python app.py')
# Load, with a fixed shape so runs are comparable
autocannon -c 50 -d 30 -p 10 http://localhost:3000/endpoint
```

## The N+1 Signature
One query in the log, then N nearly identical ones with a different id. It never shows up locally because N is 3 with seed data and 4,000 in production. Count queries per request in a test and assert the count — that assertion catches the regression a latency benchmark misses, in CI, before it ever reaches a profiler.

## Connection Pool Exhaustion

| Symptom | Likely cause | Fix |
|---|---|---|
| Latency climbs under load; app CPU and DB CPU both idle | pool smaller than concurrent demand; requests queue for a connection | raise the pool to match concurrency, or shed load; watch queue-wait time, not just DB-side metrics |
| Intermittent "timeout acquiring connection from pool" | leaked connections — a missing close/release on an error path | audit for checkout without a `finally`/`using`/context-manager release; alert on pool checkouts that never return |
| Fine alone, collapses when replicas scale out | shared DB `max_connections` hit across all replicas combined | size each replica's pool against the DB ceiling divided by replica count, or front the DB with a pooler (PgBouncer) |
| p99 fine, throughput plateaus below CPU/DB capacity | the pool itself is the saturation resource, not the code | this is a USE-method saturation finding — resize the pool before profiling application code further |

A pool is a bounded resource like a CPU core; it saturates the same way, and the fix is sizing or shedding, never a code-level micro-optimization.

## Noise Floor
A result inside run-to-run variance is not a result. Averages hide exactly the tail a user feels: a service reporting p50 = 50ms and p99 = 4s has a "great" mean while one request in a hundred waits 80x longer — percentiles, not the mean, are what an SLO should be built on (Kleppmann, *Designing Data-Intensive Applications*, ch. 1).

| Guard | Why |
|---|---|
| Discard the first runs | JIT warmup, cold caches, lazy imports |
| Report median **and** p95/p99 | A better median with a worse tail is a worse system |
| Repeat the baseline, not just the fix | Machine drift is indistinguishable from your change |
| Watch CPU quota and thermals | A throttled container fakes a regression perfectly |
| Sample in independent processes | In-process iterations autocorrelate through JIT, GC, and thermal state; a significance test over them assumes independence it does not have |
| Decide with a test, not an eyeball | Mann-Whitney U over 7+ samples per side, and an effect larger than `max(noise band, 2 x stdev)` — at n=7 only differences around 1 sigma are detectable |

## Reference Routing
- Practical performance cases: [real-world-cases.md](references/real-world-cases.md)
- Profiling by layer (Node, Python, browser, SQL): [profiling-playbook.md](references/profiling-playbook.md)
- Caching, batching, and load-test design: [optimization-patterns.md](references/optimization-patterns.md)
- USE/RED depth, percentile math, and measuring before optimizing: [measurement-methodology.md](references/measurement-methodology.md)

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- There is no profile. Stop guessing — intuition about hot paths is wrong often enough to be worthless.
- The delta sits inside run-to-run variance. That is not a result; keep measuring or revert.
- The profile points at structure, not code. Stop tuning and route it to `software-architecture`.

## Rules
- Hand off production alerting to `observability`, frontend tuning to `frontend-engineering`, and backend bottlenecks to `backend-systems`.
- No optimization without a profile. The bottleneck is measured, never guessed — intuition about hot paths is wrong often enough to be worthless. Knuth's "premature optimization is the root of all evil" (*Structured Programming with go to Statements*, 1974) is an argument for measuring before tuning, not for skipping tuning; it names the unmeasured 97% as the trap, not the measured 3% as the excuse.
- Rightsizing is a tradeoff, not a one-way lever: over-provisioning is a silent, recurring cost; under-provisioning is a latency risk that pages someone. State which one is being traded before resizing anything — see [cost-engineering](references/cost-engineering.md).
- Stop when the target is met, or when the next profile entry is smaller than the noise floor.
- When the profile points at structure — chatty I/O across a boundary, needless synchronization, a fan-out that should be one call — stop tuning and delegate to `software-architecture`.
- Caching is the wrong fix for avoidable work: a cache over an N+1 still fires on every miss and now serves stale rows. Fix the access pattern first, then delegate cache design to `backend-systems`.
- Reject micro-optimizations that complicate code without moving the user-visible metric.
- Load tests never run against production without explicit approval.
- Test against production-sized data. A bottleneck that only appears at scale is invisible locally, and that is exactly the one that pages you.
- Browser latency, bundle size, and Core Web Vitals belong to [web-performance](references/web-performance.md); spend to [cost-engineering](references/cost-engineering.md); a crash or wrong answer to `observability`.
- Turning a proven target into an unattended keep-or-revert loop is [metric-loop](references/metric-loop.md); gating a branch on the benchmark delta is `test-engineering`.

## Checklist
- [ ] Metric, percentile, target, load, and environment recorded before the first change.
- [ ] A profile — not a hypothesis — chose what to fix.
- [ ] One change per measurement cycle; baseline re-measured alongside it.
- [ ] Improvement exceeds run-to-run variance, with tails reported, not just the median.
- [ ] Correctness unchanged and a regression guard is in place.
