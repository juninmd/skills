# Kubernetes Security Specialist Forms

## 1. Kubernetes Security Audit Request (k8s_security_audit.md)

### Goal
Initiate a security audit of a Kubernetes cluster or specific namespace.

### Fields
- **Cluster Context:** [Context Name]
- **Namespace:** [Specific Namespace / All]
- **Audit Scope:** [RBAC / NetworkPolicies / Node Security / Workload Security]
- **Standard:** [CIS Benchmark / Custom Policy]

## 2. RBAC Policy Request (rbac_policy_request.md)

### Goal
Request new or updated RBAC permissions.

### Fields
- **Subject Type:** [User / Group / ServiceAccount]
- **Subject Name:** [Name]
- **Namespace:** [Namespace]
- **API Groups:** [e.g., "", "apps", "batch"]
- **Resources:** [e.g., "pods", "deployments", "jobs"]
- **Verbs:** [e.g., "get", "list", "watch", "create", "update", "patch", "delete"]
- **Justification:** [Reason for the request]

## 3. Security Findings Report (k8s_security_report.md)

### Goal
Document identified security risks and remediation steps.

### Fields
- **Cluster/Namespace:** [Name]
- **Date:** [Date]
- **Severity:** [Critical / High / Medium / Low]
- **Finding:** [Description of the issue]
- **Impact:** [What could happen if exploited]
- **Remediation:** [Steps to fix the issue]
