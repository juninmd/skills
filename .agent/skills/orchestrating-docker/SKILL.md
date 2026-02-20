---
name: orchestrating-docker
description: Manage containerized applications using Docker and Docker Compose for lifecycle, networking, and orchestration
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Docker Orchestrator Skill

## Description
This skill enables the agent to manage containerized applications using Docker and Docker Compose. It covers container lifecycle management, image operations, network configuration, and service orchestration.

## Workflow

### 1. Analyze Requirements
- Determine the necessary services, images, and configurations (ports, volumes, environment variables).
- Check if existing containers or images conflict with the new setup.

### 2. Environment Setup
- Ensure Docker is installed and running (using `docker info`).
- Create necessary directories and configuration files (e.g., `Dockerfile`, `docker-compose.yml`).

### 3. Build & Deploy
- Use `docker build` to create custom images if needed.
- Use `docker run` for single containers or `docker-compose up -d` for multi-container applications.
- Verify the deployment using `docker ps` and logs.

### 4. Monitor & Maintain
- Monitor container health and resource usage (`docker stats`).
- Inspect container configurations (`docker inspect`).
- Perform maintenance tasks like stopping, restarting, or removing containers/images.

### 5. Cleanup
- Remove unused containers, images, and networks to free up space (`docker system prune`).

## Best Practices
- **Security:** Avoid running containers as root when possible. Use environment variables for secrets (but do not commit them).
- **Efficiency:** Use multi-stage builds and lightweight base images (e.g., Alpine).
- **Persistence:** Use volumes for persistent data.
- **Networking:** Use user-defined bridges for better isolation and service discovery.
