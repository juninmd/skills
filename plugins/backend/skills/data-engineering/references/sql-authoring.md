
# SQL Authoring

## Contents

- Preflight
- Workflow
- Reading the Plan
- Traps That Return Wrong Answers Silently
- Index Design
- Foreign-Key Indexes
- Row-Level Security Performance
- Job Queues With SKIP LOCKED
- Transaction Isolation Levels
- N+1 Query Detection
- Connection Pool Sizing
- Stop
- Rules
- Checklist

## Preflight
```sql
\d+ <table>                          -- columns, types, indexes that already exist
SELECT reltuples::bigint FROM pg_class WHERE relname = '<table>';   -- real cardinality
SHOW CREATE TABLE <table>;           -- MySQL: columns, indexes, engine
```

State the expected result shape and the uniqueness guarantee before writing. "One row per customer" is a claim the query must enforce.

## Workflow
1. State the data question, the expected result shape, the volume, and the uniqueness guarantee before writing anything. "One row per customer" is a claim the query must enforce, not a hope.
2. Write set-based SQL. Let the planner choose join order; a loop in application code is the slowest join ever written.
3. Keep predicates sargable — no function wrapping an indexed column, correct join keys, an explicit `LIMIT` where one applies.
4. Read the plan on representative data before trusting the query or adding an index.
5. For ORM code, read the generated SQL. The ORM's intent and the emitted query diverge exactly when it matters.
6. Test NULL, empty set, duplicates, and realistic cardinality; confirm with a count or boundary assertion.

## Reading the Plan

| Engine | Command |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>` |
| MySQL 8.0.18+ | `EXPLAIN ANALYZE <query>` (runs it, prints the iterator tree with actual time and rows) · `EXPLAIN FORMAT=TREE` (8.0.16+) or `FORMAT=JSON` to plan without running |
| SQLite | `EXPLAIN QUERY PLAN <query>` |

| In the plan | Means |
|---|---|
| `Seq Scan` on a large table with a selective filter | missing or unusable index |
| Estimated rows far from actual rows | stale statistics — `ANALYZE` the table |
| `Nested Loop` with a large outer side | the planner expected few rows and got many |
| High `Buffers: read` versus `hit` | working set does not fit cache |
| `Sort` spilling to disk | raise `work_mem` for the session, or index the sort |

The analyzing form **runs the statement**. Against `UPDATE`, `DELETE`, or `INSERT` it applies the change — wrap it in a transaction and roll back, or plan the equivalent `SELECT`.

MySQL before 8.0.18 has no analyzing form: read `EXPLAIN` and check `type` (`ALL` is a full scan), `key` (the index chosen, `NULL` for none), `rows`, and `Extra` (`Using filesort`, `Using temporary`). MySQL's `EXPLAIN ANALYZE` executes too, including multi-table `UPDATE` and `DELETE` (8.0.18+; `TABLE` statements from 8.0.19), so the same rollback rule holds.

```sql
SELECT VERSION();                                     -- 8.0.18+ before reaching for EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT o.id FROM orders o WHERE o.customer_id = 42 ORDER BY o.created_at DESC LIMIT 20;
SELECT * FROM sys.schema_unused_indexes;              -- write cost with no reader since restart
```

## Traps That Return Wrong Answers Silently

```sql
-- NOT IN with a NULL in the subquery returns ZERO rows, always.
SELECT * FROM o WHERE customer_id NOT IN (SELECT id FROM c);          -- wrong
SELECT * FROM o WHERE NOT EXISTS (SELECT 1 FROM c WHERE c.id = o.customer_id);

-- Pagination without a total ordering repeats and skips rows under writes.
ORDER BY created_at DESC                    -- ties are ordered arbitrarily
ORDER BY created_at DESC, id DESC           -- deterministic

-- Large OFFSET scans and discards every skipped row.
... ORDER BY id LIMIT 20 OFFSET 100000;                    -- reads 100020 rows
... WHERE id > :last_seen_id ORDER BY id LIMIT 20;         -- reads 20

