# Runtime Profiling: Node, Bun, Rust, WebAssembly

Open after the target is written down and the layer is CPU or binary size. Profile first, one change per cycle, re-measure with the same command.

## Contents
- Pick the runtime
- Node and Bun
- Rust native
- Rust heap and static checks
- WebAssembly
- Rank before porting
- Worked case

## Pick the runtime

| Target | CPU profile | Fallback when the profiler is blocked |
|---|---|---|
| Node | `node --cpu-prof --cpu-prof-dir=prof app.js` | `npx 0x -- node app.js` |
| Bun | `bun --cpu-prof --cpu-prof-dir=prof app.ts` | `bun --inspect` plus Chrome DevTools |
| Rust CPU | `samply record ./target/release/<bin>` | `valgrind --tool=callgrind` (user space, no kernel setting) |
| Rust heap | `valgrind --tool=dhat --dhat-out-file=out.json <bin>` | none needed; no code change, works in containers |
| Wasm in browser | CDP `Profiler.start`/`stop` in headless Chromium | `console.time` around the exported call |
| Wasm size | `twiggy top -n 15 app_bg.wasm` | `wasm-opt --print` after `wasm-bindgen` |

## Node and Bun
Both write a V8-format `.cpuprofile`; one script ranks self time for either:
```bash
node --cpu-prof --cpu-prof-dir=prof app.js && node scripts/cpuprofile-top.mjs prof/*.cpuprofile 15
bun --cpu-prof --cpu-prof-dir=prof app.ts && bun scripts/cpuprofile-top.mjs prof/*.cpuprofile 15
```
Bun 1.4+ also writes the profile as grep-friendly Markdown (hot functions, call tree, callers per function): `bun --cpu-prof-md --cpu-prof-dir=prof app.ts`, and `--heap-prof-md` for heap. Read its `Called by:` list for `all`/`run` (bun:sqlite) to see which query owns the time before opening any SQL. Bun labels some frames `anonymous` with no URL; read the nearest named caller. A run under ~100 ms is startup noise: loop the workload or stop. Event-loop lag, heap diffs and pools stay in [profiling-playbook](profiling-playbook.md).

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

Bench harness: `divan` or `criterion` for wall time; `gungraun` (formerly `iai-callgrind`) for instruction counts that gate CI without timing noise. No harness in the repo: an `#[ignore]` test that times median and p90 over 9+ runs with `--release` is enough to compare before and after.
4. Compare instruction counts (`Collected`) and wall time across runs; instruction count is the noise-free signal, wall time is the user-visible one.

## Rust heap and static checks
```bash
valgrind --tool=dhat --dhat-out-file=out.json ./target/release/bench one-item-dir
node scripts/dhat-top.mjs out.json 5 my_crate     # peak-live and total bytes by allocation site
cargo clippy --release -q -- -W clippy::perf -W clippy::redundant_clone
```
- Read `t-gmax` (live bytes at the peak) first: it is RSS, and a per-item `clone()` of a big buffer shows as one site with N blocks of equal size. Fix with `Arc` plus copy-on-write (`Arc::make_mut`) so only the writers copy.
- Clippy perf lints are a lead list, not a result: on a 500 kLOC engine they flagged 3 `redundant_clone` and 1 `contains`, the rest was style. Confirm each on a profile before changing code.
- Use the same one-item input for callgrind and dhat so numbers compare.
- After adding a cache, grep for every other caller of the cached function: a sibling call site (a portrait loader beside the sprite loader) kept re-decoding until callgrind's inclusive cost for it was checked again (527M to 262M instructions).

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

## Measured and ruled out
Each was run on the real engine; none earned a code change. Re-run only if the profile changes.

| Tool or idea | Result |
|---|---|
| Hoisting the branch out of PNG Paeth/Average unfilter | 176.5 to ~175.5 ms over 129 PNGs: noise; inflate dominates |
| PGO (`-Cprofile-generate`/`-Cprofile-use`, needs `rustup component add llvm-tools-preview`) | mean 2805 to 2701 ms (~-4%), inside run spread; skip unless a release pipeline already has it |
| `cargo llvm-lines`, `cargo bloat --crates` | flat: top function 1.4% of lines, no monomorphization blowup |
| Existing render/vfs/load benches | already sub-millisecond; stop when the next entry is under the noise floor |
| Samply/flamegraph where `perf_event_paranoid` is 2 | blocked; use callgrind instead of changing the kernel setting |

## Worked case
Rust game engine, native character compile (`load_bench`, 24 characters): baseline 3.9-4.2 s over 4 runs. Callgrind on one character put `decode_png` at 60% inclusive, called from a per-frame sprite read that re-decoded the same PNG and re-parsed `meta.json` for every frame. A content-checked decode cache cut instructions 4.27G to 2.73G and wall time to 3.1-3.3 s, with the crate tests green. Second pass with dhat: a full RGBA clone per frame held 277 MB at peak for one character; sharing it through `Arc` with copy-on-write recolor cut the peak to 188 MB (-32%) with wall time unchanged. `decode_png` then ran 106 times for at most 129 files, so no repeated decode remained; the rest is inflate cost. Wasm size on the same repo: 22.9 MB, 64% `.rodata` from embedded assets (a product decision, reported not changed).
