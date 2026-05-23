# MCP Server Planning and Design

Methodology for researching and architecting high-quality MCP servers.

## 1. Design Strategy
- **Coverage:** Balance comprehensive API endpoint coverage with high-level workflow tools.
- **Discoverability:** Use consistent prefixes (e.g., `github_`) and action-oriented names.
- **Context:** Design for pagination and filtering to keep responses concise.
- **Errors:** Provide actionable messages with specific remediation steps.

## 2. Protocol and Framework Study
- **Spec:** Start with `https://modelcontextprotocol.io/sitemap.xml`.
- **Stack:** Prefer TypeScript (SDK maturity) and JSON-over-HTTP (stateless scaling).
- **Python:** Use `FastMCP` for rapid prototyping.

## 3. Implementation Planning
- Identify authentication requirements and data models from target API docs.
- List priority endpoints starting with common operations.
- Map out shared utilities (client, error helpers, response formatters).
