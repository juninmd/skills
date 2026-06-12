---
name: mastering-docker
description: "Mastering Docker for Creating and, Hardening container, Managing local via docker."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Linux, macOS, Windows (WSL2)"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Mastering Docker

Expert methodology for standardizing image creation and container orchestration to ensure production-grade security, minimal footprint, and build efficiency.

**USE FOR:**
- Creating and optimizing production Dockerfiles using multi-stage builds.
- Hardening container security through non-root users and vulnerability scanning.
- Managing local development environments with Docker Compose.
- Implementing build-time optimizations using BuildKit cache mounts.
- Troubleshooting containerized application lifecycle and performance.

**DO NOT USE FOR:**
- High-level cluster management or service mesh configuration.
- Generic automation unrelated to containerization.

**INVOKES:**
- `docker`, `docker-compose`, `hadolint`, `trivy` CLI tools.

## Methodology and Guidelines
Implementation details for Dockerfile standards and orchestration operations are documented in:
1. [Dockerfile Best Practices](references/dockerfile-standards.md)
2. [Docker Operations & Orchestration](references/docker-operations.md)

## Core Principles
1. **Minimalism:** Use the smallest possible base images (Alpine/Distroless).
2. **Security by Default:** Run as a non-privileged user and scan images before shipping.
3. **Cache Efficiency:** Order layers to maximize reuse and minimize CI build times.

## Checklist
- [ ] Keep the runtime image minimal and use a non-root user.
- [ ] Validate build reproducibility and health check configurations.
- [ ] Scan the final image for size and vulnerability regressions.
- [ ] Ensure all persistent data is mapped to named volumes.
