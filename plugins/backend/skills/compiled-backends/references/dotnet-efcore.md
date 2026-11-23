# Entity Framework Core and Data Access

Guidelines for efficient data management with EF Core.

## 1. Schema Management
- Use **Migrations** for all schema changes.
- Version control migration files.
- Apply migrations only during controlled deployment phases.

## 2. Query Optimization
- **Repository Pattern:** Abstract data access behind repository interfaces.
- **N+1 Prevention:** Avoid multiple queries in loops; use `Include()` or `ThenInclude()` for eager loading.
- **Read-Only:** Use `.AsNoTracking()` for queries that do not require state tracking.
- **Batching:** Use batch operations when handling large record sets.
- **Indexing:** Identify hot queries and ensure appropriate database indexes exist.

## 3. Best Practices
- Never use raw SQL for data modification unless EF Core cannot handle the complexity.
- Prefer explicit loading over lazy loading to avoid hidden performance bottlenecks.
- Use parameterized queries to prevent SQL injection (EF Core LINQ queries do this automatically).
