# Blender MCP Setup and Automation

Connect AI coding assistants to an interactive Blender session via the Model Context Protocol (MCP), or fall back to headless scripting.

## Installation

The primary community integration is [ahujasid/mcp-for-blender](https://github.com/ahujasid/mcp-for-blender):

1. Download the Blender add-on zip from [ahujasid/mcp-for-blender](https://github.com/ahujasid/mcp-for-blender/releases), or run `uvx mcp-for-blender install-addon`.
2. In Blender:
   - Blender < 4.2: `Edit -> Preferences -> Add-ons -> Install...`
   - Blender >= 4.2: `Edit -> Preferences -> Get Extensions -> menu -> Install from Disk...`
3. Start the socket server in the 3D View sidebar tab (`MCP` panel -> `Start Server`).
4. Configure your client (Claude Code, Antigravity, Claude Desktop) with the server entry:

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["--from", "mcp-for-blender", "mcp-for-blender"]
    }
  }
}
```

## Execution Flow

| State | Execution Route | Action |
|---|---|---|
| Live MCP connected | Tool calls | Query scene datablocks, run operators, inspect objects directly without restarting Blender |
| MCP offline / headless | `blender --background` | Generate a self-contained Python script (`run.py`) and invoke `blender -b model.blend -P run.py` |
| Interactive review | Scripting workspace | Paste dry-run inspect script in the Blender Python Console or Text Editor |

## Rules

- Never run unverified scripts directly against an unsaved production scene; save a `.blend` snapshot first.
- The Blender MCP socket listens on loopback (`127.0.0.1`); do not expose this port on public interfaces because tool calls execute with host user permissions.
- When using MCP tool calls, verify object context (`bpy.context.active_object`, `bpy.context.mode`) before dispatching modal or selection-dependent operators.
- For batch model processing across multiple files, prefer CLI background execution over the live UI socket.
