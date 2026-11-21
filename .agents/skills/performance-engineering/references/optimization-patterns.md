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

## Process spawns
- A short-lived binary that shells out (`git`, `node`, a formatter) pays ~1-3 ms per child before any work. Count them with `strace -f -c`; merge calls (`git rev-parse --show-toplevel HEAD --symbolic-full-name HEAD` answers three questions in one spawn) or read the file directly.
- Keep the output byte-identical when the value is persisted (a fingerprint, a cache key), and pin it with a test against the old form.

## Multi-pattern scans
- N regexes run per line is N passes and, with capture APIs, N allocations even on a miss. Prefilter with one combined automaton: `RegexSet` (Rust), Aho-Corasick for literals, Hyperscan/Vectorscan for large rule sets (Wang et al., NSDI 2019). Run capture extraction only for the patterns the set reported.
- Same patterns on the same haystack keep semantics exact; prefiltering the whole file instead of each line breaks `^`/`$` anchors.

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
