# MCP Server Development Guidelines

Core principles and implementation standards for Model Context Protocol servers.

## 1. Core Principles
- **Statelessness:** Prefer stateless designs; manage state via clients or backend DBs.
- **Tool Descriptions:** Use highly descriptive names and JSON Schema definitions for tools.
- **Security:** Validate all inputs using strict schemas (Zod/Pydantic). Treat the client as untrusted.

## 2. Implementation Standards

### TypeScript / Node.js
- **SDK:** `@modelcontextprotocol/sdk`.
- **Validation:** `zod` for argument parsing.
- **Transport:** `StdioServerTransport` (local) or `SSEServerTransport` (web).

### Python
- **SDK:** `mcp` from PyPI.
- **Validation:** `pydantic` for schema generation.
- **Asynchrony:** Use `asyncio` for efficient request handling.

## 3. Testing and Debugging
- **Inspector:** Use `npx @modelcontextprotocol/inspector` for local manual testing.
- **Logging:** Route logs to `stderr` or a file; `stdout` is reserved for transport.
- **Error Handling:** Return structured error messages; do not crash on invalid inputs.
