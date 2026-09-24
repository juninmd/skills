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

## Cases: claude.ai made 3x faster
Source: [how we made claude.ai 3x faster](https://claude.dev/blog/how-we-made-claude-ai-faster/). The lever was building new measurements; once a number existed, an agent could drive it down.

| Symptom | Evidence or technique | Lesson |
|---|---|---|
| Wall-clock benchmarks too noisy to gate CI | run under Valgrind with `node --predictable`, compare instruction counts to a checked-in baseline | a deterministic count gates merges; timings only confirm |
| App unusable until the framework boots | ship a static HTML copy of the input UI, let the framework paint over it; typeable page 3.1s → 0.55s | the first interaction does not need the framework |
| Every DOM change slow | a single `:root:has()` selector added 24ms per DOM change | profile style recalculation, not only scripts |
| Syntax highlighting slow on text with curly quotes or em dashes | non-Latin-1 strings take V8's two-byte regex path; copy the block into a one-byte string first | unicode content changes the engine path |
| Long streamed replies stutter at 120Hz | 8.33ms frame budget; memoize finished blocks, tokenize in a worker; main-thread work about 750ms → 200ms | budget per frame, not per request |
| Content jumps after load | Layout Instability API telemetry mapped by page region; 31% of loads shifted after usable | attribute shifts to a region before fixing |
