
# Caching Strategy

## Preflight
Answer this before choosing anything: **how stale may this value be before a user is misled?** In seconds.

```bash
rg -n 'Cache-Control|s-maxage|stale-while-revalidate|ETag' src/ | head
redis-cli info stats | rg 'keyspace_(hits|misses)'    # is the existing cache even working?
```

## Workflow
1. Name the tolerance first: **how stale may this value be before a user is misled?** That one answer decides the layer, the TTL, and the invalidation strategy. Skipping it is why most caches are wrong.
2. Measure the read-to-write ratio and the cost of a miss. A value read twice per write is not worth caching.
3. Pick the layer closest to the reader that can still be made correct.
4. Key on every input that changes the value — tenant, locale, permissions, feature flags, currency.
5. Choose the correctness mechanism to match the tolerance.
6. Protect the miss path, then verify hit rate and observed staleness under real traffic.

## Layer

| Layer | Staleness you accept | Invalidation reach |
|---|---|---|
| Browser | until `max-age` expires — **you cannot purge it** | none |
| CDN / edge | seconds after a purge | surrogate keys, global |
| Application (Redis) | immediate on write | explicit, cluster-wide |
| In-process | per replica, until TTL | none across replicas |
| Query / ORM | request or transaction | usually automatic |

In-process caches are the quiet trap: purging Redis does nothing to the copy each replica already holds.

## Mechanism by Tolerance

| Tolerance | Mechanism |
|---|---|
| Minutes to hours | plain TTL |
| Seconds, read-heavy | `stale-while-revalidate` — serve stale, refresh behind |
| Must be current after a write | invalidate on write, or write-through |
| Large payload, rarely changes | validators (`ETag`/`If-None-Match`) — revalidate cheap, transfer only on change |
| Never stale | do not cache it |

## HTTP Contract

```http
Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600
ETag: "a1b2c3"
Vary: Accept-Language, Authorization
Surrogate-Key: order-123 tenant-42
```

`max-age` is the browser, `s-maxage` the shared cache. `Vary` must list **every** header the response depends on — a missing `Vary: Authorization` is how one user's data reaches another. Surrogate keys let a purge target an entity instead of guessing URLs.

## Stampede
A popular key expires, N concurrent requests all miss, and all N hit the origin at once. TTLs set together expire together, so the whole cache does this in unison.

- Jitter every TTL (`ttl * (0.9 + random*0.2)`).
- Single-flight: one request recomputes, the rest wait for it.
- Or refresh ahead of expiry, so nothing is ever actually missing.

## Stop
- The staleness tolerance is unstated. Stop; every other decision depends on it.
- A permission- or tenant-varying response would share a cache key. That is a data-leak bug, not a tuning issue.
- Hit rate cannot be measured. Do not ship the cache — an unmeasured cache is cost and staleness for unknown benefit.

## Rules
- A key that omits an input serves one user's data to another. Permission-varying responses must never share a key — this is a security bug, not a performance bug.
- A low hit rate is worse than no cache: you pay lookup, memory, and staleness for nothing. Measure it or delete it.
- Never cache an error with the success TTL, and never cache a partial or timed-out result at all.
- Cache negative results deliberately: without a short-TTL "not found" entry, every miss on a missing key hits the origin — which is exactly what an enumeration attack produces.
- Invalidation is asynchronous and best-effort. A CDN purge takes seconds to propagate. Layers multiply: know the worst-case age across every hop, not per layer.
- A cache with no memory limit and no eviction policy is a pending outage. Set both, and know which policy the store actually applies.
- Profile with `performance-engineering` before caching avoidable work — a cache over an N+1 still fires on every miss. Browser and CDN delivery belongs to `web-performance`.

## Checklist
- [ ] Acceptable staleness stated in seconds before any layer was chosen.
- [ ] Read/write ratio and miss cost measured; caching justified.
- [ ] Key includes every varying input, permissions included; `Vary` matches.
- [ ] Mechanism matches the stated tolerance.
- [ ] Stampede protected by jitter, single-flight, or early refresh.
- [ ] Memory limit and eviction policy set; hit rate and worst-case age observed in production.
