---
name: data-engineering
description: "Comprehensive Data Engineering covering Database Administration, Migrations, and Vector Databases."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "PostgreSQL, MongoDB, Redis, Pinecone, Qdrant, Milvus"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Data Engineering & Databases

Expert methodology for administering, migrating, and optimizing databases. This skill unifies relational/NoSQL database administration, zero-downtime schema migrations, and managing vector databases for AI/RAG applications.

**USE FOR:**
- Administering and optimizing PostgreSQL, MongoDB, and Redis (indexes, slow queries, locks).
- Designing and executing zero-downtime database schema migrations (Flyway, Prisma, Alembic).
- Managing vector databases (embeddings ingestion, similarity search, metadata filtering).
- Implementing data seeding and rollback strategies.

**DO NOT USE FOR:**
- Implementing application-level business logic (use `backend-*`).
- Managing cloud infrastructure provisioning (use `cloud-devops`).

**INVOKES:**
- `psql`, `mongosh`, `redis-cli`, migration frameworks, vector DB clients.

## Core Principles
1. **Zero Downtime:** Migrations must be backward compatible; never lock production tables exclusively for long periods.
2. **Data Integrity:** Always have a tested rollback plan before applying schema changes.
3. **Performance First:** Explain and analyze queries before applying indexes.
4. **Vector Strategy:** Co-locate metadata with embeddings to optimize hybrid search performance.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Database Administration & Tuning](references/db-admin.md)
- [Schema Migrations & Rollbacks](references/db-migrations.md)
- [Vector Databases & RAG](references/vector-databases.md)

## Checklist
- [ ] Verify that a rollback script is present and tested for every migration.
- [ ] Run `EXPLAIN ANALYZE` on new queries in a staging environment.
- [ ] Confirm vector dimensions match the embedding model output before ingestion.
- [ ] Ensure database credentials are not hardcoded in migration scripts.
