# shadcn/ui: Discovery & Installation

## Component Discovery
Use shadcn MCP tools to explore:
- `list_components`: See complete catalog.
- `get_component_metadata`: Understand props and deps.
- `get_component_demo`: View implementation examples.

## Installation Methods
**A. CLI (Recommended)**
```bash
npx shadcn@latest add [component-name]
```
This auto-updates `components.json` and installs peer deps.

**B. Manual**
1. `get_component` to retrieve source.
2. Create file in `components/ui/`.
3. Manually install dependencies.

## Registry Access
- `get_project_registries`: List available registries.
- `search_items_in_registries`: Find specific items.
