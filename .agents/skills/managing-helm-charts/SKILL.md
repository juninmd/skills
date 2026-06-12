---
name: managing-helm-charts
description: "Helm Charts Management for Initializing charts, Implementing complex, Managing layered via helm install."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Kubernetes, Helm 3+"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Helm Charts Management

Expert methodology for creating, organizing, and optimizing Helm charts for production-ready Kubernetes deployments using advanced templating and multi-environment strategies.

**USE FOR:**
- Initializing charts with standardized, production-ready structures.
- Implementing complex Go template logic with helpers, loops, and pipelines.
- Managing layered configurations across development, staging, and production.
- Orchestrating subchart dependencies and value overrides.
- Validating chart correctness via linting, dry-runs, and integration tests.

**DO NOT USE FOR:**
- Low-level container engine configuration.
- Generic automation unrelated to Kubernetes packaging.

**INVOKES:**
- `helm install`, `helm upgrade`, `helm lint`, `helm template`.

## Methodology and Guidelines
Implementation details for workflow, patterns, and standards are documented in:
1. [Helm Development Workflow](references/helm-workflow.md)
2. [Helm Standards & Best Practices](references/helm-standards.md)

## Core Principles
1. **Consistency:** Use helper templates to ensure predictable resource naming and labeling.
2. **Stability:** Always define resource requests/limits and use immutable image tags.
3. **Reproducibility:** Capture all environment-specific changes in layered value files.

## Checklist
- [ ] Render manifests locally and inspect for syntax or logic errors before deployment.
- [ ] Ensure all sensitive data is handled via Secrets or external providers.
- [ ] Validate that CPU and Memory limits are defined for all containers.
- [ ] Verify that chart and application versions follow semantic versioning.
