# Kubernetes Operator Skill

## Description
This skill enables the agent to deploy, manage, and scale containerized applications on Kubernetes clusters. It involves defining manifests, managing deployments, services, and ingress resources, and troubleshooting cluster issues.

## Workflow

### 1. Define Manifests
- Create YAML manifests for Kubernetes objects (Pods, Deployments, Services, ConfigMaps, Secrets).
- Use Helm charts for packaging complex applications.

### 2. Deploy & Manage
- Apply manifests to the cluster (using `kubectl`).
- Perform rolling updates or rollbacks.
- Scale applications horizontally (HPA) or vertically.

### 3. Network & Storage
- Expose applications using Services (ClusterIP, NodePort, LoadBalancer) and Ingress.
- Manage persistent storage using PersistentVolumes (PV) and PersistentVolumeClaims (PVC).

### 4. Monitor & Troubleshoot
- Inspect pod logs and events.
- Exec into containers for debugging.
- Monitor cluster health and resource usage.

## Best Practices
- **Declarative Configuration:** Always use YAML files to define the state of the cluster.
- **Namespaces:** Use namespaces to isolate resources and environments.
- **Resource Limits:** Always define CPU and memory requests and limits for containers.
