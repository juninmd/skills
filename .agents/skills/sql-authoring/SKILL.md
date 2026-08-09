---
name: sql-authoring
description: |
  Write correct, performant SQL and schema designs. Use for PostgreSQL, MySQL, SQLite, and MongoDB query authoring, schema and index design, ORM query translation, window functions, CTEs, joins, and migration-safe model changes.
---

# SQL Authoring

## Workflow
1. State the data question, expected result shape, volume, and uniqueness guarantees before writing the query.
2. Prefer set-based SQL over row-by-row logic; let the planner choose join order.
3. Keep predicates sargable: no functions on indexed columns, correct join keys, explicit `LIMIT` where applicable.
4. Verify with `EXPLAIN (ANALYZE, BUFFERS)` on representative data before trusting the query or adding an index.
5. For ORM models, read the generated SQL and confirm it matches the intent and uses the intended indexes.
6. Test NULL, empty sets, duplicates, and realistic cardinality; confirm results with a count or boundary assertion.

## Rules
- Indexes follow from query shape and selectivity; measure first, add second.
- Use explicit `JOIN` syntax and qualify every column with its table alias.
- Never run ad-hoc destructive SQL (`DROP`, `TRUNCATE`, or `UPDATE`/`DELETE` without `WHERE`) without a verified backup and explicit approval.
- Keep migrations backward compatible: expand, migrate data, contract.
- For MongoDB, model documents around the read path and keep compound-index fields ordered by equality, sort, range.

## Checklist
- [ ] Query intent and expected shape are explicit.
- [ ] Plan checked on representative data.
- [ ] NULL, empty, and duplicate cases verified.
