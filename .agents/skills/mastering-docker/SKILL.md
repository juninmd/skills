---
name: mastering-docker
description: "Secure production-ready Docker images and orchestration. Triggers: docker, container."
argument-hint: "[Dockerfile/project path] [options]"
---

# Mastering Docker

This skill standardizes image creation and container management to ensure security, minimal size, and efficiency in production.

## Instructions
1. **Use Minimal Base Images:** Prefer Alpine, minimal Debian/Ubuntu variants (e.g., `alpine`, `debian:bullseye-slim`), or official slim images (e.g., `node:18-alpine`, `python:3.11-slim`). For Node.js production, consider Distroless images (e.g., `gcr.io/distroless/nodejs24-debian12`) to eliminate OS vulnerabilities.
2. **Multi-Stage Builds:** Always use multi-stage builds to separate build dependencies from runtime dependencies. This drastically reduces the final image size (often by >60%).
3. **Non-Root User:** Never run the application as the `root` user in production. Create a dedicated user and switch to it using the `USER` instruction to minimize the attack surface in case of Remote Code Execution (RCE).
4. **Layer Caching:** Order instructions from least likely to change to most likely to change. Copy dependency files (e.g., `package.json`, `requirements.txt`) and install dependencies before copying the source code. This reuses cached layers when only code changes.
5. **Security Scanning & Linting:** Validate the Dockerfile with `hadolint`. Run a security scan (e.g., `trivy image <image>`) on the final image before pushing.
6. **Healthcheck:** Always define a `HEALTHCHECK` in the Dockerfile or a Kubernetes Probe.
7. **Cache Mounts (BuildKit):** Use native BuildKit cache mounts in your Dockerfile for package managers (e.g., `RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install`) to speed up CI builds.

## Example: Secure Node.js Dockerfile
```dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
# Install dependencies first (Layer Caching)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
# Copy source code only after deps are installed
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Create and switch to non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
# Define a healthcheck
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
EXPOSE 3000
CMD ["npm", "start"]
```

## Orchestration with Docker Compose
Use `docker compose` for local environments and multi-container stacks (database, cache, app).

### Flow
1. **Analyze requirements**: Identify services, ports, volumes, and required variables.
2. **Check environment**: `docker info` to confirm the daemon is active.
3. **Build & Deploy**: `docker compose up -d --build`
4. **Monitor**: `docker compose ps`, `docker compose logs -f <service>`
5. **Cleanup**: `docker compose down -v` (removes containers + volumes) or `docker system prune` to free up space.

### Best Practices
- **Secrets**: Never commit `.env` with real credentials. Use `.env.example` as a template.
- **Persistence**: Use named `volumes` for critical data (e.g., `postgres_data`).
- **Networking**: Use user-defined networks (`bridge`) for isolation and name resolution between services.
- **Health Checks**: Define `healthcheck` on critical services (e.g., database) and use `depends_on: condition: service_healthy` in dependent services.

## Validation Commands
*   **Check User:** `docker run --rm <image> whoami` (Should return != root).
*   **Check Size:** `docker images` (Compare base vs final image).
*   **Lint Dockerfile:** `hadolint Dockerfile`
*   **Scan Vulnerabilities:** `trivy image <image>`

## Checklist

- [ ] Keep the runtime image minimal and non-root unless a constraint requires otherwise.
- [ ] Validate build reproducibility, secret handling, and health checks before shipping.
- [ ] Scan the final image for size, user, and vulnerability regressions.

## References

- [Docker Documentation](https://docs.docker.com/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Hadolint Repository](https://github.com/hadolint/hadolint)
