# Form Filling Guide: Database Administrator

## SQL Query Form
To execute a SQL query, provide:

| Field | Description | Example |
|-------|-------------|---------|
| Connection String | Database connection URI | "postgresql://user:pass@localhost:5432/mydb" |
| SQL Query | The SQL statement to execute | "SELECT * FROM users WHERE active = true;" |
| Parameters | JSON list or object for parameterized queries | '[true]' or '{"active": true}' |

## NoSQL Operation Form
To perform a NoSQL operation (e.g., MongoDB), provide:

| Field | Description | Example |
|-------|-------------|---------|
| Connection String | Database connection URI | "mongodb://localhost:27017/mydb" |
| Collection | The name of the collection | "users" |
| Operation | The method to call | "find", "insertOne", "updateMany" |
| Query/Filter | JSON object for filtering | '{"email": "john@example.com"}' |
| Data/Update | JSON object for the operation data | '{"$set": {"status": "verified"}}' |