-- COUNT over a LEFT JOIN counts the join, not the entity.
COUNT(*)              -- rows after the join
COUNT(DISTINCT o.id)  -- orders
```

Aggregates ignore NULL, so `AVG(col)` over a column with NULLs divides by a smaller denominator than you expect. `COALESCE` before aggregating when zero is the intended value.

## Index Design
An index earns its place by query shape and selectivity, never by hope. Composite order is **equality, then sort, then range** — the same rule holds for a MongoDB compound index. A column used only inside a function (`WHERE lower(email) = ...`) needs an expression index, or the plain one is ignored.

Every index is a tradeoff, not a free win: it speeds the reads it matches and slows every write to that table, because each `INSERT`/`UPDATE`/`DELETE` maintains it too. Reasoning that starts from the plan and the selectivity — never from "it can't hurt" — is the same discipline use-the-index-luke-style indexing guides teach.

| Option | Tradeoff | Use when |
|---|---|---|
| Full composite index on every filtered column | Fastest read, most write amplification, most storage | The query runs constantly and the table is read-heavy |
| Partial index (`WHERE status = 'active'`) | Small and cheap to maintain; useless outside its predicate | Most rows are irrelevant to the hot query (`WHERE deleted_at IS NULL`) |
| Covering index (`INCLUDE`/extra key columns) | Answers the query from the index alone (index-only scan); larger index, more write cost | The query is `SELECT` of a few columns filtered and sorted the same way, run at high frequency |
| No index, sequential scan accepted | Zero write cost | The table is small, or the query runs rarely and correctness matters more than latency |

```sql
-- Partial: only the rows the hot query actually filters on
CREATE INDEX CONCURRENTLY idx_orders_active ON orders (customer_id) WHERE status = 'active';

-- Covering: index-only scan, no heap fetch for these three columns
CREATE INDEX CONCURRENTLY idx_orders_summary ON orders (customer_id) INCLUDE (total, created_at);
```

See PostgreSQL's own reasoning on [partial indexes](https://www.postgresql.org/docs/current/indexes-partial.html) and [index-only scans](https://www.postgresql.org/docs/current/indexes-index-only-scans.html).

## Foreign-Key Indexes
PostgreSQL indexes the referenced key (it must be unique) but never the referencing column. Without that index, every join from the parent scans the child, and every `DELETE` or key `UPDATE` on the parent scans the child to enforce the constraint — under a lock, and once per parent row for a cascade. MySQL InnoDB creates the index automatically.

Index each foreign key that a join, a cascade, or a parent delete touches; a log table whose parent rows are never deleted or joined can skip it. Find the gaps — constraints whose columns are not the leading columns of a non-partial index:

```sql
SELECT c.conrelid::regclass AS table_name, c.conname AS fk_name, pg_get_constraintdef(c.oid) AS definition
  FROM pg_constraint c
 WHERE c.contype = 'f'
   AND NOT EXISTS (
         SELECT 1 FROM pg_index i
          WHERE i.indrelid = c.conrelid
            AND i.indpred IS NULL
            AND i.indnkeyatts >= cardinality(c.conkey)   -- INCLUDE columns do not count
            AND (string_to_array(i.indkey::text, ' ')::int2[])[1:cardinality(c.conkey)] @> c.conkey
            AND (string_to_array(i.indkey::text, ' ')::int2[])[1:cardinality(c.conkey)] <@ c.conkey)
 ORDER BY 1, 2;

CREATE INDEX CONCURRENTLY orders_customer_id_idx ON orders (customer_id);
```

An index whose first column is something else (`(region, customer_id)`) does not serve the lookup; the query above flags it. It also flags a partial index conservatively — confirm with the plan of `DELETE` on one parent row, inside a rolled-back transaction.

## Row-Level Security Performance
A policy is a predicate added to every query on the table. Written as `user_id = auth.uid()`, the function may be called once per row; wrapped as a scalar subquery it becomes an InitPlan evaluated once per statement. The same holds for `current_setting(...)` and any stable lookup that does not reference the row.

```sql
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE INDEX CONCURRENTLY docs_user_id_idx ON docs (user_id);    -- every column a policy filters on
CREATE INDEX CONCURRENTLY docs_team_id_idx ON docs (team_id);

