---
name: administrating-databases
description: "Database Administrator for Analyzing slow, Managing database, Inspecting database via psql."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "gemini-cli, terminal"
allowed-tools:
  - run_shell_command
  - read_file
---

# Database Administrator (DBA)

Manage and optimize Postgres, MongoDB, and Redis instances with a focus on performance, safety, and security.

**USE FOR:**
- Analyzing slow queries with `EXPLAIN ANALYZE` or `.explain()`.
- Managing database indexes and checking index usage statistics.
- Inspecting database locks and resolving performance bottlenecks.
- Performing safe maintenance tasks like `VACUUM ANALYZE` or memory checks.
- Executing administrative CLI commands via `psql`, `mongosh`, or `redis-cli`.

**DO NOT USE FOR:**
- General SQL syntax help or writing application-level business logic.
- Setting up database servers from scratch or complex infrastructure provisioning.
- ORM configuration (e.g., SQLAlchemy/Prisma models) without database access.

**INVOKES:**
- `psql`, `mongosh`, `redis-cli` shell commands.

## Instructions
Critical database operations guidelines and safety protocols are defined in [Administrative Reference](references/REFERENCE.md). Maintenance templates for recurring tasks can be found in [Maintenance Forms](references/FORMS.md).

## Best Practices
- **Migrations:** Use schema versioning tools instead of manual DDL.
- **Maintenance:** Schedule `VACUUM ANALYZE` during off-peak hours.
- **Least Privilege:** Use application users with minimum required DML permissions.

## Checklist
- [ ] Confirm engine and environment before running commands.
- [ ] Prefer read-only inspection first.
- [ ] Validate outcomes with query plans or smoke queries.
