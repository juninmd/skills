# MCP Server Implementation Standards

Detailed guidelines for coding tools, resources, and server infrastructure.

## 1. Core Infrastructure
- Implement a centralized API client with robust error handling.
- Use `structuredContent` (TypeScript) to provide machine-readable outputs.
- Support pagination for all list-based operations.

## 2. Tool Implementation
- **Schemas:** Use Zod (TS) or Pydantic (Python) for strict input validation.
- **Descriptions:** Provide high-signal descriptions for every field and the tool itself.
- **Hints:** Annotate tools with `readOnlyHint`, `destructiveHint`, or `idempotentHint`.
- **Asynchrony:** Always use `async/await` for I/O operations.

## 3. Language Guides
Refer to specialized references for project setup and patterns:
- [TypeScript Implementation](../reference/node_mcp_server.md)
- [Python Implementation](../reference/python_mcp_server.md)
- [MCP Best Practices](../reference/mcp_best_practices.md)
