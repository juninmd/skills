# MCP Scenarios and Examples

Common tool patterns and implementation examples for MCP servers.

## 1. Tool Scenarios
- **Retrieval:** Fetching data from internal APIs or databases.
- **Execution:** Triggering builds or modifying remote resources.
- **File System:** Restricted sandbox read/write operations.

## 2. TypeScript Implementation Example
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "example", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "get_data",
    description: "Fetch internal data",
    inputSchema: { type: "object", properties: { id: { type: "string" } } }
  }]
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

## References
- [MCP Official Site](https://modelcontextprotocol.io/)
- [Anthropic MCP Docs](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
