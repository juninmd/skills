# Profiling Playbook

Pick the layer the symptom points to; collect evidence read-only first.

## Node.js
- CPU: `node --cpu-prof app.js` then open the `.cpuprofile` in DevTools; or `npx 0x -- node app.js` for a flamegraph.
- Event-loop lag: `perf_hooks.monitorEventLoopDelay()`; sustained p99 > 100ms means synchronous work on the loop.
- Heap: `node --heapsnapshot-signal=SIGUSR2`, take two snapshots apart, diff **retained size** (an object plus everything it alone keeps alive) by constructor — not **shallow size** (the object itself), which hides a small wrapper holding a huge closure or array. A constructor with growing retained size and flat shallow size is the leak; a big shallow size alone is just a big object, not a leak.
- Async traps: `console.time` around awaits lies under concurrency; use `async_hooks`-based APM or manual spans.
- Connection pool: log or export pool `size`, `available`, and `pending` (waiting checkouts) from the driver; a `pending` count that only grows under load, with DB CPU idle, is pool exhaustion, not a database problem.

## Python
- CPU sampling without code changes: `py-spy top --pid <pid>` or `py-spy record -o profile.svg --pid <pid>`.
- Deterministic: `python -m cProfile -o out.prof -m app` then `snakeviz out.prof`.
- Memory: `tracemalloc` snapshots diffed; `objgraph.show_growth()` for leak suspects. Diff by **retained size** — the object graph reachable only from the suspect — not just object count; `objgraph.by_type()` counts instances but not what they hold onto.
- Async: blocked event loop shows as high `select`/`epoll` gaps; `asyncio` debug mode logs >100ms callbacks.
- Connection pool: SQLAlchemy's `pool.status()` or the driver's checked-out/overflow counters; a rising checked-out count with flat query latency at the DB means the app, not the database, is the bottleneck.

## N+1 Detection in Tests, Not Just Production
A latency benchmark cannot tell "3 queries" from "3,004 queries" if both finish inside the noise floor on seed data. Assert the count directly, in the test, so the regression fails in CI before it ever needs a profiler:

```ts
// Jest + a query-count hook the DB client exposes
const before = db.queryCount();
await getOrderWithItems(orderId);
expect(db.queryCount() - before).toBe(2); // one order, one batched items query — not 1 + N
```

```python
# pytest + django's assertNumQueries, or an equivalent counter on any ORM
def test_no_n_plus_one(django_assert_num_queries):
    with django_assert_num_queries(2):
        list(get_orders_with_items())
```

A raw count assertion is more valuable than a latency threshold here: it fails deterministically regardless of machine speed, and it fails at N=4 with seed data instead of waiting for N=4,000 in production.

## SQL
- Postgres: `EXPLAIN (ANALYZE, BUFFERS)` on realistic data; seq scan on large table + low rows returned = index candidate; verify selectivity first.
- Find the offenders: `pg_stat_statements` ordered by `total_exec_time`.
- Locks: `pg_locks` joined to `pg_stat_activity` before blaming the planner.

## Browser
- Waterfall in DevTools Performance panel; look for long tasks (>50ms), layout thrash, and render-blocking chains.
- Core Web Vitals in the field beat lab numbers; use CrUX or RUM before optimizing lab-only scores.
- Bundle: `vite-bundle-visualizer` / `webpack-bundle-analyzer`; check per-route gz size, not total.

## Load testing
- Tool: `k6` or `autocannon`; fixed dataset, stated cache state, ramp profile matching real traffic.
- Report p50/p95/p99 + error rate together; a fast p50 with 2% errors is a failure.
- Warm up before measuring; discard the first interval.
- Match the **shape**, not just the volume: real traffic is bursty and diurnal, not a flat RPS line; a synthetic single payload flatters cache hit rate versus a real payload-size mix; a cold pool/cache versus production's warm steady state changes which layer saturates first. A load test that passes on shape it never checked is confident, wrong data — see [measurement-methodology](measurement-methodology.md) for the mismatch table.
