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

**Hono at the edge.** Web-standard request and response, a tiny runtime, and it runs on Bun, Workers, and Node unchanged. A Nest container for one route is a control plane nobody asked for.

**Typed contracts, one source.** In a single repository tRPC removes the client layer entirely; across repositories or teams the OpenAPI document is generated from the code and the client is generated from the document. A hand-written client drifts silently. REST by default: GraphQL earns its resolver, cache, and depth-limit cost only when several consumers genuinely need different shapes.

**Native `fetch` with an explicit timeout and backoff.** The runtime already ships it; what a client library actually adds is retry policy, and a policy you wrote is a policy you can reason about during an incident. Every outbound call has a deadline — a request with no timeout is an outage waiting for a slow dependency.

## Configuration and secrets

**Parse the environment at boot.** Validate every variable once, at startup, and fail the process with the missing name. A service that boots and then fails on the first request at 3am has moved a config error into production traffic.

**Secrets live in the host's manager.** Rotation, audit, and least privilege come from the platform. A `.env` file is a local development convenience; committing one is a `security-ops` veto and a credential rotation.

## Quality gates

**Biome over ESLint plus Prettier.** One tool, one config, one pass, no formatter-versus-linter conflicts. Reversed by: a required lint rule or plugin with no Biome equivalent — then ESLint owns linting alone, never formatting too.

**Ruff for Python.** Lint and format in one tool; same reasoning as Biome.

**Vitest and pytest.** Vitest shares the Vite transform pipeline, so tests run the code the app runs. Reversed by: a repo already standardized on Jest where the migration is not the task.

**Playwright for end-to-end.** Real browsers, traces, and the same API that captures screenshot evidence for a PR.

## Data

**Migrations are versioned and reversible.** Every schema change is a reviewed file with a down path, applied by the same tool in every environment. Schema autosync is a local-only convenience: pointed at production it drops columns without asking.

**Money, time, and identifiers.** Store money as integer minor units backed by `numeric`, never a float — binary floating point cannot represent a cent. Store timestamps in UTC and convert only at the edge. Use UUIDv7 so primary keys stay time-ordered and indexes stop fragmenting; ULID when a human has to read or type the id.

**Object storage over database blobs.** S3-compatible storage with pre-signed URLs keeps large payloads out of the database and out of the application's memory.

**Background jobs on BullMQ** when Redis is already running, pg-boss when it is not. Either way a job is idempotent and retried with backoff: at-least-once delivery is the contract, so the handler must tolerate a repeat.

**PostgreSQL by default.** Constraints, transactions, JSONB, partial and expression indexes, and `pgvector` cover document and vector needs without a second datastore to operate. Reversed by: embedded or single-writer use (SQLite), or a genuinely measured scale need.

**Sequelize as the ORM.** Mature migrations, a stable API, and broad dialect support. An ORM owns CRUD and relations; analytical, bulk, and hot-path queries are written as SQL and reviewed as SQL. Never build a query in string concatenation — bind parameters.

**Redis for cache, queue, and rate limiting.** Reversed by: an operation that does not want another service to run — a Postgres-backed queue is enough at low volume.

**pgvector for embeddings.** One database to back up and monitor. Reversed by: roughly ten million vectors or more, or a filtered-search latency budget it cannot meet — measure before moving.

## AI

**AI SDK for model integration.** One interface for streaming, tool calls, and structured output, so switching providers is configuration rather than a rewrite. Reversed by: a provider feature with no AI SDK surface — use the provider SDK for that call only, not for the whole application. Prompts, tools, and their evals belong to `agent-engineering`.

**LiteLLM as the gateway** once there is more than one provider, a self-hosted model, or a need for per-team keys, budgets, and fallbacks. It presents one OpenAI-compatible endpoint, so routing, rate limits, and spend attribution become configuration instead of application code — and the AI SDK points at it like any other provider. Reversed by: a single provider with no routing, budget, or fallback requirement, where the gateway is one more hop to operate.

**Retrieval is hybrid.** Vector similarity alone misses exact terms, identifiers, and negations. Combine full-text and vector search, then rerank. Measure recall on a fixed question set before tuning anything.

## Clients

**Tauri over Electron.** The system webview instead of a bundled Chromium: an order of magnitude smaller, less memory, and a capability model that is deny-by-default. Reversed by: a required native Chromium integration or a webview inconsistency across the target platforms that the product cannot absorb. Multi-process and IPC security still apply — see `software-architecture`.

**React with Vite for web; Next.js when it is required.** SSR, ISR, and file routing are worth a server when the product needs them, and a whole class of hydration and caching bugs when it does not. Decide from the requirement, not from habit.

**React Native with Expo for mobile.** One codebase, over-the-air updates, managed native builds. Reversed by: a platform API or performance budget that needs native.

**Tailwind with shadcn/ui on Radix.** The accessible behaviour comes from Radix, the component source lives in the repository, so there is no vendor lock and no fighting a theme API. **TanStack Query owns server state**: caching, revalidation, and request deduplication that a `useEffect` fetch reimplements badly. **React Hook Form with Zod** validates the same schema on the client and the server.

## Platform

**pnpm workspaces with Turborepo** once a second consumer exists, and not before. A monorepo with one package is overhead.

**Multi-stage Docker on a minimal base.** Build dependencies never ship; the runtime image carries the artifact and nothing else. Pin the base by digest.

**k3s for self-hosted Kubernetes.** A single binary, a conformant cluster, and a control plane small enough to run on the hardware the product already has — the right default for on-prem, edge, homelab, and CI clusters. Reversed by: a cloud that already operates a managed control plane, where running your own buys nothing but upgrades to perform. Kubernetes at all is a `cloud-devops` decision: a single container on a managed runtime is often the honest answer.

**Argo CD for deployment.** Git holds the desired state, the cluster reconciles toward it, and drift is visible instead of discovered. Rollback is a revert, which is also the audit trail. Reversed by: a single managed service whose platform already deploys it — a GitOps controller for one container is overhead.

**Conventional commits with Changesets.** The changelog and the version bump are derived from the commits that shipped, not written from memory at release time. semantic-release fits a library that publishes on every merge.

**Feature flags decoupled from deploy.** Shipping code and enabling behaviour are separate decisions, so a bad rollout is a toggle rather than a hotfix. Every flag has an owner and a removal date; a permanent flag is a branch in production forever.

**Sentry or an OpenTelemetry-compatible equivalent.** Stack traces with release and user context turn a log line into a fixable bug. Redact PII at the SDK boundary, not after ingestion.

**OpenTelemetry with structured JSON logs.** Vendor-neutral traces and metrics; a log line is a queryable record, not a sentence. Every change that ships carries a log, a metric, and an alert — see `observability`.

**A managed OIDC provider.** Sessions, password storage, MFA, and rotation are a security surface with no product value. A hand-rolled auth stack is a `security-ops` veto.

## Recording the decision

An accepted default needs one line; a deviation needs an ADR: the constraint, the option chosen, the option rejected, and the condition that would reverse it. Without the reversal condition, the next team inherits a rule with no expiry. See [decision records](decision-records.md) for the full ADR structure, dependency-maintenance and license checks, and the boring-technology tradeoff behind these defaults.
