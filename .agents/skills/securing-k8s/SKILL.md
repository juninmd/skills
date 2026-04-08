---
name: securing-k8s
description: Protect Kubernetes clusters with RBAC management, configuration auditing, network policies, and runtime security.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Kubernetes Security Specialist

## Description
This skill empowers the agent to protect Kubernetes clusters through security best practices, configuration auditing, and Role-Based Access Control (RBAC) management. Focus includes Kubernetes Security Posture Management (KSPM), network policies, and container security.

## Flow

### 1. Configuration Auditing
- Use tools like `kube-bench` to check adherence to CIS Kubernetes Benchmarks.
- Scan manifests and Helm charts to detect misconfigurations with `checkov` or `tfsec`.

### 2. RBAC Management
- Audit existing ClusterRoles, Roles, RoleBindings, and ClusterRoleBindings.
- Implement the principle of least privilege with specific permissions for service accounts and users.
- Identify and fix risky permissions (e.g., pods created with `hostPath` or `privileged: true`).

### 3. Network Security
- Define and implement NetworkPolicies to restrict communication between pods.
- Audit ingress and egress rules to maintain minimal exposure.

### 4. Runtime Security
- Monitor suspicious activities with tools like `Falco`.
- Implement Pod Security Admission or OPA Gatekeeper to enforce runtime policies.

## Best Practices
- **Least Privilege:** Grant only the minimum required permissions.
- **Secrets Management:** Use Kubernetes Secrets or external secret managers (e.g., HashiCorp Vault) instead of environment variables/config maps for sensitive data.
- **Immutable Infrastructure:** Treat pods as immutable and avoid manual changes to running containers.
- **Regular Updates:** Keep the control plane and workers updated and patched.
