---
name: data-engineering
description: |
  Design and diagnose databases, SQL queries, migrations, analytics, and vector storage. Use for PostgreSQL, MySQL, Redis, schema migrations, zero-downtime DDL, pandas profiling, query plans, indexes, and aggregation.
---


# Data Engineering

## Preflight
Read-only, always, before forming an opinion.

```sql
SELECT version();
SELECT count(*) FROM pg_stat_activity WHERE state <> 'idle';
SELECT now() - pg_last_xact_replay_timestamp() AS replica_lag;
```

```bash
psql -c "\dt+"                 # sizes, before assuming anything scales
```

And the question that decides whether you may act at all: **has a restore been tested?**

## Workflow
1. Establish the ground truth first: engine and version, workload shape, data size, latency target, availability requirement, and whether a tested restore exists.
2. Collect read-only evidence before forming any opinion (see the intake commands).
3. Form one hypothesis and test it on representative data — not on an empty table, where every plan looks fine.
4. Apply the change through the repository's migration tool, then verify correctness, rollback, latency, resource use, and replication or consumer lag.

## Read-Only Intake

```sql
-- PostgreSQL: the real plan, with heap reads
EXPLAIN (ANALYZE, BUFFERS) <query>;

-- what actually costs time across the workload
SELECT query, calls, total_exec_time, mean_exec_time
  FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20;

-- who is blocking whom, right now
SELECT l.pid, a.state, a.wait_event_type, now()-a.xact_start AS age, a.query
  FROM pg_locks l JOIN pg_stat_activity a USING (pid)
 WHERE NOT l.granted;

-- bloat and autovacuum falling behind
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
  FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 20;
```

```bash
redis-cli --stat                  # ops/sec, memory, clients
redis-cli info keyspace           # key counts and TTL coverage
mongosh --eval 'db.currentOp({secs_running:{$gt:5}})'
```

`EXPLAIN ANALYZE` **runs the statement.** Against `UPDATE`, `DELETE`, or `INSERT` it applies the change — wrap it in a transaction and roll back, or plan the equivalent `SELECT`.

## Locks Are How a Metadata Change Becomes an Outage
`ALTER TABLE` takes an exclusive lock. Behind one long transaction it queues — and every query arriving after it queues behind *that*. The table is now unavailable while nothing appears to be running.

```sql
SET lock_timeout = '3s';        -- fail fast instead of blocking traffic
SET statement_timeout = '30s';
```

Check `pg_stat_activity` for long transactions first. Build indexes with `CREATE INDEX CONCURRENTLY` on a live table; the plain form holds a write lock for the whole build.

## Symptom Routing

| Symptom | First evidence | Usual cause |
|---|---|---|
| One query slow, others fine | `EXPLAIN (ANALYZE, BUFFERS)` | missing or unusable index; stale statistics |
| Everything slow at once | `pg_stat_activity` waits | lock contention, or a saturated connection pool |
| Writes hang, reads fine | `pg_locks` not granted | DDL queued behind a long transaction |
| Table grows, queries degrade | `n_dead_tup` vs `last_autovacuum` | autovacuum cannot keep up; bloat |
| Replica serves stale rows | `pg_last_xact_replay_timestamp()` | replication lag under write load |
| Redis latency spikes | `redis-cli --stat` | eviction, or a blocking command on a large key |

## Reference Routing
- Practical data cases: [real-world-cases.md](references/real-world-cases.md)
- Operational intake and DBA checks: [FORMS.md](references/FORMS.md)
- PostgreSQL, MongoDB, Redis, query, index, and backup guidance: [REFERENCE.md](references/REFERENCE.md)

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- No tested restore exists. Say so before any change that could need one; a backup is a belief until it is restored.
- A long transaction is open and DDL is queued behind it. Stop — the table is about to become unavailable.
- `EXPLAIN ANALYZE` is about to run against a write. Wrap it in a transaction and roll back, or plan the `SELECT`.

## Rules
- Hand off backend APIs to `backend-systems`, infrastructure deployment to `cloud-devops`, and telemetry metrics to `observability`.
- Query and index design belong to sql-authoring; expand/migrate/contract phasing to migration-engineering. Keep plan-based diagnosis, operations, locks, backup, and restore here.
- Never infer index value without a query plan and realistic selectivity. An index that helps a 100-row table may be ignored at a million rows.
- Never run destructive SQL, production migrations, cache flushes, or failovers without approval. `FLUSHALL` on a shared Redis is an outage, not a cleanup.
- Backups are not a rollback plan until a restore has been tested, timed, and written down. An untested backup is a belief.
- Apply schema changes through the repository's versioned migration tool, never hand-run DDL — a hand-run statement is invisible to every other environment.
- Separate the migration role (DDL) from the runtime application role (DML only).
- Schedule manual `VACUUM`/`ANALYZE` outside peak hours when autovacuum cannot keep up; rising `n_dead_tup` with a stale `last_autovacuum` is the tell.
- Never expose a database port publicly; reach it over a private path — VPC peering, bastion, or an IAM auth proxy.
- For vector search, record embedding model and version, dimensions, metric, chunking, filters, and a recall evaluation. Changing the model silently invalidates every stored vector.

## Checklist
- [ ] Engine, version, data size, and restore state known before any change.
- [ ] Evidence collected read-only; `EXPLAIN ANALYZE` never run against a write.
- [ ] Lock and statement timeouts set for any DDL on a live table.
- [ ] Change applied through the migration tool, with a tested rollback.
- [ ] Latency, correctness, and replication lag measured after the change.
