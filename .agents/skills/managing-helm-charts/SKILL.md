---
name: managing-helm-charts
description: Expert guidance for scaffolding, managing, and optimizing Helm charts for production Kubernetes deployments.
argument-hint: "[resource/project] [options]"
---

# Managing Helm Charts

Comprehensive guidance for scaffolding, managing, and optimizing Helm charts for production-grade Kubernetes deployments.

## PURPOSE
This skill provides a unified framework for building, organizing, and maintaining Helm charts. It covers the entire lifecycle from initial scaffolding to advanced templating patterns, dependency management, and multi-environment orchestration.

## WHEN TO USE
- **Scaffolding**: Initializing new projects with a standardized, production-ready structure.
- **Pattern Implementation**: Applying reusable logic for complex Kubernetes manifests.
- **Expert Management**: Handling multi-environment configurations, dependencies, and lifecycle hooks.
- **Validation**: Ensuring charts are linted, tested, and compliant with best practices before deployment.

## STEP-BY-STEP WORKFLOW

### 1. Initialize and Scaffold
Create a new chart using the standard structure to ensure consistency across the organization.
```bash
helm create <chart-name>
```
**Standard Directory Layout:**
- `Chart.yaml`: Metadata and dependencies.
- `values.yaml`: Default configuration values.
- `templates/`: Kubernetes manifest templates.
- `templates/_helpers.tpl`: Named templates and partials.
- `charts/`: Subcharts and dependencies.

### 2. Configure Metadata (Chart.yaml)
Define the chart's identity and requirements:
- Use `apiVersion: v2` for Helm 3+.
- Maintain separate `version` (chart version) and `appVersion` (application version).
- Define `dependencies` with explicit versions and repositories to avoid breaking changes.

### 3. Design Values Hierarchy
Organize `values.yaml` to be intuitive and extensible:
- Group related settings (e.g., `image`, `service`, `persistence`).
- Use `global` values for settings shared across multiple subcharts.
- Provide sensible defaults that allow for "zero-config" local testing.

### 4. Implement Advanced Templating
Leverage Go templates and Helm functions for dynamic manifests:
- **Helpers**: Use `_helpers.tpl` for common labels and naming logic to ensure resource consistency.
- **Conditionals**: Wrap optional resources (like Ingress or HPA) in `{{- if .Values.enabled }}` blocks.
- **Loops**: Use `{{- range }}` to iterate over environment variables, secrets, or volume mounts.
- **Pipelines**: Use functions like `nindent`, `quote`, and `default` to sanitize and format output.

### 5. Manage Dependencies
Handle subcharts effectively to build complex applications:
- Run `helm dependency update` to fetch requirements defined in `Chart.yaml`.
- Use `condition` or `tags` to enable/disable subcharts dynamically based on values.
- Override subchart values in the parent `values.yaml` using the subchart's name as the top-level key.

### 6. Multi-Environment Orchestration
Manage different environments (Dev, HML, Prod) using layered value files:
- `values-dev.yaml`: Minimal resources, debug enabled.
- `values-prod.yaml`: High availability, strict resource limits, and production-grade configurations.
- **Command**: `helm install <release> <chart> -f values.yaml -f values-prod.yaml`

### 7. Validation and Testing
Ensure reliability through rigorous pre-deployment checks:
- **Linting**: `helm lint <chart-path>` to catch syntax and best-practice violations.
- **Dry-run**: `helm install --dry-run --debug` to inspect rendered manifests without deploying.
- **Testing**: Implement `templates/tests/` (e.g., connection tests) and run `helm test <release>`.

## BEST PRACTICES
- **Semantic Versioning**: Strictly follow SemVer for both chart and application releases.
- **Documentation**: Document every parameter in `values.yaml` with clear, descriptive comments.
- **Resource Management**: Always define `requests` and `limits` for CPU and Memory to ensure cluster stability.
- **Naming Conventions**: Use lowercase and hyphens; avoid underscores in resource names.
- **Immutable Tags**: Avoid using `latest` for image tags; use specific versions or image SHAs.
- **Security**: Use `Secret` resources for sensitive data; never commit plain-text secrets to `values.yaml`.
- **Labels**: Apply standard Kubernetes labels (`app.kubernetes.io/name`, `instance`, `version`) to all resources.

## COMMON PATTERNS
- **The "Fullname" Helper**: Standardize resource naming to avoid collisions in shared namespaces.
- **ConfigMap Checksum**: Add a checksum annotation to Deployments to trigger automatic restarts when ConfigMaps change.
- **Library Charts**: Use `type: library` for shared template logic used across multiple distinct applications.

## TROUBLESHOOTING
- **Rendering Issues**: Use `helm template` to see exactly what manifests Helm is generating.
- **Release State**: Use `helm status` and `helm history` to diagnose failed upgrades or rollbacks.
- **Namespace Conflicts**: Ensure the target namespace exists or use the `--create-namespace` flag.