CREATE POLICY docs_owner ON docs FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));                        -- once per statement, not per row

-- Membership: return the caller's set once instead of joining per row
CREATE FUNCTION private.my_team_ids() RETURNS SETOF bigint
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
  AS $$ SELECT team_id FROM public.team_members WHERE user_id = (SELECT auth.uid()) $$;
REVOKE EXECUTE ON FUNCTION private.my_team_ids() FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.my_team_ids() TO authenticated;

CREATE POLICY docs_team ON docs FOR SELECT TO authenticated
  USING (team_id IN (SELECT private.my_team_ids()));
```

- **The policy runs as the querying role.** Revoking `EXECUTE` from `authenticated` makes every query on `docs` fail with `permission denied for function`; revoke from `PUBLIC` (functions are executable by `PUBLIC` by default) and from roles that never query the table, and grant to the role the policy names.
- `SECURITY DEFINER` bypasses RLS on the tables the function reads. Pin `search_path = ''`, schema-qualify every name, filter by the caller's identity inside the body, and keep the schema out of anything exposed as an RPC API.
- `(SELECT f(team_id))` still runs per row — it references the row. Return the caller's set (`IN (SELECT ...)`) instead.
- Scope each policy with `TO <role>` so other roles skip it, and remember permissive policies combine with `OR`: each needs its own index.
- Verify as the real role: `SET ROLE authenticated; SET request.jwt.claims = '{"sub":"<uuid>"}'; EXPLAIN SELECT ...;` (set whatever claim your `auth.uid()` reads) and look for `InitPlan` and an index scan. Superusers and `BYPASSRLS` roles always bypass RLS, and the table owner does too unless `FORCE ROW LEVEL SECURITY` is set, so planning as them proves nothing.

## Job Queues With SKIP LOCKED
Workers that `SELECT ... FOR UPDATE` the oldest pending job serialize on the same row. `SKIP LOCKED` lets each worker claim rows no one else holds; claim and mark in one statement so a crash between them cannot strand a job.

```sql
CREATE INDEX jobs_pending_idx ON jobs (run_at) WHERE status = 'pending';

UPDATE jobs
   SET status = 'running', locked_by = :worker, locked_at = now(), attempts = attempts + 1
 WHERE id IN (SELECT id FROM jobs
               WHERE status = 'pending' AND run_at <= now()
               ORDER BY run_at
               LIMIT 10
               FOR UPDATE SKIP LOCKED)
