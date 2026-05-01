# Backend Skills

Skills for server-side development across languages and frameworks.

## `developing-node`

**Invoke:** `/developing-node`

Node.js and TypeScript development with the 2026 recommended stack.

**Stack:**
- Runtime: Node.js 24 LTS
- Package manager: pnpm
- TypeScript: strict mode
- Linting/formatting: Biome (replaces ESLint + Prettier)
- Compiler: SWC
- Build: Vite 8
- Monorepo: Turborepo

**Covers:** pnpm vs npm detection, script execution, strict TypeScript config, Biome setup, module resolution, monorepo workspace configuration.

---

## `developing-python`

**Invoke:** `/developing-python`

Modern Python development workflow.

**Stack:**
- Package manager: uv (replaces pip, virtualenv, poetry)
- Linting/formatting: ruff (replaces flake8, black, isort)
- Config: pyproject.toml
- Scripts: PEP 723 inline metadata
- Testing: pytest

**Covers:** uv project setup, ruff configuration, pyproject.toml structure, virtual environment management, dependency groups.

---

## `modern-python`

**Invoke:** `/modern-python`

Python toolchain deep-dive for 2026.

- **uv** — package and project management
- **ruff** — linting and formatting
- **ty** — type checking (next-gen mypy alternative)
- **prek** — pre-commit hook management

---

## `developing-fastapi`

**Invoke:** `/developing-fastapi`

FastAPI with Pydantic v2.

**Covers:** async route handlers, Pydantic v2 models, dependency injection, modular router structure, OpenAPI docs customization, background tasks, middleware.

---

## `developing-go`

**Invoke:** `/developing-go`

Go development with clean architecture.

**Covers:** module setup, goroutine patterns, channel communication, error wrapping, interface design, clean architecture layers, testing with `testing` package.

---

## `developing-rust`

**Invoke:** `/developing-rust`

Rust systems programming.

**Covers:** ownership and borrowing, lifetime annotations, trait design, error handling (`Result`, `?` operator), Cargo workspace, async with Tokio, unsafe code guidelines.

---

## `developing-dotnet`

**Invoke:** `/developing-dotnet`

.NET development.

**Covers:** async/await patterns, SOLID application, Entity Framework Core, xUnit testing, middleware pipeline, configuration management, health checks.

---

## `developing-nestjs`

**Invoke:** `/developing-nestjs`

NestJS modular architecture.

**Covers:** module structure, controller/service/repository pattern, validation pipes, guards and interceptors, JWT authentication, Swagger documentation, testing with Jest.
