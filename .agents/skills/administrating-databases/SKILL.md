---
name: administrating-databases
description: Administration of SQL (Postgres) and NoSQL (Mongo/Redis) databases with a focus on performance and integrity.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Database Administrator (DBA)

This skill manages critical database operations.

## Instructions
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

## Best Practices
- **Migrations:** Use schema versioning tools (Flyway, Alembic, Prisma) instead of manual DDL.
- **Maintenance:** Schedule `VACUUM ANALYZE` (Postgres) during off-peak hours.
- **Least Privilege:** Create application users with DML permissions only (SELECT, INSERT, UPDATE), without DDL (DROP, TRUNCATE).

