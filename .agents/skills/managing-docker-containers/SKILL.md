---
name: managing-docker-containers
description: Creation and optimization of secure, lightweight, and production-ready Docker images (Multistage, Non-Root).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Docker Containers

This skill standardizes image creation to ensure security and efficiency in the registry.

## Instructions
1.  **Security (Non-Root):** NEVER run the application as root.
    *   **Instruction:** Add `USER node` or `USER app` at the end of the Dockerfile.
    *   **Rationale:** Minimizes the attack surface in case of RCE (Remote Code Execution).
2.  **Layer Caching:** Copy `package*.json` before the source code.
    *   **Why:** Allows caching of `npm ci`. If only the code changes, the build reuses the already downloaded dependencies.
3.  **Multistage Builds:** Use build stages to discard unnecessary tools in the final image.
    *   **Stage 1:** `FROM node:24 AS builder` (Installs deps, compiles TS).
    *   **Stage 2:** `FROM node:24-alpine` (Copies only `dist/` and production `node_modules`).
4.  **Linting:** Validate the Dockerfile with `hadolint`.
    *   **Common Errors:** `DL3003` (Use `WORKDIR`), `DL3018` (Pin versions in apk add).
5.  **Healthcheck:** Always define a `HEALTHCHECK` in the Dockerfile or a K8s Probe.
    *   `HEALTHCHECK --interval=30s CMD curl -f http://localhost:8080/health || exit 1`

## Validation
*   **Check User:** `docker run --rm <image> whoami` (Should return != root).
*   **Check Size:** Compare base vs final image. Multistage should reduce size by >60%.
*   **Scan Vulnerabilities:** Use `trivy image <image>` before pushing.

---

## Orchestration with Docker Compose

Use for local environments and multi-container stacks (database, cache, app).

### Flow
1. **Analyze requirements**: Identify services, ports, volumes, and required variables.
2. **Check environment**: `docker info` to confirm that the daemon is active.
3. **Build & Deploy**: `docker compose up -d --build`
4. **Monitor**: `docker compose ps`, `docker compose logs -f <service>`
5. **Cleanup**: `docker compose down -v` (removes containers + volumes) or `docker system prune` to free up space.

### Orchestration Best Practices
- **Secrets**: Never commit `.env` with real credentials. Use `.env.example` as a template.
- **Persistence**: Use named `volumes` for critical data (e.g., `postgres_data`).
- **Networking**: Use user-defined networks (`bridge`) for isolation and name resolution between services.
- **Health Checks**: Define `healthcheck` on critical services to ensure dependencies are respected.

### Quick Diagnosis
- Inspect container: `docker inspect <container_id>`
- Resource statistics: `docker stats`
- Enter container: `docker exec -it <container> sh`


## Example: Secure Dockerfile for Node.js
```dockerfile
# Build Stage
FROM node:24-alpine AS builder
WORKDIR /app
# 1. Install dependencies first (Layer Caching)
COPY package*.json ./
RUN npm ci

# 2. Copy source code only after deps are installed
COPY . .
RUN npm run build

# Runtime Stage
FROM node:24-alpine
WORKDIR /app
# Copy artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/main.js"]
```
## Advanced Optimization Hacks

- **Cache Mounts (BuildKit):** Instead of downloading all dependencies from scratch on every CI build, use native BuildKit cache mounts in your Dockerfile for pnpm/npm.
  - **Example:** `RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install`
  - **Advantage:** `pnpm install` time drops from minutes to seconds in CI, reusing the global package cache between pipeline executions.
- **Distroless Images:** For production in Node.js, prefer Google images (e.g., `gcr.io/distroless/nodejs24-debian12`).
  - **Advantage:** They do not have a shell (`/bin/sh`), bash, or built-in package managers. This drastically reduces the attack surface, zeroing out critical OS vulnerabilities (CVEs) reported by scanners like Trivy or SonarQube, besides creating tiny images.

