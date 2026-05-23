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

## Documentation Links
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Redis Documentation](https://redis.io/docs/)
