---
name: caching-strategy
description: |
  Decide what to cache, at which layer, and how it becomes correct again. Use for cache key design, TTL and invalidation, stale-while-revalidate, stampede protection, CDN rules, and reasoning about acceptable staleness.
---

# Caching Strategy

## Workflow
1. Name the tolerance first: how stale may this value be before a user is misled? That number decides everything after it.
2. Measure the read-to-write ratio and the cost of a miss. Cheap or rarely reused values are not worth caching.
3. Pick the layer closest to the reader that can still be made correct: CDN, edge, application, or query cache.
4. Design the key to include every input that changes the value, tenant and locale and permissions included.
5. Choose the correctness mechanism: expiry for tolerant data, explicit invalidation on write for data that must be current, validators for large payloads.
6. Protect the miss path with single-flight or a jittered TTL, then verify the hit rate and staleness under real traffic.

## Rules
- A key that omits an input serves one user's data to another. Permission-varying responses must never share a key.
- A low hit rate is worse than no cache: you pay lookup, memory, and staleness for nothing. Measure it or remove it.
- Invalidation on write is correct and expensive; expiry is cheap and approximate. Pick one deliberately per value.
- Stale-while-revalidate buys latency without lying for long, and it is usually the right default for read-heavy pages.
- Synchronized TTLs expire together and stampede the origin. Add jitter, and serve one revalidation for concurrent misses.
- Never cache an error response with the success TTL, and never cache a partial or timed-out result at all.
- Layered caches multiply staleness. Know the worst-case age across every hop before promising freshness.

## Checklist
- [ ] Acceptable staleness is stated before the layer is chosen.
- [ ] Keys include every varying input, permissions included.
- [ ] Stampede protection is in place and hit rate is measured.
