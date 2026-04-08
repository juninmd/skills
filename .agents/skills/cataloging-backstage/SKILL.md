---
name: cataloging-backstage
description: Configuration and validation of catalog-info.yaml (hangar-info.yaml) following the Spotify Backstage/Hangar standard. Use this for service registration, metadata management, and documentation in the developer portal.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[project-name] [owner-group]"
---

# Cataloging for Backstage (Hangar)

This skill automates and validates the registration of services, APIs, and resources in the developer portal (Backstage/Hangar), ensuring that the project is discoverable and compliant with Luizalabs standards.

## Principles for Non-Developers
- **Simple & Clean:** Always prefer simple, readable configurations.
- **Error-Free:** Every configuration must be valid YAML and pass schema checks.
- **Validated:** The presence and correctness of metadata must be verified automatically.
- **KISS (Keep It Simple, Stupid):** Do not add complex metadata that the user did not request.

## Mandatory Structure (catalog-info.yaml / hangar-info.yaml)
The standard file must follow the `Component` or `API` kind.

### Example: Component (Service)
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-awesome-service
  description: "A simple service that does X for users who Y."
  annotations:
    backstage.io/techdocs-ref: dir:.
    sonarqube.org/project-key: my-awesome-service
spec:
  type: service
  lifecycle: production
  owner: "group:squad-name"
  system: "my-system"
```

## Instructions
1.  **Detect Strategy:** Check if `catalog-info.yaml` or `hangar-info.yaml` already exists. Prefer `hangar-info.yaml` if it's the repository's current standard.
2.  **Verify Metadata:** Ensure `spec.owner` is in the format `group:<squad-name>`.
3.  **Validate YAML:** Always run a linter or basic validation after creating/modifying the file.
4.  **Testing Strategy:** Create a simple verification script or command to ensure the file is correct.

## Testing and Validation
To ensure high quality and no bugs, always validate the following:
- **Mandatory Fields:** Name, Owner, Lifecycle, and Type must exist.
- **Alternate Scenarios:** 
  - What if the owner is a user instead of a group? (Flag a warning).
  - What if the lifecycle is missing? (Default to `experimental`).
  - What if the name contains spaces? (Slugify it).

### Validation Script (sh)
```bash
# Simple validation test
grep -q "apiVersion: backstage.io/v1alpha1" hangar-info.yaml || (echo "Missing apiVersion" && exit 1)
grep -q "kind: Component" hangar-info.yaml || (echo "Missing kind" && exit 1)
grep -q "spec:" hangar-info.yaml || (echo "Missing spec section" && exit 1)
grep -q "owner: \"group:" hangar-info.yaml || (echo "Owner must be a group: <squad-name>" && exit 1)
echo "Hangar configuration validated successfully."
```

## Best Practices
- **Naming:** Use kebab-case for the `metadata.name`.
- **Owner:** Never use a personal email; always use the squad's group ID.
- **Documentation:** Ensure `backstage.io/techdocs-ref` points to the correct documentation folder (usually `dir:.` if README.md is in the root).
