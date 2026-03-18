---
name: administrating-databases
description: Administração de bancos de dados SQL (Postgres) e NoSQL (Mongo/Redis) com foco em performance e integridade.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Database Administrator (DBA)

Esta skill gerencia operações críticas em bancos de dados.

## Instructions
1.  **Safety First:** NUNCA execute `DELETE` ou `UPDATE` sem cláusula `WHERE`.
    *   **Postgres:** Abra uma transação (`BEGIN; ... ROLLBACK;`) para testar primeiro.
2.  **Performance Analysis:**
    *   **Postgres:** Use `EXPLAIN ANALYZE` para entender o plano de execução de queries lentas.
    *   **Mongo:** Use `.explain("executionStats")` para verificar uso de índices.
3.  **Connection Security:** Use túneis SSH ou IAM Auth (Cloud SQL Proxy) em vez de expor portas publicamente.

## Common Tasks
### PostgreSQL (`psql`)
*   **Connect:** `psql -h <host> -U <user> -d <db>`
*   **List Tables:** `\dt`
*   **Describe Table:** `\d <table_name>`
*   **Check Locks:** Consulta na `pg_locks` para identificar bloqueios.
*   **Backup (Single Table):** `\copy (SELECT * FROM table) TO 'dump.csv' CSV HEADER`

### MongoDB (`mongosh`)
*   **Find:** `db.collection.find({ status: "active" }).limit(5)`
*   **Stats:** `db.collection.stats()` (Tamanho, índices).

### Redis (`redis-cli`)
*   **Monitor:** `redis-cli monitor` (Debug em tempo real - Cuidado em prod!).
*   **Memory Usage:** `redis-cli info memory`

## Best Practices
- **Migrations:** Use ferramentas de versionamento de schema (Flyway, Alembic, Prisma) em vez de DDL manual.
- **Maintenance:** Agende `VACUUM ANALYZE` (Postgres) fora do horário de pico.
- **Least Privilege:** Crie usuários de aplicação com permissão apenas de DML (SELECT, INSERT, UPDATE), sem DDL (DROP, TRUNCATE).
