# Tool Catalog: Which Tool for Which Case

Open after the symptom is named. Route first: the routing table tells you which layer and reference own the work, and the per-runtime tables tell you which tool to run. Every "Measured" row was run on a real repo: a Rust/wgpu engine with a Wasm build plus Node scripts, on 4 cores in a container where `perf_event_paranoid=2`.

## Contents
- Route each front
- Rust
- Node.js
- Bun
- TypeScript and build
- Source sweeps with subagents
- Install once, record where

## Route each front

| Front (symptom) | First tool | Then | Owner |
|---|---|---|---|
| Rust CPU, perf allowed | `samply record` | `cargo flamegraph` for a static SVG | [runtime-profiling](runtime-profiling.md) |
| Rust CPU in a container (`perf_event_paranoid` ≥ 2) | `valgrind --tool=callgrind` on one item | `callgrind_annotate --inclusive=yes` names the caller | [runtime-profiling](runtime-profiling.md) |
| Rust A/B of two builds | `hyperfine -N -w 1 -r 8 old new` | callgrind `Collected` when wall spread exceeds the delta | [runtime-profiling](runtime-profiling.md) |
| Rust heap peak or allocation churn | `heaptrack` (calls, temporary, peak, leaked) | `valgrind --tool=dhat` + `dhat-top.mjs` per site | [runtime-profiling](runtime-profiling.md) |
| Rust allocator-bound | swap in `mimalloc` behind a feature | keep it only if RSS growth is acceptable | this file |
| Rust release settings | Cargo profiles (`lto`, `codegen-units`, `panic`) | `cargo pgo` when a pipeline can train | this file |
| Rust async stalls | `tokio-console` | needs `console-subscriber` and a tokio runtime | [profiling-playbook](profiling-playbook.md) |
| Wasm size | `twiggy top` / `twiggy dominators` | grep `include_bytes!`; `wasm-opt -Oz` | [runtime-profiling](runtime-profiling.md) |
| Node CPU | `node --cpu-prof` + `cpuprofile-top.mjs` | `0x` flame graph | [runtime-profiling](runtime-profiling.md) |
| Node heap | `node --heap-prof`, heap snapshot diff | `--inspect` + DevTools | [profiling-playbook](profiling-playbook.md) |
| Node HTTP throughput | `autocannon -c 50 -d 10` | `k6` for scenarios and thresholds | [profiling-playbook](profiling-playbook.md) |
| Node CPU-bound in a request | `piscina` worker pool | `napi-rs` native addon when the profile names a pure loop | this file |
| Bun CPU/heap | `bun --cpu-prof-md` / `--heap-prof-md` | `mitata` for one function | [runtime-profiling](runtime-profiling.md) |
| TS type-check or build slow | TypeScript 7 (native) / `tsgo` | `oxlint`, `esbuild` or `rolldown` | this file |
| Web vitals, bundle | Lighthouse, field data | [web-performance](web-performance.md) | [vitals-and-field-data](vitals-and-field-data.md) |
| Queries, N+1 | `EXPLAIN ANALYZE` | `data-engineering` skill | [optimization-patterns](optimization-patterns.md) |

## Rust

