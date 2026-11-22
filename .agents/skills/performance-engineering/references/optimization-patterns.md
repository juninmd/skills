# Optimization Patterns

Apply only after the profile names the bottleneck.

## Caching
- Decide the invalidation story first: TTL, event-driven purge, or versioned keys. No story, no cache.
- Layer order: in-process LRU (bounded) → Redis → CDN. Cache the most expensive stable computation, not everything.
- Stampede control: single-flight/lock or stale-while-revalidate for hot keys.
- Negative caching for repeated misses; short TTL.

## Batching and N+1
- Collapse per-item queries with joins, `IN` lists, or a DataLoader-style batcher.
- Batch external API calls; respect provider limits with bounded concurrency (`p-limit`, `asyncio.Semaphore`).
- Write paths: buffer + flush by size/time, but state the durability window.
- Per-item existence checks in an ingest loop (`SELECT id WHERE guid = $1` per item) are N+1 too: one `WHERE guid = ANY($1) OR url = ANY($2)` per batch, then filter in memory.
- Per-row write loops: one `UPDATE t SET v = d.v FROM unnest($1::uuid[], $2::bool[]) AS d(id, v) WHERE t.id = d.id` instead of N round trips.

## Sorts and comparators
- A comparator runs O(n log n) times: per-call work in it (case folding, `Path::file_name`, locale collation, regex, parsing a date out of a name) multiplies by ~16x the item count at 50k items.
- Precompute the key: compute the key once per item, sort on it, drop it. Rust `sort_by_cached_key` when the key is `Ord`; a comparator-only crate (natural order) takes a pre-folded string plus its cheaper comparator.
- Prove order equivalence with a test that sorts tricky names (accents, `İ`, `Σ`, whitespace, leading zeros) both ways; `str::to_lowercase` differs from per-char `char::to_lowercase` on final sigma.

## Serial awaits (I/O fan-out)
- Signature: trace waterfall of back-to-back calls with no data dependency; CPU idle, latency = sum of round-trips. Cheapest win after N+1.
- Fix: `Promise.all` / `asyncio.gather` for independent calls, bounded `mapLimit(items, n, fn)` for lists; write results by index so order stays deterministic.
- Start each call inside an `async` lambda: `Promise.all([a.x(), b.y()])` leaks an unhandled rejection from `a.x()` when `b.y()` throws synchronously (missing method, bad arg).
- Keep calls that mutate shared state or depend on a prior write (accept suggestion, then read head SHA) in order.
- Guard: assert peak in-flight calls (`peak >= k`) with a fake client, not a wall-clock threshold; timing asserts are flaky, concurrency peaks are exact.
- The remote API's rate limiter still applies: parallelism cuts latency, not request count.

## Headless browsers
- Try a plain HTTP fetch plus an HTML parser first; server-rendered pages need no browser, and a browser costs hundreds of MiB and seconds per page.
- `waitUntil: "networkidle"` waits for ads and analytics to go quiet and often times out; use `domcontentloaded` plus `waitForSelector` on the element you read.
- Block images, fonts, and media through request interception or `page.route`; reuse one browser and close each context in `finally`.

## Concurrency
- Node: move CPU work to `worker_threads`; keep the loop for I/O.
- Python: CPU → processes, I/O → asyncio/threads; never mix sync drivers into async paths.
- Bound every queue and pool; unbounded concurrency is a self-inflicted DDoS.

## Skip work the answer cannot use
- Top-k or threshold queries over an aggregated tree (folder sizes, org totals, cost roll-ups): a parent's total bounds every child, so skip a subtree whose total is below the size floor or below the current k-th result. Results stay identical; keep equal-to-the-cut subtrees for tie-breaks.
- Guard it with a visit count, not a timer: assert how many nodes the walk touched, like an N+1 query count.

## UI thread
- Desktop IPC: a sync handler runs on the main thread and freezes the window for its whole duration. Tauri: `async fn` or `#[tauri::command(async)]` for anything that walks data or touches disk; Electron: `ipcMain.handle` with async work, never `sendSync`.
- A debounce only spaces the freezes out; it does not remove them.

## Process spawns
- A short-lived binary that shells out (`git`, `node`, a formatter) pays ~1-3 ms per child before any work. Count them with `strace -f -c`; merge calls (`git rev-parse --show-toplevel HEAD --symbolic-full-name HEAD` answers three questions in one spawn) or read the file directly.
- Keep the output byte-identical when the value is persisted (a fingerprint, a cache key), and pin it with a test against the old form.

## Multi-pattern scans
- N regexes run per line is N passes and, with capture APIs, N allocations even on a miss. Prefilter with one combined automaton: `RegexSet` (Rust), Aho-Corasick for literals, Hyperscan/Vectorscan for large rule sets (Wang et al., NSDI 2019). Run capture extraction only for the patterns the set reported.
- Same patterns on the same haystack keep semantics exact; prefiltering the whole file instead of each line breaks `^`/`$` anchors.

## Payload and transport
- Paginate by cursor, project only needed columns/fields, compress responses > 1KB.
- Prefer streaming for large payloads; cap request body size at the edge.

## Always-on loops (pollers, watchers, desktop companions)
Cost is per idle tick x ticks per day, paid even when nothing happens. Measure the tick where the input did NOT change; that is the common case.
- Order the gates cheapest first: a perceptual hash (dHash on a 9x8 downscale) of the raw input before any encode, upload, or model call. Encoding first and hashing the encoded copy pays the full cost to learn "same as before".
- Debounce on the cheap signal too: re-capture until two hashes agree, then encode once.
- Pause render and animation loops when hidden; throttle when unfocused or on battery. Re-check state from inside the loop, since focus and visibility events are not delivered reliably on every platform.
- Guard it: an ignored bench that prints the unchanged-tick cost, run before and after.
- Measured case (Tauri screen watcher, 3 s tick, 2048x1152 frame, release build, median of 9): resize + adaptive JPEG, then decode the JPEG twice for hash and text-density gate, cost 74.6 ms per unchanged tick; hashing and gating the raw frame and encoding only the settled changed capture cost 2.7 ms (3840x2160: 97.0 to 12.6 ms).

## Regression guards
- CI benchmark with warmup + median-of-N, failing on >X% drift against a stored baseline.
- Budgets as assertions: bundle KB per route, query count per endpoint, p95 in staging load test.
- Alert on trend slope (heap growth, latency drift), not just absolute thresholds.

## Load testing
- Open vs. closed workload model, k6 thresholds, and `dropped_iterations`: see [measurement-methodology.md](measurement-methodology.md), "Load Testing That Reflects Production Traffic Shape".

## When to stop
- Target met → stop; further optimization is unrequested complexity.
- Bottleneck moved to a layer you don't own → document and hand off with evidence.
