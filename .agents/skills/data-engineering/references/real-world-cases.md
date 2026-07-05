# Data Engineering Real-World Cases

Use this first for database, cache, migration, and vector-search work.

## Slow Query
- Capture exact SQL/filter, parameters shape, row counts, latency target, and current plan.
- Check selectivity, sort/group cost, joins, lock waits, cache hit rate, and missing/stale stats.
- Test index changes against representative data before recommending production migration.
- Prove with before/after plan and latency.

## Schema Migration
- Use expand/migrate/contract when application versions overlap.
- Backfill in bounded batches with progress, retry, and pause/resume behavior.
- Verify rollback or forward-fix path before production execution.
- Test old and new application versions against the transitional schema.

## Redis or Cache Issue
- Identify key pattern, TTL, cardinality, memory, eviction, hot keys, and serialization format.
- Avoid broad flushes; prefer scoped invalidation.
- Test stampede behavior, stale reads, and unavailable cache fallback.

## Vector Search
- Record embedding model/version, dimensions, metric, index params, chunking, and metadata filters.
- Evaluate recall with known relevant examples, not only latency.
- Rebuild or migrate indexes with compatibility and rollback plan.
