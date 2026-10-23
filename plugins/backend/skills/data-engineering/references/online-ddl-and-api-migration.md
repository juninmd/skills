# Online DDL and API Migration

## Online DDL

DDL takes stronger locks than any backfill statement, and a blocked DDL queues every query behind it.

- **Index creation.** Build concurrently (`CREATE INDEX CONCURRENTLY`, `ALGORITHM=INPLACE, LOCK=NONE`) so writers keep running. A concurrent build can fail and leave an invalid index; check for it and drop before retrying.
- **Lock timeout.** Set a short `lock_timeout` (and `statement_timeout`) before every DDL statement so a migration that cannot get its lock fails fast instead of piling up a queue of blocked queries behind the lock request.
- **Column defaults.** Adding a column with a non-volatile default (a constant or `now()`) is metadata-only on current PostgreSQL, but a volatile default (`clock_timestamp()`) rewrites the whole table under an exclusive lock. Add the column nullable, backfill in batches, then set the default as its own statement and add NOT NULL per **Constraints**.
- **Constraints.** Add `NOT VALID` first, backfill, then validate in a second statement that takes a weaker lock. `SET NOT NULL` alone scans the whole table under `ACCESS EXCLUSIVE`. On PostgreSQL 12-17, add `CHECK (col IS NOT NULL) NOT VALID`, then `VALIDATE CONSTRAINT` (`SHARE UPDATE EXCLUSIVE`, writes continue), then `SET NOT NULL` (skips the scan but still takes `ACCESS EXCLUSIVE` briefly), then drop the CHECK as a separate statement. On PostgreSQL 18+, `ADD CONSTRAINT name NOT NULL col NOT VALID` followed by `VALIDATE CONSTRAINT name` is the native route. Keep `lock_timeout` on each `ADD CONSTRAINT` and `SET NOT NULL`.
- **Type changes.** A type change that is not binary-coercible rewrites the table. Prefer a new column plus dual write over an in-place alter.
- **Renames and drops.** Never rename in place during a rollout; add the new name, dual-write, contract later. Drop a column only after no deployed version references it.

## MySQL online DDL

InnoDB picks an algorithm per change; name it so the statement fails instead of silently falling back to a full table copy that blocks writes.

| Change | Request | Notes |
|---|---|---|
| Add a column, set or drop a default, rename a column | `ALGORITHM=INSTANT` | metadata only; 8.0.12+ for trailing columns, 8.0.29+ at any position; a table has a limit of instant row versions, after which a rebuild is needed |
| Add or drop a secondary index | `ALGORITHM=INPLACE, LOCK=NONE` | writes continue; a brief metadata lock at start and end |
| Add a primary key, `FORCE` a rebuild | `ALGORITHM=INPLACE, LOCK=NONE` | writes continue but the whole table is rebuilt: plan for the I/O and the replica lag |
| Change a column type (other than widening a `VARCHAR` within its length-byte size), convert the charset | `ALGORITHM=COPY` (rejected under `LOCK=NONE`) | copies the table and blocks writes: use gh-ost or pt-online-schema-change instead |

```sql
SET SESSION lock_wait_timeout = 5;                    -- metadata-lock wait; the default is a year
SELECT trx_id, trx_started, trx_query FROM information_schema.innodb_trx ORDER BY trx_started LIMIT 5;
ALTER TABLE orders ADD COLUMN note VARCHAR(255) NULL, ALGORITHM=INSTANT;
ALTER TABLE orders ADD INDEX idx_orders_customer (customer_id), ALGORITHM=INPLACE, LOCK=NONE;
```

Every `ALTER` waits for an exclusive metadata lock behind open transactions, and new queries queue behind it — the same outage shape as PostgreSQL. Check `innodb_trx` first and keep `lock_wait_timeout` short. On a replica, an in-place change replays single-threaded and shows up as replication lag for the length of the build.

For a change that would copy the table:

| Tool | Mechanism | Choose when |
|---|---|---|
| gh-ost | copies rows into a shadow table and applies changes from the binary log; no triggers; throttles on replica lag; cut-over can be postponed | row-based binary logging is available and write load must stay unchanged |
| pt-online-schema-change | copies rows and keeps the shadow table current with triggers | binary log access is not available; accept trigger write overhead and check existing triggers and foreign keys first |

```bash
gh-ost --host=replica-1 --database=app --table=orders \
  --alter="MODIFY total DECIMAL(12,2) NOT NULL" --max-lag-millis=1500 \
  --postpone-cut-over-flag-file=/tmp/gh-ost.postpone          # no --execute: a dry run
pt-online-schema-change --alter "MODIFY total DECIMAL(12,2) NOT NULL" D=app,t=orders --max-lag 2 --dry-run
```

Run each without `--execute` first, then with it under the same approval as any production migration. A killed run can leave shadow tables (gh-ost `_<table>_gho`/`_ghc`) or pt-osc triggers behind: list and clean them before retrying.

## Reconciliation detail

- Compare row counts per key range, not just a global count.
- Compare a checksum (hash of the normalized new shape versus the old shape) per key range so a mismatch localizes to a bounded set of rows.
- Define the acceptable divergence explicitly: rows written in the last few seconds may legitimately differ, everything older must match exactly.
- Log every mismatch with its primary key to a dedicated table or stream, and require that stream to be empty of unexplained entries before contracting.

## API and consumer migration

- Version the surface and ship the new shape beside the old rather than mutating the old one.
- Mark the old surface with a `Deprecation` header and a `Sunset` header carrying the removal date; document the replacement in a `Link` header.
- Announce the sunset window before it starts and hold it for its full length.
- Track per-consumer traffic on the deprecated surface. Remove only when it reaches zero, or when the remaining callers have explicitly accepted the break.
- Keep the removed route returning a typed error with a migration message for one release rather than a bare 404.