RETURNING id, payload;
```

- Commit the claim before doing the work; a transaction held open across the job blocks vacuum and pins the row lock.
- Requeue rows stuck in `running` past a lease (`locked_at < now() - interval '5 minutes'`) and cap `attempts`, moving exhausted jobs to a dead-letter status.
- `SKIP LOCKED` gives no ordering or exactly-once guarantee: make the job idempotent. MySQL 8.0+ accepts `FOR UPDATE SKIP LOCKED` on InnoDB, but not this statement: it has no `RETURNING` and cannot update a table its own subquery reads, so claim with `SELECT ... FOR UPDATE SKIP LOCKED` and then `UPDATE` by id in the same transaction.
- A queue table churns: watch `n_dead_tup` and keep autovacuum aggressive on it.

## Transaction Isolation Levels
Concurrent transactions can see each other's uncommitted or changing data, and which anomalies are possible is set by the isolation level (ANSI SQL; Martin Kleppmann, *Designing Data-Intensive Applications*, ch. 7). Read the level in code, never assume the default:

| Anomaly | What it looks like | Prevented starting at |
|---|---|---|
| Dirty read | Transaction A reads a row Transaction B has written but not committed; B then rolls back and A acted on data that never existed | Read Committed |
| Non-repeatable read | A re-reads the same row twice in one transaction and gets different values because B committed a change in between | Repeatable Read |
| Phantom read | A re-runs the same range query twice and a new row appears because B inserted a matching row in between | Repeatable Read (PostgreSQL's MVCC implementation prevents it there) / Serializable per the ANSI standard |
| Write skew | Two transactions each read overlapping data, then each writes based on what they read, and the combined result violates an invariant neither transaction violated alone | Serializable only |

```sql
-- PostgreSQL: see the current default and set one for a transaction
SHOW default_transaction_isolation;
BEGIN ISOLATION LEVEL REPEATABLE READ;
```

Default isolation is usually Read Committed — it stops dirty reads but not the rest. Raise the level for the specific transaction that needs the stronger guarantee (an invariant spanning two reads, a check-then-act sequence) rather than raising it globally, since Serializable adds retry-on-conflict overhead across the whole workload. See [PostgreSQL: Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html).

## N+1 Query Detection
The query count grows with the result set instead of staying constant — one query to fetch a list, then one more per row to fetch each row's related data.

| Symptom | Likely cause | Fix |
|---|---|---|
| Query log shows the same shaped query repeated once per loop iteration | Application code (or ORM lazy loading) fetches an association inside a loop over the parent rows | Eager-load the association with a `JOIN` or a single batched `WHERE id = ANY(:ids)` |
| Request latency scales linearly with list length, not with total row count | Same root cause, seen from the outside | Add pagination and confirm the fix by counting queries per request, not by latency alone |
| ORM debug log ("N+1 detected") or a spike in `pg_stat_statements.calls` for one query shape | The framework's own N+1 detector, or read-only evidence from the intake commands | Batch-load, or restructure the access pattern around the read path |

## Connection Pool Sizing
A pool sized to "however many the driver defaults to" fails two ways: too small and requests queue on `pool.acquire()` while the database sits idle; too large and the database spends more time context-switching between connections than doing work.

| Symptom | Likely cause | Fix |
|---|---|---|
| Request latency spikes under load, `pool.acquire()` wait time rising, DB shows few active connections | Pool smaller than real concurrency | Size to sustained concurrent queries, not peak request count — most requests are not waiting on the DB the whole time |
| DB CPU pegged, many idle-in-transaction connections, throughput falls as pool size rises | Pool larger than the DB can serve concurrently | Shrink it; add a proxy (PgBouncer, ProxySQL) in transaction-pooling mode to multiplex many app connections onto fewer DB ones |
| Connections held across an external call (HTTP, queue publish) inside the same transaction | Long-held connection blocking others waiting on the pool | Do the external call outside the transaction, or outside the pooled connection entirely |

## Stop
- The plan has not been read on representative data. An empty table makes every plan look fine.
- Destructive SQL is about to run without a verified backup and explicit approval. Write the `SELECT` first and read its count.
- `EXPLAIN ANALYZE` would run against a write. Wrap it in a transaction and roll back.

## Rules
- Measure first, index second. Every index is paid for on every write and in storage.
- Use explicit `JOIN` syntax and qualify every column with its table alias; an unqualified column silently changes meaning when a table gains a column.
- Never run ad-hoc destructive SQL — `DROP`, `TRUNCATE`, or `UPDATE`/`DELETE` without `WHERE` — without a verified backup and explicit approval. Write the `SELECT` first and read its count.
- CTEs are an optimization fence in older PostgreSQL (pre-12) and still materialize when marked `MATERIALIZED`; check the plan before assuming they inline.
- For MongoDB, model documents around the read path — the shape you query is the shape you store.
- Schema change rollout — expand, migrate, contract — belongs to [migration-engineering](migration-engineering.md); lock behavior, DDL blocking, and online-change mechanics to `data-engineering`.

## Checklist
- [ ] Intent, expected shape, and uniqueness guarantee stated before writing.
- [ ] Plan read on representative data, without mutating it.
- [ ] NULL, empty set, and duplicate behavior verified — especially around `NOT IN` and aggregates.
- [ ] Pagination has a deterministic `ORDER BY` ending in a unique column.
- [ ] Every added index justified by a plan, not by intuition.

Adapted in part from supabase/agent-skills (MIT, © 2026 Supabase).
