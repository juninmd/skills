---
name: stack-selection
description: |
  Choose default technologies and compare candidates before code exists: TypeScript, Bun versus Node, pnpm, uv, NestJS, Biome, Scalar versus Swagger, standardizing an SDK for LLM integration, Tauri versus Electron. Use for "which should we use", picking a package manager, framework, ORM, linter, or desktop shell, adopting or replacing a dependency, and justifying a deviation.
---

# Stack Selection

**Not this skill:** an established stack with no migration authorized (follow it), implementing a pick already made (`backend-systems`, `frontend-engineering`, `data-engineering`), or module boundaries and data flow (`software-architecture`).

## Preflight
Read what already exists before recommending anything. An established stack wins over any default here.

```bash
rg --files --hidden -g package.json -g '*.lock' -g 'bun.lock*' -g pyproject.toml -g Cargo.toml -g '*.toml' -g 'docker-compose*' -g '.github/workflows/*' -g '!node_modules' -g '!.git'
cat package.json 2>/dev/null | head -40
git log --oneline -10 -- package.json pyproject.toml
```
Identify the runtime, package manager, linter, test runner, and data store actually in use. A single greenfield directory is a default decision; an existing repository is a migration decision.

## Workflow
1. Classify the decision: greenfield, adding a capability to an existing stack, or replacing an incumbent. Only the first one starts from the defaults table.
2. State the constraints that can overrule a default: platform, hosting, team skill, contracts, compliance, license, and libraries that pin a runtime.
3. Pick from the defaults table. Name the chosen option, the constraint it satisfies, and the one alternative that was close.
4. Verify before committing: the package exists, is maintained (release cadence, bus factor, open CVEs), its license is compatible, and its current major supports the runtime and the other picks. Read the target major's release notes; never adopt from memory.
5. Record the decision where the project keeps them (ADR, README, or `AGENTS.md`) with the tradeoff and the condition that would reverse it — see [decision records](references/decision-records.md) for the structure.
6. For a replacement, size the migration first: blast radius, coexistence path, rollback. Strangle incrementally; a rewrite needs an explicit decision.

## Defaults

| Decision | Default | Close alternative and when it wins |
|---|---|---|
| JS/TS language | TypeScript, `strict` | Plain JS only for a throwaway script |
| JS runtime | Bun | Node LTS when a required dependency or host does not support Bun |
| JS package manager | pnpm | Bun's own installer inside a Bun-only project |
| Python | uv for env and deps | Existing poetry/pip repos stay until a deliberate migration |
| HTTP API (TS) | NestJS | Hono or Fastify for a small edge or single-purpose service |
| Edge or serverless function | Hono | The platform's own handler when there is a single route |
| API documentation | Scalar over an OpenAPI document | Swagger UI only where it is already embedded and pinned |
| Lint and format (TS) | Biome | ESLint when a required plugin has no Biome equivalent |
| Lint and format (Python) | Ruff | — |
| Test runner | Vitest (TS), pytest (Python) | Jest only in a repo already standardized on it |
| End-to-end | Playwright | — |
| Validation | Zod (TS), Pydantic (Python) | — |
| Typed contract | OpenAPI with a generated client | tRPC when producer and consumer live in one repo |
| HTTP client | Native `fetch` with explicit timeout and backoff | Axios only where a repo is already standardized on it |
| Environment config | Parsed and validated at boot, fail fast | — |
| Secrets | The host's secrets manager | `.env` local only, never committed |
| ORM | Sequelize | Raw SQL for analytical or hot-path queries |
| Relational database | PostgreSQL | SQLite for local, embedded, or single-writer |
| Cache, queue, rate limit | Redis | Postgres-backed queue when Redis is not worth operating |
| Background jobs | BullMQ on Redis | pg-boss when Redis is not already running |
| Migrations | Versioned and reversible (Umzug, Alembic) | Never schema autosync outside local development |
| Money, time, identifiers | Integer cents with `numeric`, UTC with the zone at the edge, UUIDv7 | ULID when a short readable id is required |
| Object storage | S3-compatible with pre-signed URLs | — |
| Vector search | pgvector | A dedicated vector store above roughly ten million vectors |
| LLM integration | AI SDK | The provider SDK directly when a feature has no AI SDK surface |
| Multi-provider or self-hosted models | LiteLLM as the gateway | Direct provider calls for a single provider with no routing need |
| Retrieval | pgvector with hybrid search and reranking | A dedicated store past roughly ten million vectors |
| Desktop app | Tauri | Electron when a required native Chromium integration blocks Tauri |
| Mobile | React Native with Expo | Native when a platform API or performance budget demands it |
| Web app | React with Vite | Next.js when SSR, routing, or ISR is a requirement, not a habit |
| Styling and components | Tailwind with shadcn/ui on Radix | — |
| Server state, forms | TanStack Query, React Hook Form with Zod | — |
| Monorepo | pnpm workspaces with Turborepo | A single package until a second consumer exists |
| CI | GitHub Actions | The platform's own CI when the repo lives there |
| Containers | Multi-stage Docker, minimal base pinned by digest | — |
| Kubernetes | k3s for self-hosted, edge, and on-prem | A managed control plane when the cloud already runs one |
| Deployment | Argo CD, git as the desired state | The platform's own deploy for a single managed service |
| Release | Conventional commits with Changesets | semantic-release for a library publishing continuously |
| Feature rollout | Flag with a kill switch, decoupled from deploy | — |
| Telemetry | OpenTelemetry with structured JSON logs, PII redacted | — |
| Error tracking | Sentry or an OpenTelemetry-compatible equivalent | — |
| Auth | A managed OIDC provider | Never a hand-rolled session and password stack |

Open [stack rationale](references/stack-rationale.md) for why each default holds and what evidence reverses it.

## Stop
- The constraint that decides the pick is unknown (host, platform, compliance, team): ask instead of guessing.
- A default conflicts with the repository's established stack and no one authorized a migration.
- The candidate is unmaintained, incompatible with the chosen runtime, or its license is unacceptable (unresolved license or CVE blocks adoption; it does not get checked later).

## Rules
- Defaults are the starting point, not a mandate. A stated constraint beats the table; a preference does not beat a working incumbent.
- Spend the team's "innovation tokens" (Dan McKinley's "Choose Boring Technology") on what differentiates the product; default to the boring, well-understood option everywhere else.
- One new dependency per problem, and only when the platform or standard library cannot do it.
- Never mix package managers or lockfiles in one workspace.
- Pin the runtime and the package manager in the manifest so CI and laptops agree.
- Verify current APIs against the target version's changelog before writing code.
- `starting-dev` owns planning and repository scaffolding; `backend-systems`, `frontend-engineering`, and `data-engineering` own the implementation once the pick is made.

## Excuses

| Excuse | Why it is false |
|---|---|
| The team knows Express, keep it | Familiarity is a real constraint; state it as one, not as the better tool |
| Next.js for everything | SSR nothing needs buys a server, a cache, and a hydration bug budget |
| Migrate the linter later | Two formatters in one repo churn every diff |
| Mongo is faster to start | Relational data without constraints becomes hand-written migrations |

## Checklist
- [ ] Existing stack inspected; decision classified as greenfield, addition, or replacement.
- [ ] Constraints stated; chosen option and rejected alternative named.
- [ ] Candidate verified as maintained and compatible with the runtime and the other picks.
- [ ] Decision recorded with its reversal condition.
- [ ] Migration path and rollback defined when replacing an incumbent.
