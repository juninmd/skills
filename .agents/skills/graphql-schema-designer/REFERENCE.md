# GraphQL Schema Designer Reference

## Tools

### 1. `graphql-js`
**Description:** The reference implementation of GraphQL for JavaScript.
**Use Case:** Parsing, validating, and executing GraphQL schemas.

### 2. `Apollo Server` / `Apollo Client`
**Description:** A comprehensive platform for building and consuming GraphQL APIs.
**Use Case:** Implementing the server-side logic and managing state on the client.

### 3. `GraphQL Inspector`
**Description:** A tool to compare schemas, find breaking changes, and validate operations.
**Common Commands:**
- `graphql-inspector diff old.graphql new.graphql`: Compare two schemas.
- `graphql-inspector validate schema.graphql`: Validate a schema.

### 4. `GraphiQL` / `GraphQL Playground`
**Description:** Interactive IDEs for exploring and testing GraphQL APIs.

## Specifications

### 1. Relay Cursor Connections Specification
**Goal:** Standard for pagination and slices in GraphQL.
**Link:** https://relay.dev/graphql/connections.htm

### 2. GraphQL over HTTP
**Goal:** Standardizing how GraphQL should be served over HTTP.
**Link:** https://github.com/graphql/graphql-over-http
