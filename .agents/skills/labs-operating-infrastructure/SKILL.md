---
name: labs-operating-infrastructure
description: Advanced infrastructure operations (RDP fix, K8s clean, DNS, Traffic Shifting).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/cluster] [options]"
disable-model-invocation: true
---

# Infrastructure Operations

A set of procedures for maintenance and troubleshooting of cloud and on-premise infrastructure.

## Capabilities

### 1. Fix Windows RDP NLA
**Trigger:** "NLA error", "RDP failure".
- **Action:** Disable NLA via remote registry.
- **Command:** `reg add "HKLM\...\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 0 /f`.

### 2. Kubernetes Bulk Deprovision
**Trigger:** "clean cluster", "delete apps".
- **Action:** Remove Application in ArgoCD or direct resources.
- **Command:** `kubectl delete application <app> -n argocd --cascade=foreground`.

### 3. Traffic Weight Shift
**Trigger:** "shift load", "canary".
- **Action:** Adjust weights in Ingress/GLB (0 vs 100).
- **Validation:** Check P95 latency before shifting.

### 4. Decommission DNS FQDN
**Trigger:** "remove dns", "decommission".
- **Action:** Remove entry in Route53 and Edge (Azion).
- **Command:** `aws route53 change-resource-record-sets ...`.
