---
name: cataloging-apis
description: Catalogação de APIs no Backstage utilizando dependency.yaml e OpenAPI specs.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[context] [options]"
---

# API Catalog Operations

Registro e governança de APIs no portal de desenvolvedor (Backstage).

## Instructions
- Garanta que o `dependency.yaml` e a `openapi.json` existam.
- Execute `ci-knife api-catalog` com os metadados de Lifecycle e Gateway.

## Capabilities
- **Lifecycle Management**: Experimental, Supported, Deprecated.
- **Gateway Integration**: Vínculo com Kong Gateway ID.
