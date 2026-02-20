---
name: operating-k8s
description: Operação e Troubleshooting avançado em Kubernetes (Magalu Cloud / GCP).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Kubernetes Operations

Esta skill define os requisitos mínimos para workloads de produção na Luizalabs, focando em estabilidade e segurança.

## Instructions
1.  **Resilience (Probes):** NUNCA faça deploy sem Liveness e Readiness Probes.
    *   **Liveness:** `httpGet /healthz`. Reinicia o pod se travar.
    *   **Readiness:** `httpGet /ready`. Remove do Load Balancer se sobrecarregado.
2.  **Resources (Quotas):** Defina obrigatoriamente `requests` e `limits`.
    *   **Requests:** Garante alocação mínima.
    *   **Limits:** Previne OOMKill de nós inteiros ("Noisy Neighbor").
    *   **Example:** `requests: cpu: 100m, memory: 128Mi`, `limits: cpu: 500m, memory: 256Mi`.
3.  **Security (Pod Context):** Rode pods com `securityContext: runAsNonRoot: true`.
    *   **Reasoning:** Evita escalada de privilégios.
4.  **Scaling (HPA):** Use Horizontal Pod Autoscaler baseado em CPU/Memória (target 70%).

## Common Tasks
*   **Debug CrashLoopBackOff:** `kubectl logs -p <pod>` (Logs do pod anterior que morreu).
*   **Check Resource Usage:** `kubectl top pod` (Verifique se está perto do limit).
*   **Port Forward:** `kubectl port-forward <pod> 8080:80` (Acesso direto para debug).
*   **Events:** `kubectl get events --sort-by=.metadata.creationTimestamp` (O que aconteceu recentemente no cluster?).

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