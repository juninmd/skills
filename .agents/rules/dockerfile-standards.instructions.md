---
name: dockerfile-standards
description: "Use when writing or reviewing Dockerfiles for multi-stage builds, non-root images, caching, and container hardening. Triggers: dockerfile, container hardening, multi-stage build, non-root container."
applyTo: "**/*Dockerfile, **/docker-compose*.yml, **/.devcontainer/*"
---

# Rule: Dockerfile Standards

> **Mission:** Minimal images. Reproducible builds. Zero root in production.

## Multi-Stage Build (MANDATORY)

```dockerfile
# Stage 1: Dependencies
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM deps AS builder
COPY . .
RUN bun run build

# Stage 3: Production — smallest possible image
FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Non-root user (MANDATORY)
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["bun", "run", "start"]
```

## Base Image Selection

```dockerfile
# ✅ Pinned versions only
FROM oven/bun:1.1.35-alpine    # Bun (preferred)
FROM node:24-alpine            # Node.js
FROM gcr.io/distroless/nodejs24-debian12  # Distroless (smallest, no shell)

# ❌ Never unpinned
FROM node:latest
FROM node:alpine  # no version = unpinned
```

## Layer Caching — Correct Order

```dockerfile
# 1. Copy manifest files FIRST (rarely change → cache hits)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Copy source code LAST (changes every build)
COPY . .
RUN pnpm build
```

## Security Rules

- Non-root user mandatory in the final stage
- No secrets or `.env` files copied into the image
- No `COPY . .` in the production stage — copy only built artifacts
- No `RUN apt-get` without `--no-cache` or cleanup in the same layer

## Checklist

- [ ] Multi-stage build: `deps` → `builder` → `runner`
- [ ] Non-root user created and active in final stage
- [ ] Base images pinned to exact version tag
- [ ] Manifest files copied before source (cache optimization)
- [ ] No secrets or credential files in any layer
- [ ] `HEALTHCHECK` defined
- [ ] Minimal base image (`alpine` or `distroless`)
