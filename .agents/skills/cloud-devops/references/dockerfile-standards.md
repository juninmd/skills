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

## 4. Multi-Stage Pitfalls

| Pitfall | Consequence | Fix |
|---|---|---|
| A secret passed via `ARG`/`ENV` (npm token, private registry password) | baked into that layer's history — `docker history` or a leaked layer reveals it even if the final stage never copies it forward | `RUN --mount=type=secret,id=npm_token cat /run/secrets/npm_token \| npm config set ...` — the secret never becomes a layer |
| `COPY . .` before installing dependencies | any source edit invalidates the cache from that line down, so every build reinstalls dependencies | copy only the manifest/lockfile first, install, then `COPY . .` for source |
| Final stage still holds the compiler, build deps, or a shell it does not need | larger attack surface — a shell in the runtime image is a shell an RCE can use | copy only build output (`COPY --from=builder /app/dist`) into a minimal or distroless final stage |
| Package manager cache left in the final layer | dead weight, and a place stale/vulnerable cached packages hide | `apt-get clean && rm -rf /var/lib/apt/lists/*`, or use `--mount=type=cache` so the cache never lands in a committed layer |
| `curl \| bash` or fetching an installer script in the final stage | supply-chain trust extended to whatever that URL serves at build time, with no pinned checksum | vendor the binary, or pin the script by digest and verify a checksum before executing it |

`ARG` values are visible to anyone who can pull the image and run `docker history --no-trunc`,
even from an intermediate stage that was never tagged or pushed on its own — multi-stage does not
make an `ARG` secret private, it only controls what ends up in the *final* filesystem.
