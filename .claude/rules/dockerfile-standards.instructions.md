---
name: dockerfile-standards
description: "Use when writing Dockerfiles. Triggers: dockerfile, multi-stage build, non-root container."
applyTo: "**/Dockerfile, **/docker-compose*.yml"
paths:
  - "**/Dockerfile"
  - "**/docker-compose*.yml"
trigger: glob
globs: "**/Dockerfile,**/docker-compose*.yml"
---

# Rule: Dockerfile

**Multi-stage build (mandatory):**
```dockerfile
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Non-root (mandatory)
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
USER appuser

HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["bun", "run", "start"]
```

**Rules:**
- Pin base images to exact version (no `:alpine`, use `:1-alpine`)
- No secrets or `.env` files in image
- No `COPY . .` in production stage
- Multi-stage: `deps` → `builder` → `runner`

**Checklist:**
- [ ] Non-root user in final stage
- [ ] Base images pinned to exact version
- [ ] No secrets in any layer
- [ ] HEALTHCHECK defined