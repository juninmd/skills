
# SQL Authoring

## Preflight
```sql
\d+ <table>                          -- columns, types, indexes that already exist
SELECT reltuples::bigint FROM pg_class WHERE relname = '<table>';   -- real cardinality
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
| MySQL 8.0+ | `EXPLAIN ANALYZE <query>` · `EXPLAIN FORMAT=JSON` for cost detail |
| SQLite | `EXPLAIN QUERY PLAN <query>` |

| In the plan | Means |
|---|---|
| `Seq Scan` on a large table with a selective filter | missing or unusable index |
| Estimated rows far from actual rows | stale statistics — `ANALYZE` the table |
| `Nested Loop` with a large outer side | the planner expected few rows and got many |
| High `Buffers: read` versus `hit` | working set does not fit cache |
| `Sort` spilling to disk | raise `work_mem` for the session, or index the sort |

The analyzing form **runs the statement**. Against `UPDATE`, `DELETE`, or `INSERT` it applies the change — wrap it in a transaction and roll back, or plan the equivalent `SELECT`.

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
