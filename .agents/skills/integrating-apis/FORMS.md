# Form Filling Guide: API Integrator

## REST API Request Form
To perform a REST API call, provide:

| Field | Description | Example |
|-------|-------------|---------|
| URL | The full endpoint URL | "https://api.example.com/v1/users" |
| Method | HTTP Method | "GET", "POST", "PATCH", "DELETE" |
| Headers | JSON object of headers | '{"Authorization": "Bearer token", "Content-Type": "application/json"}' |
| Body | Request body (for POST/PUT/PATCH) | '{"name": "John Doe", "email": "john@example.com"}' |

## GraphQL Operation Form
To perform a GraphQL operation, provide:

| Field | Description | Example |
|-------|-------------|---------|
| Endpoint | GraphQL API endpoint URL | "https://api.example.com/graphql" |
| Query | The GraphQL query or mutation string | 'query { user(id: "1") { name email } }' |
| Variables | JSON object of variables (optional) | '{"id": "1"}' |
| Headers | JSON object of headers | '{"Authorization": "Bearer token"}' |

