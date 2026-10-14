# Administrative Instructions and Reference

Critical database operations guidelines and engine-specific command references.

## Safety Protocols
1.  **Safety First:** NEVER execute `DELETE` or `UPDATE` without a `WHERE` clause.
    *   **Postgres:** Open a transaction (`BEGIN; ... ROLLBACK;`) to test first.
2.  **Performance Analysis:**
    *   **Postgres:** Use `EXPLAIN ANALYZE` to understand the execution plan of slow queries.
    *   **Mongo:** Use `.explain("executionStats")` to check index usage.
3.  **Connection Security:** Use SSH tunnels or IAM Auth (Cloud SQL Proxy) instead of exposing ports publicly.

## Common Tasks

### PostgreSQL (`psql`)
*   **Connect:** `psql -h <host> -U <user> -d <db>`
*   **List Tables:** `\dt`
*   **Describe Table:** `\d <table_name>`
*   **Check Locks:** Query `pg_locks` to identify locks.
*   **Backup (Single Table):** `\copy (SELECT * FROM table) TO 'dump.csv' CSV HEADER`

### MongoDB (`mongosh`)
*   **Find:** `db.collection.find({ status: "active" }).limit(5)`
*   **Stats:** `db.collection.stats()` (Size, indices).

### Redis (`redis-cli`)
*   **Monitor:** `redis-cli monitor` (Real-time debug - Be careful in prod!).
*   **Memory Usage:** `redis-cli info memory`

## Read-Replica Lag and Stale Reads

Asynchronous replication means a replica can serve a row that is seconds behind the primary. Kleppmann
(*Designing Data-Intensive Applications*, ch. 5) frames the fix as choosing a consistency guarantee, not
hoping the lag stays small:

| Pattern | Guarantee | Cost |
|---|---|---|
| Read-your-writes | Route the reader to the primary for a short window after **that user's own** write | Extra load on the primary, scoped and temporary |
| Monotonic reads | Pin one user's session to the same replica for its duration | Uneven replica load; simple to implement (sticky session) |
| Track the replication position | Pass back the primary's LSN/binlog position after a write; the replica waits until it has replayed past that position before answering | Precise, but needs the driver or app to carry the position through |
| Accept staleness | Serve from any replica, no guarantee | Fine for dashboards, analytics, search — never for balances or idempotency checks |

```sql
-- PostgreSQL: measure it before choosing a strategy
SELECT now() - pg_last_xact_replay_timestamp() AS replica_lag;
```

A monitoring threshold alone is not a fix — decide, per read, whether staleness is acceptable, and route
accordingly. The [Symptom Routing](../SKILL.md) table treats "replica serves stale rows" as its own
diagnosis for a reason: it is a design choice made silently by default, not a bug with one root cause.

## Documentation Links
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Redis Documentation](https://redis.io/docs/)
