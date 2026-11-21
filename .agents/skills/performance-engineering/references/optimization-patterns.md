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

## Concurrency
- Node: move CPU work to `worker_threads`; keep the loop for I/O.
- Python: CPU → processes, I/O → asyncio/threads; never mix sync drivers into async paths.
- Bound every queue and pool; unbounded concurrency is a self-inflicted DDoS.

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
