---
name: developing-mcp-servers
description: "MCP server development. Triggers: mcp, stdio, SSE."
argument-hint: "[context] [options]"
---

# Developing MCP Servers

This skill focuses on the architecture, implementation, and deployment of Model Context Protocol (MCP) servers, which allow AI assistants to interact with external tools, APIs, and data sources.

## Core Principles
1.  **Statelessness:** MCP servers should ideally be stateless, relying on the client to pass necessary context, or managing state transparently via a backend database.
2.  **Clear Tool Definitions:** Tools exposed by the MCP server must have highly descriptive names and JSON Schema definitions. The AI uses these schemas to understand when and how to call the tool.
3.  **Security First:** Never trust the client. Validate all inputs using strict schemas (e.g., Zod in TypeScript or Pydantic in Python) to prevent injection attacks or unauthorized access.

## Implementation Guidelines
### TypeScript / Node.js
- **SDK:** Use the official `@modelcontextprotocol/sdk`.
- **Validation:** Use `zod` for parsing and validating arguments.
- **Transport:** Implement `StdioServerTransport` for local CLI tools and `SSEServerTransport` for web-based tools.

### Python
- **SDK:** Use `mcp` from PyPI.
- **Validation:** Use `pydantic` for strict type checking and schema generation.
- **Asynchronous:** Use `asyncio` for efficient handling of requests.

## Common Tool Scenarios
- **Data Retrieval:** Fetching data from an internal API, database, or knowledge base.
- **Action Execution:** Triggering builds, creating tickets, or modifying remote resources.
- **File System Access:** Safely reading/writing files within a restricted sandbox directory.

## Testing and Debugging
1.  **Local Testing:** Use the MCP Inspector (`npx @modelcontextprotocol/inspector`) to connect to your local server and manually trigger tools.
2.  **Logging:** Implement structured logging (e.g., Winston, Pino) but route logs to `stderr` or a file, as `stdout` is reserved for the `stdio` transport.
3.  **Error Handling:** Return meaningful error messages to the client. Do not crash the server on invalid input.

## Example (TypeScript)
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server({ name: "example-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "get_weather",
    description: "Get the current weather for a city",
    inputSchema: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"]
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_weather") {
    const { city } = request.params.arguments as { city: string };
    return { content: [{ type: "text", text: `Weather in ${city} is sunny.` }] };
  }
  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Checklist

- [ ] Define the transport, tool contracts, and validation rules before implementing handlers.
- [ ] Keep tool schemas precise enough that incorrect inputs fail early and clearly.
- [ ] Verify the server with a real client flow before considering the implementation done.

## References

- [Model Context Protocol Official Site](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK (GitHub)](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK (GitHub)](https://github.com/modelcontextprotocol/python-sdk)
- [Anthropic MCP Documentation](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [LangChain MCP Integration](https://docs.langchain.com/oss/python/langchain/mcp)
