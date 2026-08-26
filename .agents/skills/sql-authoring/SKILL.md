---
name: sql-authoring
description: |
  Write correct, performant SQL and schema designs. Use for PostgreSQL, MySQL, SQLite, and MongoDB query authoring, schema and index design, ORM query translation, window functions, CTEs, joins, and pagination.
---

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
- Schema change rollout — expand, migrate, contract — belongs to `migration-engineering`; lock behavior, DDL blocking, and online-change mechanics to `data-engineering`.

## Checklist
- [ ] Intent, expected shape, and uniqueness guarantee stated before writing.
- [ ] Plan read on representative data, without mutating it.
- [ ] NULL, empty set, and duplicate behavior verified — especially around `NOT IN` and aggregates.
- [ ] Pagination has a deterministic `ORDER BY` ending in a unique column.
- [ ] Every added index justified by a plan, not by intuition.
