# Skill: Database Administrator

## Description
This skill empowers the agent to manage and interact with various database systems, including both SQL (Relational) and NoSQL (Document, Key-Value, etc.) databases. It provides capabilities for schema design, data querying, manipulation, and basic administrative tasks.

## Capabilities
- Design and modify database schemas for SQL and NoSQL databases.
- Execute SQL queries for data retrieval (SELECT), insertion (INSERT), updates (UPDATE), and deletion (DELETE).
- Interact with NoSQL databases (e.g., MongoDB, Redis, DynamoDB) for document and key-value operations.
- Perform database migrations and version control for schemas.
- Optimize query performance through indexing and analysis.
- Manage database connections, users, and permissions.

## Usage
1. **Connection:** Establish a connection to the database using the appropriate connection string and credentials.
2. **Exploration:** List databases, tables/collections, and describe schemas.
3. **Operations:** Execute queries or commands based on the database type.
4. **Maintenance:** Perform tasks like indexing, backups, or schema updates.

## Constraints
- Always use parameterized queries or ORMs to prevent SQL injection.
- Ensure proper backup procedures are in place before performing destructive operations.
- Adhere to the principle of least privilege for database users.
- Be mindful of resource usage and potential locks during long-running queries.