| Case | Tool | Use | Measured |
|---|---|---|---|
| Sampling CPU profile | [samply](https://github.com/mstange/samply) | `samply record ./target/release/bin` | blocked at `perf_event_paranoid=2`; callgrind instead |
| Flame graph SVG | [cargo-flamegraph](https://github.com/flamegraph-rs/flamegraph) | `cargo flamegraph --example bench` | blocked like samply |
| Statistical micro-bench | [Criterion.rs](https://docs.rs/criterion), [Divan](https://github.com/nvzqz/divan) | `benches/` + `cargo bench` | N/A: repo benches are `examples/`; hyperfine covered A/B |
| A/B two binaries | [hyperfine](https://github.com/sharkdp/hyperfine) | `hyperfine -N -w 1 -r 8 --export-markdown ab.md ./old ./new` | 24-char compile 2.735 to 2.631 s (-3.8%, inside σ 0.12 s) |
| Instruction count | callgrind | one-item input | same change: 1.994G to 1.752G (-12.1%), the signal hyperfine hid |
| Heap profile | [DHAT](https://docs.rs/dhat), [heaptrack](https://github.com/KDE/heaptrack) | `heaptrack ./bin`; `heaptrack_print -f file.zst` summary lines | 180,159 allocation calls, peak 185 MB, 73 MB "leaked" = an unbounded global decode cache |
| Data parallelism | [Rayon](https://github.com/rayon-rs/rayon) | `par_iter` with work stealing | not adopted: a hand-rolled static partition exists; candidate when job sizes are uneven |
| Async runtime | [Tokio](https://tokio.rs), [tokio-console](https://github.com/tokio-rs/console) | `console-subscriber` + `tokio-console` | N/A: tokio only as a transitive dependency, no runtime |
| Build profiles | [Cargo profiles](https://doc.rust-lang.org/cargo/reference/profiles.html) | `lto = "fat"`, `codegen-units = 1`, `debug = "line-tables-only"` for profiling | state the profile next to every number |
| PGO | [cargo-pgo](https://github.com/Kobzol/cargo-pgo) | `cargo pgo build`, run the bench, `cargo pgo optimize` | -4% inside run spread; skip unless the release pipeline can train |
| Allocator | [mimalloc](https://github.com/purpleprotocol/mimalloc_rust) | `#[global_allocator]`, `cfg(not(target_arch = "wasm32"))` | -19.5% wall (3.170 to 2.550 s), +19.9% peak RSS (1.6 to 1.9 GiB); a trade, and a new dependency needs CVE/license review |
| Reference | [Rust Performance Book](https://nnethercote.github.io/perf-book/) | heap allocations, hashing, bounds checks, I/O chapters | |

Gotchas:
- Wall time on 4 shared cores hid a real -12% instruction win; report both, and gate on instruction count.
- Moving a byte comparison outside a mutex measured +2.3% (noise) on 4 cores. Reverted: a contention fix needs a profile that shows waiting.
- heaptrack prints mangled Rust names on some builds; read the summary lines (calls, temporary, peak, leaked) and use dhat for sites.

## Node.js

| Case | Tool | Use | Measured |
|---|---|---|---|
| CPU profile | [`--cpu-prof`](https://nodejs.org/api/cli.html) | `node --cpu-prof --cpu-prof-dir=prof x.mjs`, then `cpuprofile-top.mjs` | 116 ms script: 23% `(program)`, 14% `spawnSync` (a `git ls-files` call), 9.5% `readFileUtf8` |
| Heap profile | [`--heap-prof`](https://nodejs.org/api/cli.html) | `--heap-prof --heap-prof-dir=prof` | writes `.heapprofile` next to the CPU one |
| Flame graph | [0x](https://github.com/davidmarkclements/0x) | `0x -- node app.js` | uses V8 `--prof`, so it works where `perf` is blocked |
| Doctor, bubbleprof | [Clinic.js](https://github.com/clinicjs/node-clinic) | `clinic doctor -- node app.js` | unmaintained; prefer `--cpu-prof` + event-loop delay histogram |
| Worker pool | [Piscina](https://github.com/piscinajs/piscina) | move a CPU-bound handler off the event loop | N/A: no CPU-bound server in the target |
| Process manager | [PM2](https://pm2.keymetrics.io) | cluster mode across cores | deployment, not profiling; one process per core in containers |
| Native addon | [napi-rs](https://napi.rs) | port a pure hot loop to Rust | only after the profile names the loop and the boundary is crossed once |
| Load test | [autocannon](https://github.com/mcollina/autocannon), [k6](https://grafana.com/docs/k6/latest/) | `autocannon -c 50 -d 10 URL` | static test server: 6.6k req/s, p50 7 ms, p99 12 ms; it reads the file on every request |

## Bun

| Case | Tool | Use | Measured |
|---|---|---|---|
| End-to-end timing | [Benchmarking](https://bun.com/docs/project/benchmarking) | `hyperfine` + `bun --cpu-prof-md` | same Node script: node 105.7 ms vs bun 75.3 ms (-29%, startup-bound) |
| Micro-bench | [mitata](https://github.com/evanwashere/mitata), [tinybench](https://github.com/tinylibs/tinybench) | one function, percentiles, dead-code guard | proves a function, never the end-to-end |
| Threads | [Workers](https://bun.com/docs/runtime/workers) | CPU-bound work off the main thread | N/A in the target |
| Native call | [FFI](https://bun.com/docs/runtime/ffi) | `bun:ffi` to a C/Rust library | batch per call; per-item crossings cost more than the work |

## TypeScript and build

| Case | Tool | Use | Measured |
|---|---|---|---|
| Type-check | [typescript-go](https://github.com/microsoft/typescript-go) | TypeScript 7 ships the Go compiler as `tsc`; `tsgo` was its preview | 47 JS files `--checkJs`: tsc 5.9 2.902 s / 216 MB vs tsc 7.0 0.520 s / 108 MB (5.6x, half memory) |
| Strip-only TS | [erasableSyntaxOnly](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly) | forbid enums/namespaces so Node and Bun run `.ts` without a build | |
| Lint | [Oxc](https://oxc.rs) (`oxlint`) | `oxlint --quiet <files>` | 47 files in 52-85 ms, 22 warnings |
| Bundle | [Rolldown](https://rolldown.rs), [esbuild](https://esbuild.github.io) | production bundle and minify | esbuild 4 files minified in 15.9 ms |
| Transform | [SWC](https://swc.rs) | `swc src -d out` | 231.6 ms, almost all Node CLI startup; compare through the API or on a large input |

Gotchas:
- Check `typescript` before installing `tsgo`: on 7.x, `tsc` and `tsgo` are the same native compiler and time the same.
- The 5.9 and 7.0 runs reported 142 and 722 errors on the same flags: defaults changed. Pin the config before comparing error counts; time is comparable, the error list is not.
- A CLI timing under ~200 ms is mostly process startup.

## Source sweeps with subagents
Fan out the read-only code sweep, keep the decision:
- Run one subagent per area (native compile, tick loop, render/web) on the cheapest, fastest model available. Each returns ranked candidates with `file:line`, the caller chain, and what it could not confirm.
- The coordinator runs on the strongest model. It re-reads every cited line before acting, and measures before changing code. Example: one sweep returned 36 candidates and 1 shipped. The top one was confirmed by tracing what the consumer keeps: `sprite_of` drops hurt/hit, so fitting them for palette variants was pure waste.
- A subagent cannot profile without building. Treat its magnitudes as guesses until callgrind or hyperfine confirms them. Orchestration rules live in the `agent-orchestration` skill.

## Install once, record where
Containers are ephemeral. Install to a fixed prefix and save the paths and commands to project memory, so the next session reinstalls in one step:
```bash
cargo install --locked samply flamegraph hyperfine cargo-pgo cargo-llvm-lines cargo-bloat twiggy
apt-get update && apt-get install -y heaptrack valgrind
npm i --prefix /opt/perf-tools/npm 0x clinic autocannon mitata tinybench typescript oxlint esbuild @swc/cli @swc/core
```
