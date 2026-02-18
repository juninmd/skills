---
name: kubernetes-security-specialist
description: Secure Kubernetes clusters with RBAC management, configuration auditing, network policies, and runtime security
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Kubernetes Security Specialist Skill

## Description
This skill enables the agent to secure Kubernetes clusters by implementing security best practices, auditing configurations, and managing Role-Based Access Control (RBAC). It focuses on Kubernetes Security Posture Management (KSPM), network policies, and container security.

## Workflow

### 1. Configuration Audit
- Use tools like `kube-bench` to check the cluster against CIS Kubernetes Benchmarks.
- Scan manifests and Helm charts for security misconfigurations using tools like `checkov` or `tfsec`.

### 2. RBAC Management
- Audit existing ClusterRoles, Roles, RoleBindings, and ClusterRoleBindings.
- Implement the principle of least privilege by defining specific permissions for service accounts and users.
- Identify and remediate risky permissions (e.g., ability to create pods with `hostPath` or `privileged: true`).

### 3. Network Security
- Define and implement NetworkPolicies to restrict pod-to-pod communication.
- Audit ingress and egress rules to ensure minimal exposure.

### 4. Runtime Security
- Monitor for suspicious activities using tools like `Falco`.
- Implement Pod Security Admissions or OPA Gatekeeper to enforce security policies at runtime.

## Best Practices
- **Least Privilege:** Always grant the minimum permissions necessary for a task.
- **Secrets Management:** Use Kubernetes Secrets or external secret managers (e.g., HashiCorp Vault) instead of environment variables or config maps for sensitive data.
- **Immutable Infrastructure:** Treat pods as immutable and avoid manual changes in running containers.
- **Regular Updates:** Keep the Kubernetes control plane and worker nodes patched and updated.
