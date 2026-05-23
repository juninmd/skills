# Docker Operations and Orchestration

Procedures for managing local containers and multi-service stacks.

## 1. Local Container Management
- **Status:** `docker ps`, `docker stats`.
- **Logs:** `docker logs -f <id>`.
- **Cleanup:** `docker system prune -f`, `docker container prune`.

## 2. Docker Compose Workflows
- **Deployment:** `docker compose up -d --build`.
- **Service Status:** `docker compose ps`.
- **Shutdown:** `docker compose down -v` (removes volumes).

## 3. Compose Best Practices
- **Persistence:** Use named volumes for databases and state.
- **Networking:** Use user-defined bridge networks for isolation.
- **Orchestration:** Use `depends_on` with `condition: service_healthy`.
- **Secrets:** Use `.env.example` templates; never commit `.env` with secrets.

## 4. Validation Commands
- **Check User:** `docker run --rm <image> whoami`.
- **Scan Image:** `trivy image <image>`.
- **Lint:** `hadolint Dockerfile`.
