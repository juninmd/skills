# Helm Chart Development Workflow

Detailed procedures for creating and maintaining production-ready Helm charts.

## 1. Initialization
- **Scaffold:** `helm create <name>`.
- **Structure:** Familiarize with `Chart.yaml`, `values.yaml`, `templates/`, and `_helpers.tpl`.

## 2. Configuration
- **Metadata:** Define `apiVersion: v2`, `version`, and `appVersion` in `Chart.yaml`.
- **Values:** Organize `values.yaml` into logical blocks (image, service, persistence). Use `global` for cross-chart settings.
- **Dependencies:** Run `helm dependency update` to fetch subcharts.

## 3. Templating Patterns
- **Helpers:** Use `_helpers.tpl` for consistent naming and label application.
- **Conditionals:** Wrap optional resources in `{{- if .Values.enabled }}`.
- **Loops:** Iterate over lists using `{{- range }}`.
- **Formatting:** Use `nindent` and `quote` functions to sanitize output.

## 4. Environment Orchestration
- Layer value files for multi-environment deployments.
- **Example:** `helm install -f values.yaml -f values-prod.yaml <release> <chart>`.

## 5. Validation and Testing
- **Lint:** `helm lint <path>`.
- **Dry-run:** `helm install --dry-run --debug <path>`.
- **Test:** Implement `templates/tests/` and run `helm test <release>`.
