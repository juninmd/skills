---
name: developing-mcp-servers
description: |
  **DEVELOPMENT SKILL** - Build and deploy Model Context Protocol (MCP) servers.
  USE FOR: MCP tool definitions, JSON Schema for tools, Stdio/SSE transport, MCP SDK (TS/Python), debugging with MCP Inspector.
  DO NOT USE FOR: general API development (unless MCP-wrapped), frontend agent UIs, prompt engineering for generic agents.
  INVOKES: mcp sdk, npx @modelcontextprotocol/inspector.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Developing MCP Servers

Expert methodology for architecting and implementing Model Context Protocol (MCP) servers to extend AI capabilities with specialized tools and data.

**USE FOR:**
- Designing tool contracts with descriptive names and strict JSON schemas.
- Implementing MCP servers in TypeScript (Node.js) or Python.
- Configuring transports like Stdio (for local CLI) or SSE (for web).
- Debugging tool execution using the MCP Inspector.
- Implementing secure, stateless tool handlers.

**DO NOT USE FOR:**
- Traditional REST/GraphQL API design without MCP integration.
- Building the agent's core reasoning engine.

**INVOKES:**
- `@modelcontextprotocol/sdk`, `mcp` (Python), `zod`, `pydantic`.

## Methodology and Guidelines
Implementation details for transport, validation, and testing are documented in:
1. [MCP Development Guidelines](references/mcp-guidelines.md)
2. [MCP Scenarios and Examples](references/mcp-examples.md)

## Core Principles
1. **Validation:** Never trust client input; use Zod or Pydantic to enforce schemas.
2. **Observability:** Route all logs to `stderr` to avoid corrupting `stdio` transport.
3. **Interoperability:** Follow the official MCP specification for capabilities and resources.

## Checklist
- [ ] Define transport and tool contracts before implementation.
- [ ] Ensure all tool descriptions are high-signal for LLM routing.
- [ ] Verify server connection using the MCP Inspector.
- [ ] Validate that errors return meaningful feedback without crashing.
