---
name: investigating-k8s-crashloopbackoff
description: Workflow and best practices for investigating Kubernetes CrashLoopBackOff and Application Restarts based on historical state.
---

# 🕵️ Investigating K8s CrashLoopBackOff

## 🎯 Objective
Provide a structured approach to identifying the root cause of `CrashLoopBackOff` or `Failed` pods, especially when the failure happened in the past and the cluster is currently stable or recovering.

## 🛠️ Instructions

1. **Verify Current State & Events**
   - Check the current pod status: `kubectl get pods -n <namespace>`
   - Inspect namespace events for recent anomalies (Warnings, Failed Probes, BackOffs):
     `kubectl get events -n <namespace> --sort-by='.lastTimestamp' | grep -i 'backoff\|crash\|failed\|unhealthy'`

2. **Retrieve Logs from Previous Containers**
   - If a pod restarted recently, check its previous execution logs:
     `kubectl logs -p <pod-name> -n <namespace>`
   - If the pod is completely gone, check logs of the previous deployment revision:
     `kubectl logs deployment/<deployment-name> --previous -n <namespace>`

3. **Analyze ReplicaSets & History**
   - Correlate CrashLoopBackOffs with recent deployments or hotfixes:
     `kubectl rollout history deployment/<deployment-name> -n <namespace>`
   - Describe older ReplicaSets to check for environment variable changes or image tags:
     `kubectl describe rs -n <namespace>` (Compare current RS with previous RS).
   - *Key Insight*: A rollback or hotfix (e.g., flipping a feature flag like `BURZUM_ENABLED` from `true` to `false`) often points to the root cause of the instability.

4. **Investigate Probes & OOMKilled**
   - **Readiness/Liveness Probes**: Check if probes failed (e.g., `EOF` or `timeout`). This indicates the application process hung or crashed internally.
   - **OOMKilled**: Check pod descriptions for `Exit Code 137` or `OOMKilled` reasons.
     `kubectl describe pod <pod-name> -n <namespace>`

5. **Examine Internal Application Logs**
   - Look for unhandled exceptions that might crash the Node.js/Python process.
   - Investigate external integrations (e.g., Auth APIs, logging services) that could block the main thread or cause unhandled rejections leading to container failure.
