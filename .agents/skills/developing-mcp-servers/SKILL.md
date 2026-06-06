---
name: developing-mcp-servers
description: |
  **COMPATIBILITY SKILL** - Route MCP server work to mcp-builder.
  USE FOR: requests that explicitly invoke developing-mcp-servers.
  DO NOT USE FOR: new routing decisions; use mcp-builder directly.
  INVOKES: mcp-builder.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Developing MCP Servers

Compatibility alias. Load and follow the `mcp-builder` skill for contracts, implementation, security, and evaluation.

## Checklist
- [ ] Delegate MCP server work to `mcp-builder`.
- [ ] Do not duplicate its implementation guidance.
