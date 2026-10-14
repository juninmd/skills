# Database Administration and Safety Protocols

Open when executing database administrative queries, structuring operational intake requests, verifying safety boundaries, or handling read-replica lag.

## Contents

- Operational Safety Protocols
- Operational Intake Specifications (SQL & NoSQL)
- Engine Administration Quick Reference
- Read-Replica Lag and Consistency Guarantees
- Connection and Access Hardening

## Operational Safety Protocols

1. **Transaction Guardrails:** Never run unwrapped `UPDATE` or `DELETE` statements on production databases without a dry-run or transaction wrapper (`BEGIN; ... ROLLBACK;`).
2. **Explicit WHERE Clauses:** Always enforce targeted primary key or indexed filters. Prohibit unbounded batch mutations.
3. **Execution Plan Validation:**
   - PostgreSQL: Prepend `EXPLAIN (ANALYZE, BUFFERS)` to inspect live execution cost, index coverage, and buffer hits.
   - MongoDB: Run `.explain("executionStats")` to verify index intersection and scanned vs. returned document ratios.
4. **Network Exposure:** Prohibit exposing raw database ports (`5432`, `27017`, `6379`) to public interfaces. Use private VPC endpoints, SSH tunnels, or identity-aware proxies (e.g., Cloud SQL Proxy).

## Operational Intake Specifications (SQL & NoSQL)

### SQL Operation Payload

When submitting operational mutation or diagnostic requests, supply structured parameters:

| Field | Description | Example |
|---|---|---|
| `connection_uri` | Target database connection identifier | `postgresql://user:pass@db.internal:5432/primary` |
| `query` | Parameterized SQL statement | `SELECT id, email FROM users WHERE tenant_id = $1 AND is_active = $2;` |
| `parameters` | Positional JSON array or named parameter map | `["tenant-42", true]` |
| `max_runtime_seconds` | Strict query timeout ceiling | `5` |

### NoSQL Operation Payload (MongoDB)

| Field | Description | Example |
|---|---|---|
| `connection_uri` | Target cluster endpoint | `mongodb://db.internal:27017/analytics` |
| `collection` | Target document collection | `"events"` |
| `operation` | Execution method (`find`, `updateOne`, `bulkWrite`) | `"updateOne"` |
| `filter` | Strict JSON query filter | `{"tenant_id": "tenant-42", "event_id": "evt-99"}` |
| `mutation` | Bounded update payload | `{"$set": {"status": "processed"}}` |

## Engine Administration Quick Reference

### PostgreSQL (`psql`)

```bash
# Connect with connection string
psql "$DATABASE_URL"

# List relations and table descriptions
\dt
\d+ <table_name>

# Inspect active locks and blocked processes
SELECT pid, relation::regclass, mode, granted FROM pg_locks WHERE NOT granted;

# Export table slice with CSV headers
\copy (SELECT * FROM users WHERE created_at >= NOW() - INTERVAL '7 days') TO 'export.csv' CSV HEADER
```

### MongoDB (`mongosh`)

```javascript
// Query collection sample with projection
db.collection.find({ active: true }, { email: 1, created_at: 1 }).limit(10);

// Inspect collection and index footprint
db.collection.stats();
```

### Redis (`redis-cli`)

```bash
# Memory footprint and key statistics
redis-cli info memory
redis-cli info stats

# Inspect slow queries
redis-cli slowlog get 20
```

## Read-Replica Lag and Consistency Guarantees

Asynchronous replication causes read replicas to trail the primary instance. Mitigate stale reads by selecting the appropriate consistency pattern:

| Consistency Pattern | Operational Guarantee | Trade-off / Cost |
|---|---|---|
| **Read-Your-Writes** | Direct reads to the primary database for a bounded window (e.g., 5 seconds) following an explicit user write | Brief scoped load on primary; eliminates user-visible stale updates |
| **Monotonic Reads** | Bind a user session to a single designated replica for the duration of its lifecycle | Ensures time flows forward for that session; requires sticky session routing |
| **Position-Aware Routing** | Capture the primary transaction log sequence number (LSN/binlog); wait until the replica replays past that LSN before resolving the query | Exact consistency; requires application or driver support to propagate tokens |
| **Eventual Staleness** | Route queries to any active read replica | Zero coordination overhead; strictly for reporting, aggregate analytics, or background search |

```sql
-- PostgreSQL: Measure replica replay lag
SELECT NOW() - pg_last_xact_replay_timestamp() AS replica_lag;
```

## Connection and Access Hardening

- Configure strict client connection pools (e.g., PgBouncer in transaction pooling mode).
- Set `statement_timeout` (e.g., `5s` for web queries, `30s` for background jobs) to prevent runaway connections.
- Ensure read-only database roles cannot invoke DDL or write operations through privilege separation (`REVOKE ALL ON ALL TABLES IN SCHEMA public FROM readonly_user`).
