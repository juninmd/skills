# Online DDL and API Migration

## Online DDL

DDL takes stronger locks than any backfill statement, and a blocked DDL queues every query behind it.

- **Index creation.** Build concurrently (`CREATE INDEX CONCURRENTLY`, `ALGORITHM=INPLACE, LOCK=NONE`) so writers keep running. A concurrent build can fail and leave an invalid index; check for it and drop before retrying.
- **Lock timeout.** Set a short `lock_timeout` (and `statement_timeout`) before every DDL statement so a migration that cannot get its lock fails fast instead of piling up a queue of blocked queries behind the lock request.
- **Column defaults.** Adding a column with a constant default is metadata-only on current engines, but a volatile or expression default rewrites the whole table under an exclusive lock. Add the column nullable, backfill in batches, then set the default and the NOT NULL constraint separately.
- **Constraints.** Add `NOT VALID` first, backfill, then validate in a second statement that takes a weaker lock.
- **Type changes.** A type change that is not binary-coercible rewrites the table. Prefer a new column plus dual write over an in-place alter.
- **Renames and drops.** Never rename in place during a rollout; add the new name, dual-write, contract later. Drop a column only after no deployed version references it.

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
