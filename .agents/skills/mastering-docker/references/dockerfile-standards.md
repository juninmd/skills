# Dockerfile Best Practices and Standards

Guidelines for creating secure, minimal, and efficient Docker images.

## 1. Image Hygiene
- **Minimal Bases:** Use Alpine, Debian-slim, or Distroless (e.g., `gcr.io/distroless/nodejs`).
- **Multi-Stage Builds:** Separate build-time dependencies from the runtime environment.
- **Non-Root User:** Always create a dedicated user and use `USER <name>` instruction.

## 2. Optimization and Security
- **Layer Caching:** Order instructions from least to most likely to change (deps before source).
- **BuildKit Cache:** Use `--mount=type=cache` for package manager stores (npm, pip, cargo).
- **Healthchecks:** Define `HEALTHCHECK` for container-level observability.
- **Scanning:** Lint with `hadolint` and scan for vulnerabilities with `trivy`.
- **Pin Base Images:** Pin base images to an exact version (avoid floating tags like `:alpine`, use `:3.14-alpine`).
- **No Secrets:** Never include secrets or `.env` files in the image. Use secret mounts or runtime injection.
- **Strict Production Stage:** Avoid `COPY . .` in the final production stage.

## 3. Example: Secure Multi-Stage Dockerfile
```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["npm", "start"]
```
