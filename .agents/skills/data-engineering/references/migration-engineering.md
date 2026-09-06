
# Migration Engineering

## Preflight
```sql
SELECT count(*) FROM <table>;                       -- how long will the backfill take
SELECT pg_size_pretty(pg_total_relation_size('<table>'));
```

```bash
rg -n '<old_column>' src/ | wc -l                    # every reader and writer
```

Enumerate **every** reader and writer of both shapes before phase one. The migration fails on the consumer nobody listed.

## Workflow
1. Write down the current shape, the target shape, and **every reader and writer of each**. A migration fails on the consumer nobody listed.
2. Split into expand, migrate, and contract phases that each ship and revert on their own.
3. Expand, 4. migrate, 5. reconcile, 6. contract — in that order, with a deploy between each.

## The Four Phases

| Phase | Do | Never |
|---|---|---|
| **Expand** | Add the new shape alongside the old: nullable, no rewriting default. Deploy with no behavior change. | Add a column with a volatile default — it rewrites the table under a lock |
| **Migrate** | Dual-write both shapes. Backfill history in bounded batches. Flip reads behind a flag. | Backfill in one unbounded `UPDATE` |
| **Reconcile** | Compare counts and per-key-range checksums for a full traffic cycle. Log every mismatch with its key. | Spot-check and call it parity |
| **Contract** | Remove writes, then reads, then the old shape. | Drop anything while a deployed version still reads it |

Between expand and contract, **N-1 and N+1 run at the same time**. Every deployed version must read and write both shapes; ship that tolerance before deleting either.

## Backfill Shape
An unbounded `UPDATE` takes a lock proportional to the table and turns a migration into an outage.

```sql
-- Batched, checkpointed, resumable, killable
UPDATE orders SET new_col = old_col
 WHERE id > :checkpoint AND new_col IS NULL
 ORDER BY id LIMIT 5000
 RETURNING id;   -- persist the last id as the next :checkpoint
```

Between batches: sleep, read replication lag, and honor a kill switch. A backfill that cannot be stopped mid-run is a backfill that will be stopped by an incident.

## Reconciliation Is the Gate

```sql
SELECT count(*) FILTER (WHERE new_col IS NULL) AS unmigrated,
       count(*) FILTER (WHERE new_col IS DISTINCT FROM old_col) AS divergent
  FROM orders;

-- per-range checksum, so a mismatch names where to look
SELECT id / 100000 AS bucket, md5(string_agg(new_col::text, ',' ORDER BY id))
  FROM orders GROUP BY 1;
```

Dual write is **not atomic**: a crash between the two writes diverges exactly that row. The old shape stays the source of truth until reconciliation closes clean over a full traffic cycle — including the nightly jobs and the weekly ones.

## Stop
- A reader or writer of the old shape has not been enumerated. Stop; that is the one that breaks.
- Reconciliation has not closed clean across a full traffic cycle. Do not run the contract phase.
- There is no live rollback path. That is a cutover — say so out loud and get that decision made deliberately.

## Rules
- Never combine a schema change and a behavior change in one deploy. When it breaks, you cannot attribute it.
- DDL locks harder than DML: build indexes concurrently, set `lock_timeout` so a blocked migration fails fast instead of queueing traffic behind it.
- A migration without a live rollback path is a cutover. Say so out loud and get that decision made deliberately, with a maintenance window if needed.
- Prefer a deterministic codemod plus review over hand-editing call sites, and commit the script — the next repository needs it too.
- Verify on a production-sized copy. Counts, null rates, and checksums are evidence; a passing test on 50 seed rows is not.
- Time-box the dual-write window and schedule the contract phase before starting. A half-done migration is permanent debt that everyone learns to work around.
- API deprecation follows the same shape: add the new field, dual-serve, announce with a date, then remove — `api-design` owns the contract rules.
- Lock behavior and database operation belong to `data-engineering`; slicing the rollout into shippable steps to `incremental-delivery`.

## Reference Routing
- Online DDL, reconciliation detail, and API deprecation/sunset windows: [online-ddl-and-api-migration.md](online-ddl-and-api-migration.md)

## Checklist
- [ ] Every reader and writer of both shapes enumerated before phase one.
- [ ] Expand, migrate, and contract ship as separate, individually revertible deploys.
- [ ] Backfill batched, checkpointed, throttled, and killable.
- [ ] Both deployed versions tolerate both shapes for the whole window.
- [ ] Reconciliation clean by count and checksum across a full traffic cycle.
- [ ] Contract phase scheduled, not merely intended.
