---
name: operating-k8s
description: Advanced operation and troubleshooting in Kubernetes (platform Cloud / GCP).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/cluster] [options]"
disable-model-invocation: true
---

# Kubernetes Operations

This skill defines the minimum requirements for production workloads at MyProject, focusing on stability and security.

## Instructions
1.  **Resilience (Probes):** NEVER deploy without Liveness and Readiness Probes.
    *   **Liveness:** `httpGet /healthz`. Restarts the pod if it hangs.
    *   **Readiness:** `httpGet /ready`. Removes from the Load Balancer if overloaded.
2.  **Resources (Quotas):** Mandatory definition of `requests` and `limits`.
    *   **Requests:** Guarantees minimum allocation.
    *   **Limits:** Prevents OOMKill of entire nodes ("Noisy Neighbor").
    *   **Example:** `requests: cpu: 100m, memory: 128Mi`, `limits: cpu: 500m, memory: 256Mi`.
3.  **Security (Pod Context):** Run pods with `securityContext: runAsNonRoot: true`.
    *   **Rationale:** Avoids privilege escalation.
4.  **Scaling (HPA):** Use Horizontal Pod Autoscaler based on CPU/Memory (70% target).

## Common Tasks
*   **Debug CrashLoopBackOff:** `kubectl logs -p <pod>` (Logs from the previous dead pod).
*   **Check Resource Usage:** `kubectl top pod` (Check if it's close to the limit).
*   **Port Forward:** `kubectl port-forward <pod> 8080:80` (Direct access for debugging).
*   **Events:** `kubectl get events --sort-by=.metadata.creationTimestamp` (What happened recently in the cluster?).

## Example: Production Deployment Spec
```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: app
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 3
```

