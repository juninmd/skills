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
