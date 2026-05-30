---
name: database-migrations
description: |
  **DATABASE SKILL** - Design and execute zero-downtime schema migrations with rollback safety.
  USE FOR: schema versioning, zero-downtime migrations, rollback strategies, data seeding, migration testing, blue-green deployments.
  DO NOT USE FOR: raw SQL execution without migration framework (use administrating-databases), performance optimization (use performance-profiling).
  INVOKES: flyway, liquibase, typeorm, prisma, alembic, administrating-databases.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Database Migrations & Schema Evolution

Expert methodology for evolving database schemas safely, maintaining zero-downtime deployments, and enabling confident rollbacks.

**USE FOR:**
- Defining versioned, immutable migrations (Flyway, Liquibase, Alembic, Prisma).
- Planning zero-downtime migrations (expand-contract pattern, shadow tables).
- Implementing backward-compatible schema changes (add column, add table, deprecate safely).
- Testing migrations in CI/CD with production data snapshots.
- Rolling back failed deployments without data loss.

**DO NOT USE FOR:**
- Ad-hoc SQL execution or manual schema changes.
- Performance tuning or index optimization (use performance-profiling).
- Data warehouse or analytics schemas (different patterns; use administrating-databases).

**INVOKES:**
- `flyway`, `liquibase`, `alembic`, `prisma migrate`, `typeorm migration`, `administrating-databases`.

## Methodology
Safe schema evolution demands immutable, version-controlled migrations tested against production-like data before deployment.

## Core Principles
1. **Immutable History:** Every migration is timestamped, immutable, and reversible; never modify applied migrations.
2. **Zero-Downtime:** Deploy schema changes alongside application code using expand-contract pattern.
3. **Test Early:** Run migrations against production data snapshots in CI/CD; validate rollback before production.

## Checklist
- [ ] All migrations stored in version control under `migrations/` or `db/` directory with timestamps.
- [ ] Migration framework chosen (Flyway/Liquibase for SQL; Alembic for Python; Prisma/TypeORM for ORMs).
- [ ] Schema changes are backward compatible (add columns as nullable; deprecate gracefully).
- [ ] Rollback path tested for every migration (DOWN scripts or reversible DDL).
- [ ] Data migrations seeded with test data and validated in CI/CD pipeline.
- [ ] Large table alterations use expand-contract: add new column, migrate data, rename old, drop old.
- [ ] Foreign key constraints validated post-migration; orphaned records audited.
- [ ] Deployment windows planned; blue-green or canary for risky changes.
- [ ] Rollback tested and documented; runbook includes estimated recovery time.
