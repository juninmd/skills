# data-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `FORMS.md` | Filling in the field-by-field form for a SQL or NoSQL admin operation request (connection string, query, params) |
| `REFERENCE.md` | PostgreSQL/MongoDB/Redis admin commands, connection security, and read-replica lag / stale-read handling: [REFERENCE](REFERENCE.md) |
| `data-analysis.md` | CLI-first profiling, size-based load strategy, pandas memory profiling and dtype downcasting, reshape traps, and scrubbing before sharing: [data-analysis](data-analysis.md) |
| `migration-engineering.md` | Expand/migrate/contract phases, batched backfill, reconciliation, and idempotent/rollback-safe migrations: [migration-engineering](migration-engineering.md) |
| `online-ddl-and-api-migration.md` | Running DDL against a live table (index/column/constraint/type change) without locking writers, or sunsetting an API surface safely |
| `privacy-and-scale.md` | Exporting or sharing a dataset with PII/quasi-identifiers, or loading a CSV/dataframe too large to fit in memory |
| `real-world-cases.md` | Diagnosing a live slow query, schema migration, Redis/cache issue, or vector-search recall problem and need the checklist first |
| `redis-operations.md` | Redis data modeling, connection pooling, cluster hash tags, ACL hardening, eviction policies, cache-stampede prevention, INFO/SLOWLOG triage, RQE search, semantic cache |
| `sql-authoring.md` | Plan reading, index tradeoffs (partial/covering), transaction isolation anomalies, N+1 detection, and connection pool sizing: [sql-authoring](sql-authoring.md) |
| `vector-databases.md` | Qdrant collection design, memory tiers and quantization, latency tuning, hybrid search prefetches, fusion (RRF/DBSF), grouping recall |
| `backup-and-recovery.md` | Setting RPO/RTO, 3-2-1 and immutable backups, PostgreSQL/MySQL point-in-time recovery, scheduled restore drills, and the disaster recovery runbook |
