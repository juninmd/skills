---
name: generate-dockerfile
description: "Generate a production-ready, multi-stage, secure Dockerfile and .dockerignore for the detected project. Triggers: generate dockerfile, create dockerfile, containerize this app, dockerize this project."
argument-hint: "[directory or language hint]"
---
# Generate Dockerfile

When the user invokes `/generate-dockerfile` $ARGUMENTS:

- Respond in the same language the user is using.

## Step 1 — Detect Project Type

Scan project files to determine language, runtime, and framework:

| File | Runtime |
|---|---|
| `package.json` | Node.js — check `engines.node` for version; detect framework (Next.js, NestJS, Express, etc.) |
| `requirements.txt` / `pyproject.toml` | Python — check version in `.python-version`, `pyproject.toml`, or `runtime.txt` |
| `go.mod` | Go — extract version from `go` directive |
| `Cargo.toml` | Rust |
| `*.csproj` / `*.sln` | .NET |
| `pom.xml` / `build.gradle` | Java / Kotlin |

If multiple runtimes are detected, ask which to target.

## Step 2 — Generate Dockerfile

Apply all of the following without exception:

### Structure
- **Multi-stage build**: separate `deps`, `builder`, and `runner` stages
- Final stage must be the smallest possible image

### Base Images (by runtime)
| Runtime | Builder | Runner |
|---|---|---|
| Node.js | `node:<version>-alpine` | `gcr.io/distroless/nodejs<version>-debian12` or `node:<version>-alpine` |
| Python | `python:<version>-slim` | `gcr.io/distroless/python3-debian12` or `python:<version>-slim` |
| Go | `golang:<version>-alpine` | `gcr.io/distroless/static-debian12` (static binary) |
| Rust | `rust:<version>-alpine` | `gcr.io/distroless/static-debian12` |
| .NET | `mcr.microsoft.com/dotnet/sdk:<version>` | `mcr.microsoft.com/dotnet/aspnet:<version>` |

### Security
- Non-root user in the final stage (`USER nonroot:nonroot` for Distroless, or create `appuser`)
- No secrets, credentials, or `.env` files copied into the image
- Read-only filesystem where possible (`--read-only` flag documented in run instructions)
- Set `NODE_ENV=production` for Node.js, equivalent production flags for other runtimes

### Layer Caching
- Copy dependency manifests first (`package.json`, `requirements.txt`, `go.mod`, etc.)
- Install dependencies before copying source code
- This ensures cache hits on unchanged dependencies

### Runtime Configuration
- `EXPOSE` the correct port (detect from source or framework defaults)
- `HEALTHCHECK --interval=30s --timeout=5s --retries=3` with an appropriate command
- Prefer `CMD` array form over shell form: `CMD ["node", "dist/index.js"]`
- Set `WORKDIR` explicitly

## Step 3 — Generate .dockerignore

Always include:
```
.git
.env*
node_modules/        # Node
__pycache__/         # Python
*.pyc
target/              # Rust / Java
dist/                # if build output is separate
*.log
*.md
.DS_Store
```

Add runtime-specific entries as detected.

## Output Format

1. `Dockerfile` in a code block
2. `.dockerignore` in a code block
3. Build and run commands:
   ```bash
   docker build -t app:latest .
   docker run --rm -p <port>:<port> app:latest
   ```
4. One-line explanation of any non-obvious decision made
