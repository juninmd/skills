---
name: cataloging-apis
description: API cataloging in Backstage using dependency.yaml and OpenAPI specifications.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# API Catalog Operations

API registration and governance in the developer portal (Backstage).

## Instructions
- Ensure that `dependency.yaml` and `openapi.json` exist.
- Run `ci-knife api-catalog` with Lifecycle and Gateway metadata.

## Capabilities
- **Lifecycle Management**: Experimental, Supported, Deprecated.
- **Gateway Integration**: Linking with Kong Gateway ID.
