# Database Skills

Skills for database administration and data management.

## `administrating-databases`

**Invoke:** `/administrating-databases`

SQL and NoSQL database administration, performance, and integrity.

### PostgreSQL

**Administration:**
- Connection pooling with PgBouncer
- `VACUUM` and `ANALYZE` strategies
- Replication setup (streaming, logical)
- Point-in-time recovery (PITR)
- Role and permission management

**Performance:**
- Index selection (B-tree, GIN, GiST, BRIN)
- `EXPLAIN ANALYZE` interpretation
- N+1 query detection and batching
- Materialized views for expensive aggregations
- Partitioning for large tables

**Integrity:**
- Foreign key constraints and `ON DELETE` strategies
- Check constraints and domain types
- Migration strategies (Flyway, Liquibase, Prisma Migrate)
- Zero-downtime migrations (additive-only, multi-phase deploys)

### MongoDB

- Document schema design (embedding vs referencing)
- Index optimization
- Aggregation pipeline
- Change streams for real-time updates
- Atlas Search integration
- Sharding for horizontal scale

### Redis

- Data structure selection (String, Hash, List, Set, Sorted Set, Stream)
- Expiry and eviction policies
- Pub/Sub vs Streams
- Lua scripting for atomic operations
- Cluster mode
- Cache-aside, write-through, write-behind patterns
