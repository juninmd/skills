# Stack Rationale

Why each default in the table holds, and the evidence that reverses it. Open the row you are deciding; do not read the file end to end.

## Language and runtime

**TypeScript over JavaScript.** Types are the cheapest regression test for contracts that cross a module or a network boundary. `strict` from the first commit: enabling it later means fixing every file at once. Reversed by: a single-file script with no consumers.

**Bun over Node.** One binary for runtime, test runner, bundler, and installer; faster cold start and install. Reversed by: a dependency with native bindings that Bun does not load, a host that only ships Node, or an ecosystem tool that assumes Node internals. Verify the dependency actually fails under Bun before falling back — a stale blog post is not evidence.

**pnpm over npm.** Content-addressable store and a strict node_modules that surfaces undeclared dependencies instead of hiding them behind hoisting. Reversed by: a Bun-only project using `bun install`. Never two lockfiles in one workspace.

**uv over pip and poetry.** Resolves and installs in a fraction of the time, manages the interpreter, and locks reproducibly. Reversed by: an existing poetry repo where migrating is out of scope right now.

## Services and contracts

**NestJS for HTTP and RPC services.** Modules, dependency injection, and DTO validation give every service the same shape, which is what makes a codebase with many services reviewable. Reversed by: a single endpoint, an edge runtime, or a latency budget where the container costs more than it returns — Hono or Fastify then.

**Scalar over Swagger UI.** Same OpenAPI document, a readable reference, and request examples that work. The document stays generated from code; a hand-maintained spec drifts within a sprint. Reversed by: Swagger UI already embedded and pinned where replacing it buys nothing.

**Zod and Pydantic at the boundary.** Parse untrusted input into a typed value once, at the edge, and let the rest of the code trust it. A DTO without runtime validation is a type that lies.

## Quality gates

**Biome over ESLint plus Prettier.** One tool, one config, one pass, no formatter-versus-linter conflicts. Reversed by: a required lint rule or plugin with no Biome equivalent — then ESLint owns linting alone, never formatting too.

**Ruff for Python.** Lint and format in one tool; same reasoning as Biome.

**Vitest and pytest.** Vitest shares the Vite transform pipeline, so tests run the code the app runs. Reversed by: a repo already standardized on Jest where the migration is not the task.

**Playwright for end-to-end.** Real browsers, traces, and the same API that captures screenshot evidence for a PR.

## Data

**PostgreSQL by default.** Constraints, transactions, JSONB, partial and expression indexes, and `pgvector` cover document and vector needs without a second datastore to operate. Reversed by: embedded or single-writer use (SQLite), or a genuinely measured scale need.

**Sequelize as the ORM.** Mature migrations, a stable API, and broad dialect support. An ORM owns CRUD and relations; analytical, bulk, and hot-path queries are written as SQL and reviewed as SQL. Never build a query in string concatenation — bind parameters.

**Redis for cache, queue, and rate limiting.** Reversed by: an operation that does not want another service to run — a Postgres-backed queue is enough at low volume.

**pgvector for embeddings.** One database to back up and monitor. Reversed by: roughly ten million vectors or more, or a filtered-search latency budget it cannot meet — measure before moving.

## AI

**AI SDK for model integration.** One interface for streaming, tool calls, and structured output, so switching providers is configuration rather than a rewrite. Reversed by: a provider feature with no AI SDK surface — use the provider SDK for that call only, not for the whole application. Prompts, tools, and their evals belong to `agent-engineering`.

## Clients

**Tauri over Electron.** The system webview instead of a bundled Chromium: an order of magnitude smaller, less memory, and a capability model that is deny-by-default. Reversed by: a required native Chromium integration or a webview inconsistency across the target platforms that the product cannot absorb. Multi-process and IPC security still apply — see `software-architecture`.

**React with Vite for web; Next.js when it is required.** SSR, ISR, and file routing are worth a server when the product needs them, and a whole class of hydration and caching bugs when it does not. Decide from the requirement, not from habit.

**React Native with Expo for mobile.** One codebase, over-the-air updates, managed native builds. Reversed by: a platform API or performance budget that needs native.

## Platform

**pnpm workspaces with Turborepo** once a second consumer exists, and not before. A monorepo with one package is overhead.

**Multi-stage Docker on a minimal base.** Build dependencies never ship; the runtime image carries the artifact and nothing else. Pin the base by digest.

**OpenTelemetry with structured JSON logs.** Vendor-neutral traces and metrics; a log line is a queryable record, not a sentence. Every change that ships carries a log, a metric, and an alert — see `observability`.

**A managed OIDC provider.** Sessions, password storage, MFA, and rotation are a security surface with no product value. A hand-rolled auth stack is a `security-ops` veto.

## Recording the decision

An accepted default needs one line; a deviation needs an ADR: the constraint, the option chosen, the option rejected, and the condition that would reverse it. Without the reversal condition, the next team inherits a rule with no expiry.
