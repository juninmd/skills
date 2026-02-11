# GraphQL Schema Designer Skill

## Description
This skill enables the agent to design, optimize, and document GraphQL schemas. It involves defining types, queries, mutations, and subscriptions, as well as ensuring the schema follows best practices for performance, security, and developer experience.

## Workflow

### 1. Requirements Analysis
- Understand the data model and the needs of the client applications.
- Identify the core entities and their relationships.

### 2. Schema Definition
- Define the GraphQL types (Scalar, Object, Enum, Interface, Union).
- Design Queries for data fetching and Mutations for data modification.
- Implement Subscriptions for real-time updates if required.
- Use input types for mutations to group arguments.

### 3. Optimization
- Design for efficient data fetching (avoiding N+1 problems).
- Implement pagination using connections and edges (Relay spec).
- Use proper naming conventions and documentation (descriptions).

### 4. Validation & Documentation
- Validate the schema against GraphQL specifications.
- Generate documentation using tools like GraphiQL or GraphQL Playground.

## Best Practices
- **Naming Conventions:** Use PascalCase for types and camelCase for fields and arguments.
- **Single Source of Truth:** The schema should be the source of truth for the API.
- **Nullability:** Be explicit about nullability. Default to non-nullable (`!`) if the data is always expected.
- **Pagination:** Prefer cursor-based pagination for large datasets.
- **Input Types:** Use dedicated `Input` types for complex mutation arguments.
