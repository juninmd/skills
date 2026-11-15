# Schema introspection (read-only)

## Contents
- Decision table: engine by signal
- Catalog queries: PostgreSQL, MySQL, SQL Server, Oracle, Firebird
- Pitfalls

Use this when listing tables or columns, mapping types, or feeding a code generator from a live database. Do not use it for query tuning, migrations, or backups.

## Decision table

| Signal | Engine | Catalog |
|---|---|---|
| `postgres://`, `psql`, port 5432 | PostgreSQL | `information_schema` |
| `mysql://`, port 3306 | MySQL | `information_schema`, filtered by `DATABASE()` |
| `Server=`, `sqlserver`, port 1433 | SQL Server | `INFORMATION_SCHEMA` |
| `oracle`, port 1521 | Oracle | `USER_TABLES`, `USER_TAB_COLUMNS` |
| `.fdb`, port 3050 | Firebird | `RDB$RELATIONS`, `RDB$RELATION_FIELDS` |

## Workflow
1. Identify the engine from the connection string or driver.
2. Run the table-list query, filtered by schema or owner.
3. Run the column query only for target tables.
4. Normalize to table, column, type, max length, nullable, default, and primary key when available.
5. Stop before any write, DDL, or row sampling.

## PostgreSQL

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = :schema AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT column_name, data_type, character_maximum_length,
       is_nullable, column_default, ordinal_position
FROM information_schema.columns
WHERE table_schema = :schema AND table_name = :table
ORDER BY ordinal_position;
```

## MySQL

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT column_name, data_type, character_maximum_length,
       is_nullable, column_default, column_key
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = :table
ORDER BY ordinal_position;
```

`column_key = 'PRI'` marks primary key columns.

## SQL Server

```sql
SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_SCHEMA, TABLE_NAME;

SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH,
       IS_NULLABLE, COLUMN_DEFAULT, ORDINAL_POSITION
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = @table
ORDER BY ORDINAL_POSITION;
```

## Oracle

Current user's objects. For another owner, use `ALL_TABLES` and `ALL_TAB_COLUMNS` with an `OWNER` filter.

```sql
SELECT table_name FROM user_tables ORDER BY table_name;

SELECT column_name, data_type, data_length, data_precision,
       data_scale, nullable, data_default, column_id
FROM user_tab_columns
WHERE table_name = :table
ORDER BY column_id;
```

## Firebird

```sql
SELECT rdb$relation_name AS table_name
FROM rdb$relations
WHERE rdb$view_blr IS NULL
  AND (rdb$system_flag IS NULL OR rdb$system_flag = 0)
ORDER BY rdb$relation_name;

SELECT rf.rdb$field_name AS column_name,
       f.rdb$field_type AS field_type,
       f.rdb$field_length AS field_length,
       rf.rdb$null_flag AS null_flag,
       rf.rdb$field_position AS field_position
FROM rdb$relation_fields rf
JOIN rdb$fields f ON f.rdb$field_name = rf.rdb$field_source
WHERE rf.rdb$relation_name = :table
ORDER BY rf.rdb$field_position;
```

Firebird stores type codes, not names. Map `field_type` before generating code.

## Pitfalls
- Unfiltered catalogs include system objects. Always filter by schema or owner.
- Oracle and Firebird return uppercase identifiers unless quoted at creation. Match case-insensitively, keep the database's casing in output.
- `character_maximum_length` is null for non-text types; null is not zero.
- `column_default` may be an expression; record it as text.
- Never print credentials or row samples in output.
