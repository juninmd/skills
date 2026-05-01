# Referência: Database Administration Standards 📚
## Common SQL Commands
- `CREATE TABLE`: Define a new table and its columns.
- `ALTER TABLE`: Modify an existing table structure.
- `SELECT`: Retrieve data from one or more tables.
- `INSERT INTO`: Add new records to a table.
- `UPDATE`: Modify existing records in a table.
- `DELETE`: Remove records from a table.
- `DROP`: Delete a database or table.
- `INDEX`: Create an index to speed up queries.

## NoSQL Patterns
- **Document (MongoDB):** JSON-like documents grouped into collections.
- **Key-Value (Redis):** Simple pairs of keys and values, often for caching.
- **Wide-Column (Cassandra):** Sparse tables with many columns.
- **Graph (Neo4j):** Data represented as nodes and edges.

## Security Best Practices
- **Sanitize Inputs:** Never concSecurityAuditte user input directly into queries.
- **Encrypted Connections:** Use SSL/TLS for database connections (e.g., `?ssl=true`).
- **Secret Management:** Use environment variables or secret managers for credentials, never hardcode them.
- **Monitoring:** Log slow queries and audit access to sensitive data.

