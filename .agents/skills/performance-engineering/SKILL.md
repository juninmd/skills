---
name: performance-engineering
description: |
  Hub making code faster; routes each language and symptom to profilers, benchmarks, fixes. Use for Rust, Node, Bun, TS, WebAssembly profiling, size, deep source sweeps, k6 load tests, N+1, memory leaks, idle CPU, benchmark noise. Not web vitals or spend (vitals-and-cost). Trigger on 'this is slow', 'speed up this project', 'profile this Rust app', 'load test this'.
---

# Performance Engineering

The central hub: pick a mode, route by language and symptom, run the tools, keep only what the numbers prove.

**Not this skill:** a correctness bug that is merely slow to hit (its domain skill), or an active incident with no measurement yet (`observability`).

## Preflight
```bash
nproc && free -m && cat /sys/fs/cgroup/cpu.max 2>/dev/null            # is the box throttled?
cat /proc/sys/kernel/perf_event_paranoid                                # >= 2: samply/perf blocked, use callgrind
ls Cargo.toml package.json pyproject.toml go.mod bun.lock 2>/dev/null   # which Route by Language rows apply
hyperfine -N --warmup 3 --runs 10 --export-json before.json './bin args'   # CLI, build, batch
autocannon -c 50 -d 30 http://localhost:3000/endpoint | tee before.txt       # HTTP endpoint
valgrind --tool=callgrind ./target/release/bench one-item                    # instruction count, no perf needed
```
Write the target before any change: metric, percentile (p50/p95/p99, RPS, RSS, bytes), today's number. "Make it faster" is not a target.

## Pick a Mode
| Mode | When | Do |
|---|---|---|
| **Fix** | one named symptom ("endpoint p95 is 2 s") | Workflow on that target |
| **Deep sweep** | "speed up this project", "find every win" | Deep Sweep below, then Workflow per candidate |
| **Guard** | a win to keep | regression guard in CI, or an unattended [metric-loop](references/metric-loop.md) |

## Workflow
1. **Target:** the Preflight number, plus the number that means done.
2. **Reproduce:** fixed input, cache state stated, environment recorded.
3. **Profile before hypothesizing:** the routing tables pick the tool.
4. **One change** at the top of the profile per cycle.
5. **Re-measure** with the same command. Keep it only if the delta beats run-to-run variance **and** output is identical (test or checksum).
6. **Guard:** CI benchmark, budget assertion, query-count test, or alert.

## Route by Language
| Stack | Profile first | Benchmark | Usual wins | Go to |
|---|---|---|---|---|
| Rust | `samply`; callgrind when `perf_event_paranoid` ≥ 2; heaptrack/dhat | hyperfine, Criterion/Divan, callgrind `Collected` | repeated decode/parse, clones → `Arc`, discarded work, allocator, `lto` | [runtime-profiling](references/runtime-profiling.md) |
| Node.js | `--cpu-prof` + `cpuprofile-top.mjs`, `--heap-prof`, 0x | autocannon, k6, mitata | memoize per request, stream instead of buffer, workers (Piscina) | [profiling-playbook](references/profiling-playbook.md) |
| Bun | `--cpu-prof-md`, `--heap-prof-md` | hyperfine, mitata/tinybench | `bun:sqlite` N+1, typed-array copies, startup | [runtime-profiling](references/runtime-profiling.md) |
| TypeScript/build | wall time per step | hyperfine | TypeScript 7 (native), oxlint, esbuild/Rolldown, `erasableSyntaxOnly` | [tool-catalog](references/tool-catalog.md) |
| Python | `py-spy record`, `tracemalloc` | hyperfine, pytest-benchmark | vectorize, processes for CPU, async I/O | [profiling-playbook](references/profiling-playbook.md) |
| Go, JVM | `pprof`, async-profiler | `go test -bench`, JMH | allocation, lock contention | [profiling-playbook](references/profiling-playbook.md) |
| Wasm | `twiggy top`, CDP profile | native bench of the same code | embedded assets, `wasm-opt`, batch across the JS boundary | [runtime-profiling](references/runtime-profiling.md) |
| Browser vitals | hand off | `vitals-and-cost` | LCP/INP/CLS at p75 | `vitals-and-cost` |
| SQL | `EXPLAIN (ANALYZE, BUFFERS)`, `pg_stat_statements` | query count per request | N+1, indexes, pool sizing | [optimization-patterns](references/optimization-patterns.md) |
| Desktop, disk-bound | wakeups/s hidden, user/sys split | hyperfine | idle loops, sync IPC, passes per byte | [desktop-idle](references/desktop-idle.md), [io-bound](references/io-bound-and-desktop.md) |
| Cloud, LLM tokens | hand off | `vitals-and-cost` | cost per unit | `vitals-and-cost` |

Tool-by-tool choices with measured results (samply vs callgrind, mimalloc, cargo-pgo, Clinic, tsgo, SWC vs esbuild): [tool-catalog](references/tool-catalog.md).

## Route by Symptom
| Symptom | Look at |
|---|---|
| CPU pegged, one path slow | CPU profile of that path (stack row above) |
| Memory grows and never returns | heap snapshot diff, heaptrack "leaked", unbounded caches |
| RSS grows with payload size | `readFileSync`/`arrayBuffer()` on files; stream and set `Content-Length` |
| Fine alone, awful under load | event-loop lag, pool queue wait, thread pool |
| One request slow, CPU idle | trace waterfall: serial awaits, N+1 |
| Throughput plateaus below CPU | pool, queue depth, CPU quota (`cpu.stat` `nr_throttled`) |
| Hook or CLI slow, own CPU low | `strace -f -c` for spawns, `hyperfine -N` |
| Hot function faster, end-to-end same | causal profiling (`coz`), [measurement-methodology](references/measurement-methodology.md) |
| Window freezes, backend fast | sync IPC on the UI thread, [optimization-patterns](references/optimization-patterns.md) |

