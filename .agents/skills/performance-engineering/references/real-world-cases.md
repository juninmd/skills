# Performance Cases

Real failure shapes and the evidence that resolved them.

## Case: p95 spike after "harmless" ORM change
- Symptom: p95 went 180ms → 2.1s; p50 unchanged.
- Trap: averages hid it; dashboards showed "normal" mean latency.
- Evidence: query log showed one endpoint issuing 1+N `SELECT` per row after a lazy-relation change.
- Fix: eager load with a single join; assert query count in a test (`expect(queries).toHaveLength(2)`).
- Lesson: guard query counts, not response times, in unit-level tests.

## Case: Node service "randomly" slow under load
- Symptom: sporadic 5s responses, CPU low, no slow queries.
- Evidence: event-loop lag metric peaked at 4.8s; flamegraph showed synchronous `JSON.parse` of a 40MB payload.
- Fix: stream-parse and cap payload size at the boundary.
- Lesson: low CPU + high latency = look at the event loop, not the database.

## Case: memory leak that only fires in production
- Symptom: RSS climbs 24h, pod OOMKilled nightly.
- Evidence: two heap snapshots 1h apart diffed in DevTools; retained closures in a module-level cache with no eviction.
- Fix: LRU with max entries + TTL; alert on heap-growth slope, not absolute RSS.
- Lesson: a cache without eviction is a leak with a good reputation.

## Case: load test "proved" a regression that wasn't
- Symptom: benchmark 30% slower after refactor.
- Evidence: rerun with warmup and 10 samples showed overlapping distributions; first run had paid JIT/connection-pool cost.
- Fix: benchmark harness with warmup, fixed seed data, median-of-N.
- Lesson: one cold run is noise, not a regression.

## Case: frontend bundle doubled silently
- Symptom: LCP degraded 1.2s on mobile after a "small" PR.
- Evidence: bundle analyzer showed a full icon library imported for one icon.
- Fix: per-icon import; CI budget assertion failing over 250KB gz per route.
- Lesson: size budgets in CI catch what review misses.
