# Kubernetes Operator Forms

## 1. Deployment Request (k8s_deployment.md)

### Goal
Request the deployment of an application to Kubernetes.

### Fields
- **App Name:** [Name]
- **Image:** [Docker Image URL]
- **Replicas:** [Number]
- **Port:** [Container Port]
- **Environment Variables:**
    - [Key]: [Value]

## 2. Cluster Status Report (cluster_status.md)

### Goal
Report on the health and status of a Kubernetes cluster or namespace.

### Fields
- **Cluster Name:** [Name]
- **Node Status:**
    - [Node 1]: [Ready/NotReady]
    - [Node 2]: [Ready/NotReady]
- **Pod Status:**
    - **Running:** [Count]
    - **Pending:** [Count]
    - **Failed:** [Count]
- **Issues:**
    - [Issue 1]
    - [Issue 2]
