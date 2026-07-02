---
name: validating-baseweb-charts
description: Rigorous validation of Chart.yaml and values.yaml files based on baseweb-app standards.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Validating BaseWeb Charts

## Description
This skill empowers the agent to audit and validate the `Chart.yaml` and `values.yaml` files of a Kubernetes-based application, ensuring that configurations are in strict compliance with the `base-webapp` documentation. The goal is to ensure governance, availability, and traceability of deployments.

## Instructions

Whenever analyzing the `Chart.yaml` and `values.yaml` files, the agent must apply the following validation checklist:

### 1. Chart.yaml
- **Name**: The `name` field must be filled.
- **Version**: The `version` field must be present and its value **must be identical** to the value of the `image.tag` field in the `values.yaml` file.

### 2. values.yaml
- **Governance**: The keys `squad`, `tribe`, `vertical`, and `product` cannot be empty.
- **Image and Execution**: The `image.repository` and `image.tag` fields must exist. Furthermore, `command` and `args` must be correctly defined.
- **Resources**: Pod predictability is essential. The `resources.limits` (cpu and memory) and `resources.requests` (cpu and memory) configurations are mandatory.
- **Ingress Controller**: Must include the `ingress.ingressController.internal` configuration, including the annotation for HTTPS redirection: `konghq.com/https-redirect-status-code: '308'`.
- **Probes**: It is mandatory to declare the liveness and readiness paths (`livenessProbe.httpGet.path` and `readinessProbe.httpGet.path`).
- **Scalability**: The HPA (Horizontal Pod Autoscaler) must have the `hpa.maxReplicas` field defined to avoid overload.
- **Environment Variables**: The application variables must be listed under the `envs` key.
- **Gateway API (v1.4.4+)**: If `GatewayApi.grpc.enabled` is `true`, a valid `port` must be defined. If `provider` is used, it should be one of `gke-gateway`, `envoy-gateway`, or `auto`.
- **Cross-Namespace (ReferenceGrant)**: If `referenceGrant.enabled` is `true`, `allowedNamespaces` must not be empty for the receiving application.
- **Deploy Strategies (Argo Rollouts)**: If `rollouts.enabled` is `true`, a valid `strategy` (Canary or BlueGreen) must be defined.
- **Traceability and Metadata**: The `repositoryLink`, `author`, `date`, and `gmud` keys must be present for auditing and change management purposes.

## Best Practices
1. **Clear Rejection**: If one or more parameters are missing or incorrectly configured (such as a version mismatch between `Chart.yaml` and `values.yaml`), reject the files and point out exactly and uniquely what needs to be corrected.
2. **Examples**: When reporting an error, show the problematic snippet and how it should be based on the `base-webapp` standard.
3. **Feedback Tone**: Feedback should be direct, technical, structured in Markdown, and focused on reliability engineering (SRE/FinOps).

## Reference Files
The configuration templates based on the MyProject standard are located in the `resources/` directory of this skill:
- `.agents/skills/validating-baseweb-charts/resources/Chart.yaml`
- `.agents/skills/validating-baseweb-charts/resources/values.yaml`

Use these files as a baseline for comparison when auditing and validating charts.

