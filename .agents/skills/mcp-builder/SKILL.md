---
name: mcp-builder
description: |
  **DEVELOPMENT SKILL** - Design and implement Model Context Protocol (MCP) servers.
  USE FOR: architecting MCP servers, defining tool schemas (Zod/Pydantic), implementing transport (Stdio/SSE), building RAG tools, creating MCP evaluation suites.
  DO NOT USE FOR: general API development (use developing-fastapi), building the agent's core model, frontend development.
  INVOKES: mcp sdk, mcp inspector, pnpm/uv.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "TypeScript, Python"
allowed-tools: [run_shell_command, read_file, write_file, web_fetch]
---

# MCP Server Development Guide

Expert methodology for building high-quality MCP servers that enable LLMs to interact effectively with external services through well-designed tools and resources.

**USE FOR:**
- Designing discoverable tool contracts and descriptive schemas.
- Implementing robust transport layers and shared infrastructure utilities.
- Building comprehensive evaluation suites to measure server effectiveness.
- Optimizing tool responses for context efficiency and machine readability.

**DO NOT USE FOR:**
- Implementing servers that do not follow the MCP specification.
- Routine automation that does not require an agent-interfaced tool.

**INVOKES:**
- `npx @modelcontextprotocol/inspector`, `npm run build`, `pytest`.

## Methodology and Guidelines
Implementation details for the four phases of development are documented in:
1. [Planning & Design](references/mcp-planning.md)
2. [Implementation Standards](references/mcp-implementation.md)
3. [Validation & Evaluation](references/mcp-validation.md)

## Core Principles
1. **Discoverability:** Use consistent, action-oriented tool naming and rich descriptions.
2. **Resilience:** Provide actionable error messages and handle all I/O asynchronously.
3. **Effectiveness:** Measure success through complex, real-world evaluation workflows.

## Checklist
- [ ] Research the target API and define tool contracts before implementation.
- [ ] Validate one end-to-end flow with the MCP Inspector before scaling.
- [ ] Ensure all inputs are strictly validated via Zod or Pydantic.
- [ ] Provide 10 complex evaluation questions to verify server quality.
