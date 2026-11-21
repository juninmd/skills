# Runtime Profiling: Node, Bun, Rust, WebAssembly

Open after the target is written down and the layer is CPU or binary size. Profile first, one change per cycle, re-measure with the same command.

## Contents
- Pick the runtime
- Node and Bun
- Rust native
- WebAssembly
- Rank before porting
- Frame time (games, UI)
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

## Rank before porting
From the `fast-anything` workflow (github.com/EL4CTEO/fast-anything, MIT), reduced to rules a profile can check:
- Rank functions by time share times how isolated they are (pure, no I/O, no globals). Skip anything under 2% of the run.
- Port the outermost loop that is pure, not the tiny function called inside it, so the boundary is crossed once.
- Prove equivalence on recorded real inputs plus shrunk variants before enabling; keep a one-flag undo.
- First look for repeated work (same file decoded per frame, same JSON parsed per call): memoizing beats rewriting in another language.

## Frame time (games, UI)
- Record per-frame durations, not an average FPS. Report p50, p99 and the worst frame; p99 flags stutter, but a game smooth 99.9% of the time can still hitch on the rest, so read the raw plot too (NVIDIA, "Analysing stutter"; Android Frame Rate guide: P90 baseline, P99 stutter).
- Histogram-based percentiles: count empty buckets as zero frames; dropping them hides the worst stutter.
- Under vsync (`Fifo`), a blocking swapchain acquire shows up as a long frame without any CPU work. Split CPU time from acquire/present wait before blaming code, and compare present modes on the same scene.
- Software GPUs (swiftshader, lavapipe) only judge CPU and idle share, never fps.

## Hot loop with an equivalence checksum
When the fix rewrites a decoder or transform, bench the whole corpus in one process (min, median, max of 7 rounds) and print a checksum of the output. Same checksum plus lower median is the proof; a faster run with a different checksum is a bug. Instruction counts from callgrind confirm it without wall noise. Self-cost leaf in a per-byte loop: specialize on the constant (pixel size via const generics) so the compiler drops bounds checks. Also ask who reads the work: a checksum nobody verifies (zlib Adler-32 in an image decoder that checks output length) is pure cost, and a library flag usually skips it.

## Worked cases
Rust game engine, native character compile (`load_bench`, 24 characters): baseline 3.9-4.2 s over 4 runs. Callgrind on one character put `decode_png` at 60% inclusive, called from a per-frame sprite read that re-decoded the same PNG and re-parsed `meta.json` for every frame. A content-checked decode cache cut instructions 4.27G to 2.73G and wall time to 3.1-3.3 s, with the crate tests green. Remaining lead: the first decode of each unique PNG. Wasm size on the same repo: 22.9 MB, 64% `.rodata` from embedded assets (a product decision, reported not changed).

Same repo, PNG decode: callgrind on a select-screen preview put `decode_png` at 77% inclusive, with the generic per-byte filter loop as top self cost (52%). Per-pixel-size Paeth/Average/Sub plus skipping Adler-32 took 2,610 PNGs (136 MB) from a 3,420 ms median to 2,220 ms (-35%, 3 runs each, spread under 4%, identical checksum). A cold first run took 8.9 s against 2.8 s warm for the same bench: discard it.
