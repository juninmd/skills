# Runtime Profiling: Node, Bun, Rust, WebAssembly

Open after the target is written down and the layer is CPU or binary size. Profile first, one change per cycle, re-measure with the same command.

## Contents
- Pick the runtime
- Node and Bun
- Rust native
- WebAssembly
- Benchmark harness
- Rank before porting
- Worked cases

## Pick the runtime

| Target | CPU profile | Fallback when the profiler is blocked |
|---|---|---|
| Node | `node --cpu-prof --cpu-prof-dir=prof app.js` | `npx 0x -- node app.js` |
| Bun | `bun --cpu-prof --cpu-prof-dir=prof app.ts` | `bun --inspect` plus Chrome DevTools |
| Rust | `samply record ./target/release/<bin>` | `valgrind --tool=callgrind` (user space, no kernel setting) |
| Wasm in browser | CDP `Profiler.start`/`stop` in headless Chromium | `console.time` around the exported call |
| Wasm size | `twiggy top -n 15 app_bg.wasm` | `wasm-opt --print` after `wasm-bindgen` |

## Node and Bun
Both write a V8-format `.cpuprofile`; one script ranks self time for either:
```bash
node --cpu-prof --cpu-prof-dir=prof app.js && node scripts/cpuprofile-top.mjs prof/*.cpuprofile 15
bun --cpu-prof --cpu-prof-dir=prof app.ts && bun scripts/cpuprofile-top.mjs prof/*.cpuprofile 15
```
Bun labels some frames `anonymous` with no URL; read the nearest named caller. A run under ~100 ms is startup noise: loop the workload or stop. Event-loop lag, heap diffs and pools stay in [profiling-playbook](profiling-playbook.md).

## Rust native
1. Build optimized with symbols: `CARGO_PROFILE_RELEASE_DEBUG=line-tables-only cargo build --release`. A profile of a debug build ranks the wrong functions.
2. Prefer an existing bench (`examples/`, `benches/`); time it 3-4 times first and keep the spread.
3. Sample with `samply` or `cargo flamegraph`. Both need `perf_event_open`: check `cat /proc/sys/kernel/perf_event_paranoid` (must be 1 or lower). In a container where that is fixed at 2, use callgrind: deterministic instruction counts, but 20-50x slower, so shrink the input to one item.
```bash
valgrind --tool=callgrind --callgrind-out-file=cg.out ./target/release/bench one-item-dir
callgrind_annotate --inclusive=no cg.out | head -30     # self cost
callgrind_annotate --inclusive=yes cg.out | grep -E "my_crate" | head   # who calls the hot leaf
```
Self cost names the leaf (a decoder, `memcpy`); inclusive cost names the caller that invoked it too often. Fix the caller.
4. Compare instruction counts (`Collected`) and wall time across runs; instruction count is the noise-free signal, wall time is the user-visible one.

## WebAssembly
- Size: `wasm-bindgen --target web --out-dir out target/wasm32-unknown-unknown/<profile>/app.wasm`, then `twiggy top`. A `data segment ".rodata"` row dominating means embedded assets (`include_bytes!`), not code; `twiggy dominators` and a grep of `include_bytes!` name them. Compare gzip/brotli size, which is what ships.
- Speed: the same Rust hot path profiles natively with the steps above; only browser-specific cost (GPU, JS boundary, fetch/instantiate) needs a browser profile. Headless Chromium over CDP (`Profiler.setSamplingInterval`, `Profiler.start`, `Profiler.stop`) returns a `.cpuprofile`: rank it with the script above.
- Crossing the JS/Wasm boundary per item costs more than the work for small items. Batch: pass one buffer, loop inside Wasm.
- Build with the repo's release or web profile, never `dev`; state `opt-level` and `lto` next to every number.

## Benchmark harness
The profile and the benchmark answer different questions: the profile names the hot frame, the benchmark proves the delta. Keep both honest:
- **Keep the fixture out of the profile.** Building the input inside the profiled process (random pages, seed rows) can outrank the code under test; on one run fixture generation was 41% of self time and hid the real top. Generate data with a bulk API (`crypto.getRandomValues`, `COPY`), or before the profiled window, then re-profile.
- **One sample per process.** `hyperfine --warmup 3 --runs 10 --export-json before.json 'bun bench.ts'` runs each sample in a fresh process and reports mean, stdev, min/max; `hyperfine` with two commands compares them directly. Feed its per-run times into the Mann-Whitney check from `SKILL.md`.
- **Micro-benchmarks** of a single JS function: `mitata` (Node/Bun/Deno) reports percentiles and guards against dead-code elimination; it does not replace an end-to-end run.
- **Commit the bench script** next to the fix (`scripts/bench-*.ts`, a `bench:*` package script) so the regression guard is one command.
- **Continuous benchmarking** in CI: CodSpeed and iai-callgrind measure instruction counts under Valgrind, stable enough to gate a PR on a shared runner; Bencher stores wall-time history and alerts on a statistical threshold.
- **Flat profile, no dominant frame, concurrent code:** a causal profiler (`coz`, Curtsinger & Berger, *Coz: Finding Code that Counts with Causal Profiling*, SOSP 2015) virtually speeds up one line at a time and reports which one would move throughput or latency. Sampling profilers rank where time goes, not what would shorten the critical path.

## Rank before porting
From the `fast-anything` workflow (github.com/EL4CTEO/fast-anything, MIT), reduced to rules a profile can check:
- Rank functions by time share times how isolated they are (pure, no I/O, no globals). Skip anything under 2% of the run.
- Port the outermost loop that is pure, not the tiny function called inside it, so the boundary is crossed once.
- Prove equivalence on recorded real inputs plus shrunk variants before enabling; keep a one-flag undo.
- First look for repeated work (same file decoded per frame, same JSON parsed per call): memoizing beats rewriting in another language.

## Worked cases
Rust game engine, native character compile (`load_bench`, 24 characters): baseline 3.9-4.2 s over 4 runs. Callgrind on one character put `decode_png` at 60% inclusive, called from a per-frame sprite read that re-decoded the same PNG and re-parsed `meta.json` for every frame. A content-checked decode cache cut instructions 4.27G to 2.73G and wall time to 3.1-3.3 s, with the crate tests green. Remaining lead: the first decode of each unique PNG. Wasm size on the same repo: 22.9 MB, 64% `.rodata` from embedded assets (a product decision, reported not changed).

Bun HTTP server serving CBZ pages (`/api/local/page`, 400 pages of 400 KB, 7 independent processes per side): baseline sequential chapter 581 ms median, p95 2.21 ms per page. `bun --cpu-prof` + `cpuprofile-top.mjs` ranked `compare` (natural sort of every entry name on every request), `toString` (central directory decoded twice per request) and `Uint8Array`/`set`/`alloc` (each page copied into a new typed array only to satisfy the `Response` type). Fix: cache the parsed index and the sorted page list keyed by path + mtime + size (small LRU), and pass the `Buffer` as a view (`new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)`). Result: 330 ms sequential, p95 1.10 ms, 8-way prefetch 211 to 93 ms; distributions did not overlap (U = 0). Lesson: in a per-request handler, the top of the profile is often repeated work on unchanged input; memoize with a freshness key before micro-tuning.
