---
name: designing-graphql-schemas
description: Design, optimize, and document GraphQL schemas with types, queries, mutations, and subscriptions.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[component/feature] [options]"
---

# GraphQL Schema Designer

## Description
This skill enables the agent to design, optimize, and document GraphQL schemas. It includes defining types, queries, mutations, and subscriptions, ensuring best practices for performance, security, and developer experience.

## Flow

### 1. Requirements Analysis
- Understand the data model and the needs of client applications.
- Identify core entities and their relationships.

### 2. Schema Definition
- Define GraphQL types (Scalar, Object, Enum, Interface, Union).
- Design Queries for reading and Mutations for writing.
- Implement Subscriptions for real-time updates when necessary.
- Use `Input` types to group complex arguments.

### 3. Optimization
- Design for efficient data fetching (avoiding the N+1 problem).
- Implement pagination using connections and edges (Relay spec).
- Use consistent naming conventions and clear descriptions.

### 4. Validation and Documentation
- Validate the schema against GraphQL specifications.
- Generate documentation using GraphiQL or GraphQL Playground.

## Best Practices
- **Naming:** Use PascalCase for types and camelCase for fields and arguments.
- **Source of Truth:** The schema should be the source of truth for the API.
- **Nullability:** Be explicit about nullability; prefer non-null (`!`) where appropriate.
- **Pagination:** Prefer cursor-based pagination for large volumes.
- **Input Types:** Use dedicated `Input` types for mutations with complex arguments.