## Deep Sweep
For "take this project to its maximum". The coordinator runs on the strongest model and owns decisions. Read-only subagents on the cheapest, fastest model read the source.

1. **Coordinator:** write the target, inventory the stack (`Cargo.toml`, `package.json`, lockfiles, `examples/`, `benches/`), and pick rows from Route by Language. Install the tools and save their paths to memory.
2. **Fan out:** one subagent per area (crate, package, or layer such as load path, hot loop, render, web). All run in parallel, with no edits and no builds.
3. **Meanwhile:** the coordinator runs baselines and profilers, so the candidates arrive next to real numbers.
4. **Verify:** re-read every cited line. Confirm what the consumer keeps (work whose output is dropped is the cheapest win), then rank by profile share × confidence ÷ effort.
5. **Fix:** Workflow per candidate, one commit each, with an equivalence test. Revert what does not beat noise and record it as ruled out.
6. **Report:** fixed (before/after), measured and ruled out, and remaining opportunities ranked. Say plainly when more opportunities remain than were fixed.

Subagent prompt:
```text
Read-only performance audit of <path> (<area>). No edits, no builds.
Return up to 12 candidates ranked by likely cost. For each: file:line, the
caller chain from the hot entry point (<entry>), why it is hot (per item, per
frame, per request), the fix, and what you could not confirm. Also list what
you checked and found fine.
```

## Examples
- **Rust engine, discarded work.** Callgrind on one character showed palette variants re-running hurt/hit box fitting. `sprite_of` dropped those boxes, so variants now render image-only: 1.994G → 1.752G instructions (-12.1%), pixels pinned by a test. Wall time moved -3.8%, inside σ, which is why instruction count is the gate.
- **Bun server, repeated work.** `bun --cpu-prof` ranked a natural sort and a central-directory decode on every request. Caching both by path + mtime + size cut a chapter from 581 to 330 ms, with distributions that did not overlap.
- **TS tooling.** `--checkJs` on 47 files took 2.90 s with tsc 5.9 and 0.52 s with TypeScript 7 (5.6x, half the memory). Check the installed version before adding `tsgo`.
- **N+1.** One query, then N with a different id. Assert queries per request in a test; details in [optimization-patterns](references/optimization-patterns.md).

## Stop
- No profile yet: stop guessing and take one.
- The target is met, or the next profile entry is below the noise floor.
- The delta sits inside run-to-run variance: keep measuring or revert.
- The profile points at structure, not code: route to `software-architecture`.

## Rules
- No profile, no change. Knuth's "premature optimization" quote argues for measuring first, not for skipping tuning.
- A delta inside run-to-run variance is not a result: report median **and** p95/p99, sample in separate processes, and gate noisy wall time on instruction counts. Guards: [measurement-methodology](references/measurement-methodology.md).
- Reject micro-optimizations that complicate code without moving the user metric.
- Structure (chatty I/O across a boundary, needless sync, a fan-out that should be one call) goes to `software-architecture`, production alerting to `observability`, frontend code to `frontend-engineering`, cache design to `backend-systems`, and benchmark gates in CI to `test-engineering`.
- A cache is the wrong fix for avoidable work: fix the access pattern first.
- Web vitals, cost and rightsizing go to `vitals-and-cost`.
- Load tests never hit production without explicit approval. Test with production-sized data.
- A new dependency (allocator, native addon) needs a CVE, license, and maintenance check before it ships.

## Reference Routing
- Tool per case for Rust, Node, Bun and TS/build, plus measured results and install paths: [tool-catalog.md](references/tool-catalog.md)
- Rust, Node, Bun and Wasm CPU, heap and size profiling, rankers (`cpuprofile-top.mjs`, `dhat-top.mjs`) and harnesses: [runtime-profiling.md](references/runtime-profiling.md)
- Node, Python, SQL and browser by layer: [profiling-playbook.md](references/profiling-playbook.md)
- Caching, batching, N+1, pools, concurrency and load-test design: [optimization-patterns.md](references/optimization-patterns.md)
- USE/RED, percentiles, noise floor and bias: [measurement-methodology.md](references/measurement-methodology.md)
- Worked cases: [real-world-cases.md](references/real-world-cases.md). Everything else: [Reference Map](references/TOPIC_MAP.md)

## Checklist
Copy into the task file and tick as you go; an open box blocks "done".

**Setup**
- [ ] Target written: metric, percentile, today's number, and the number that means done.
- [ ] Environment recorded: cores, memory, CPU quota, build profile (`opt-level`, `lto`), cache state.
- [ ] Tools installed, versions noted, install paths saved to memory.

**Measure**
- [ ] Baseline run 3+ times in separate processes; spread recorded.
- [ ] Profile taken with the tool from Route by Language; top entries noted with their share.
- [ ] Deep sweep only: one subagent per area returned; every cited `file:line` re-read by the coordinator.

**Change**
- [ ] One change per cycle, aimed at the top of the profile or a verified candidate.
- [ ] Output identical: existing tests pass, plus an equivalence test or checksum for the changed path.
- [ ] Delta beats variance (median and p95/p99, or instruction count); otherwise reverted and logged as ruled out.
- [ ] No unbounded cache, buffer, queue, or loop introduced; new dependencies vetted.

**Ship**
- [ ] Regression guard added: benchmark, budget assertion, query count, or alert.
- [ ] Repo gates green: lint, tests, size or boundary checks.
- [ ] Report: before/after per fix, ruled-out list, remaining opportunities ranked, and an explicit line when more remain.
