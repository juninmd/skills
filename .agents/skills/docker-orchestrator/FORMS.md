# Docker Orchestrator Forms

## 1. Container Deployment Form (deployment.md)

### Goal
Define the configuration for a single container deployment.

### Fields
- **Container Name:** [Name of the container]
- **Image:** [Image name and tag]
- **Ports:** [Host:Container mapping]
- **Volumes:** [Host:Container mapping]
- **Environment Variables:**
    - [KEY]=[VALUE]
- **Restart Policy:** [no, on-failure, always, unless-stopped]

## 2. Service Orchestration Form (orchestration.md)

### Goal
Define a multi-container application using Docker Compose.

### Fields
- **Project Name:** [Name of the orchestration project]
- **Services:**
    - **Service 1:**
        - Image: [Image]
        - Dependencies: [Other services]
    - **Service 2:**
        - Image: [Image]
- **Networks:** [Custom network names]
- **Volumes:** [Named volume definitions]
