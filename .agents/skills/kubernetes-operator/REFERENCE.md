# Kubernetes Operator Reference

## Tools

### 1. `kubectl`
**Description:** The command-line tool for controlling Kubernetes clusters.
**Common Commands:**
- `kubectl get pods`: List all pods.
- `kubectl apply -f file.yaml`: Apply a configuration.
- `kubectl logs [pod_name]`: Print the logs for a container in a pod.
- `kubectl describe pod [pod_name]`: Show detailed information about a pod.

### 2. `helm`
**Description:** The package manager for Kubernetes.
**Common Commands:**
- `helm install [release_name] [chart]`: Install a chart.
- `helm list`: List releases.
- `helm upgrade [release_name] [chart]`: Upgrade a release.

### 3. `minikube` / `kind`
**Description:** Tools for running local Kubernetes clusters.
