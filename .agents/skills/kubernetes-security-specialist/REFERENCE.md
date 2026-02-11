# Kubernetes Security Specialist Reference

## Tools

### 1. `kube-bench`
**Description:** Checks whether Kubernetes is deployed securely by running the checks documented in the CIS Kubernetes Benchmark.
**Common Commands:**
- `kube-bench run`: Run all checks.
- `kube-bench run --targets node`: Run checks only on worker nodes.

### 2. `kube-hunter`
**Description:** Hunts for security weaknesses in Kubernetes clusters.
**Common Commands:**
- `kube-hunter --remote <cluster-ip>`: Scan a remote cluster.
- `kube-hunter --pod`: Run inside a pod to scan from within.

### 3. `checkov`
**Description:** Static code analysis tool for infrastructure-as-code.
**Common Commands:**
- `checkov -d <directory>`: Scan all manifest files in a directory.
- `checkov -f <file>`: Scan a specific manifest file.

### 4. `kubectl-who-can`
**Description:** Show who has permissions to perform a specific action in Kubernetes.
**Common Commands:**
- `kubectl who-can get pods`: List all subjects that can get pods.
- `kubectl who-can delete deployments -n production`: List all subjects that can delete deployments in the production namespace.

### 5. `rbac-lookup`
**Description:** Easily find roles and cluster roles bound to any user, group, or service account.
**Common Commands:**
- `rbac-lookup <subject-name>`: List all RBAC bindings for a subject.
- `rbac-lookup --kind serviceaccount`: List all service accounts and their permissions.
