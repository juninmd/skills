# Reference: Advanced Kubernetes Commands

## Networking
- `kubectl get ingress`: Listar entradas de rede.
- `kubectl port-forward <pod> 8080:80`: Acesso local temporário.

## Troubleshooting
- `kubectl get events --sort-by=.metadata.creationTimestamp`: Ver eventos recentes.
- `kubectl top pods`: Ver consumo de CPU/Memória por pod.
