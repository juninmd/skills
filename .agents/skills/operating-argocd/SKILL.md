---
name: operating-argocd
description: Operations with ArgoCD CLI to manage applications, identify synchronization issues, and troubleshoot deployments in Kubernetes clusters.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[app-name] [options]"
---

# ArgoCD Operations

This skill provides advanced capabilities for managing deployments and troubleshooting applications via ArgoCD CLI, the standard for GitOps at Luizalabs.

## When to use this skill
- Identifying why an application is "OutOfSync" or "Degraded" in ArgoCD.
- Manually synchronizing applications when the automated process fails.
- Reviewing application history and performing rollbacks.
- Checking resource health and events within an ArgoCD application.
- Managing clusters and repositories linked to ArgoCD.

## Instructions

### Authentication
Before any operation, ensure you are logged in:
```bash
# Set server and credentials via env vars
argocd login $ARGOCD_SERVER --username $ARGOCD_USER --password $ARGOCD_PASSWORD --grpc-web
```

### Common Troubleshooting Commands

#### 1. Check Application Status
```bash
# Get detailed status of an application
argocd app get <app-name>

# List all applications and their health/sync status
argocd app list
```

#### 2. Identify Sync Issues
If the app is `OutOfSync`, check the diff:
```bash
# Show differences between Git and Cluster
argocd app diff <app-name>
```

#### 3. Sync Application
```bash
# Manually sync an application
argocd app sync <app-name>

# Sync only specific resources
argocd app sync <app-name> --resource <group>:<kind>:<name>

# Force sync and replace (destructive)
argocd app sync <app-name> --force --replace
```

#### 4. Debugging "Degraded" State
Check resource health and events:
```bash
# Show resources and their individual health
argocd app resources <app-name>

# Show events for a specific application
argocd app events <app-name>
```

#### 5. History and Rollback
```bash
# List deployment history
argocd app history <app-name>

# Rollback to a specific revision
argocd app rollback <app-name> <revision-id>
```

## Best Practices
- **GitOps First:** Avoid manual syncs (`--force`) in production unless it's an emergency. Fix the root cause in Git first.
- **Diff Review:** Always run `argocd app diff` before a manual sync to understand what will change.
- **Health Checks:** If an app is `Degraded`, check Kubernetes logs (`kubectl logs`) and events (`kubectl get events`) in the target namespace.
- **Pruning:** Use `--prune` during sync to remove resources that are no longer in Git (be careful with shared resources).

## Testing Scenarios
- **Scenario: App is OutOfSync.**
  - **Action:** Run `argocd app diff` to identify the deviating manifest.
- **Scenario: App is Degraded.**
  - **Action:** Run `argocd app resources` and then check logs of the failing pod via `kubectl`.
- **Scenario: Pipeline timed out waiting for sync.**
  - **Action:** Run `argocd app wait <app-name>` to see where it's hanging.

## Capabilities
- **Sync Management**: Manual and automated synchronization.
- **Troubleshooting**: Diff analysis, event review, and health checks.
- **History**: Rollbacks and revision management.
- **Resource Analysis**: Inspection of K8s resources managed by ArgoCD.
