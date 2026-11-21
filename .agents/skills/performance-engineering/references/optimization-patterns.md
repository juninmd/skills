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

## Payload and transport
- Paginate by cursor, project only needed columns/fields, compress responses > 1KB.
- Prefer streaming for large payloads; cap request body size at the edge.

## Regression guards
- CI benchmark with warmup + median-of-N, failing on >X% drift against a stored baseline.
- Budgets as assertions: bundle KB per route, query count per endpoint, p95 in staging load test.
- Alert on trend slope (heap growth, latency drift), not just absolute thresholds.

## Load testing
- Open vs. closed workload model, k6 thresholds, and `dropped_iterations`: see [measurement-methodology.md](measurement-methodology.md), "Load Testing That Reflects Production Traffic Shape".

## When to stop
- Target met → stop; further optimization is unrequested complexity.
- Bottleneck moved to a layer you don't own → document and hand off with evidence.
