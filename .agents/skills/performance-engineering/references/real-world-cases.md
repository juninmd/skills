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

## Case: agent hook latency from spawns and regex fan-out
- Symptom: a Rust PreToolUse hook added ~11 ms to every Grep call; its PostToolUse redactor took ~160 ms on a 1.1 MB output.
- Evidence: `strace -f -c` showed 3 `wait4` (three `git` spawns, ~2.5 ms each); callgrind put 71% of instructions in a 64-rule secret scan calling `captures_iter` per line.
- Fix: one `git rev-parse` for all three values; a `RegexSet` prefilter per line. Medians 10.9 → 6.7 ms and ~165 → ~107 ms, output sha256 unchanged.
- Lesson: for short-lived processes, count syscalls before reading a CPU profile.

## Case: 5000-item library froze on every keystroke
- Symptom: typing in a client-side filter took 2.2s per key (p50, 7 runs); opening the page took 2.9s.
- Evidence: CDP CPU profile was ~80% `(program)` (native style/layout/paint), ~20% JS; every card also ran an entrance animation.
- Fix: `content-visibility: auto` with `contain-intrinsic-size: auto …` on cards, and no animation past the first screen. CSS only: 0.44s per key, 0.5s to open; find-in-page and focus unchanged.
- Lesson: when native rendering owns the profile, cut rendered work before touching JS; guard the rule with a test.

## Case: dashboard catalog rebuild blocked the event loop
- Symptom: a Bun server rebuilt its JSON catalog synchronously on every cache miss; 2000 rows took 40ms p50, 57ms p95, stalling every request in flight.
- Evidence: `bun --cpu-prof` put 53% self-time in `bun:sqlite` `get`: one geocache lookup per row against an in-process SQLite, invisible in any query log. Next frame: a city resolver re-normalizing the same 30 constant names on every call.
- Fix: one `SELECT` into a `Map` per build, and the constant list normalized once at module load. 23ms p50, 29ms p95; all 7 independent runs after beat all 7 before (Mann-Whitney U = 0).
- Lesson: an N+1 against an embedded DB looks like CPU, not I/O; loop-invariant work hides in helpers called per row.

## Case: frontend bundle doubled silently
- Symptom: LCP degraded 1.2s on mobile after a "small" PR.
- Evidence: bundle analyzer showed a full icon library imported for one icon.
- Fix: per-icon import; CI budget assertion failing over 250KB gz per route.
- Lesson: size budgets in CI catch what review misses.

## Case: opening a 50k-file folder (Rust desktop viewer)
- Symptom: opening a large folder took ~200 ms before the first picture.
- Evidence: an ignored release-mode bench over 50 000 files, plus a standalone micro-benchmark with shuffled real-world names; the natural sort alone was ~250 ms because `natord::compare_ignore_case` lowercased every char on every comparison.
- Fix: case-fold each name once with the same per-char rule, sort with `natord::compare`; sort ~5x faster, `open()` 194-231 ms → 106-115 ms.
- Lesson: synthetic sequential names (`img00001`) hide comparator cost; bench with shuffled, realistic names.

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
