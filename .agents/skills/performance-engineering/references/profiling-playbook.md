# Profiling Playbook

Pick the layer the symptom points to; collect evidence read-only first.

## Node.js
- CPU: `node --cpu-prof app.js` then open the `.cpuprofile` in DevTools; or `npx 0x -- node app.js` for a flamegraph.
- Event-loop lag: `perf_hooks.monitorEventLoopDelay()`; sustained p99 > 100ms means synchronous work on the loop.
- Heap: `node --heapsnapshot-signal=SIGUSR2`, take two snapshots apart, diff retained size by constructor.
- Async traps: `console.time` around awaits lies under concurrency; use `async_hooks`-based APM or manual spans.

## Python
- CPU sampling without code changes: `py-spy top --pid <pid>` or `py-spy record -o profile.svg --pid <pid>`.
- Deterministic: `python -m cProfile -o out.prof -m app` then `snakeviz out.prof`.
- Memory: `tracemalloc` snapshots diffed; `objgraph.show_growth()` for leak suspects.
- Async: blocked event loop shows as high `select`/`epoll` gaps; `asyncio` debug mode logs >100ms callbacks.

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
