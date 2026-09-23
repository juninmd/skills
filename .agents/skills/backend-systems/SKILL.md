---
name: backend-systems
description: |
  Implement backend services, APIs, and caching with Bun, Node.js, Rust, and Python. Use for NestJS modules, dependency injection, DTO validation, FastAPI, REST/GraphQL OpenAPI contracts, endpoints, controllers, async concurrency, cache invalidation, and backend builds; maintain existing Go and .NET services too.
---

# Backend Systems

**Not this skill:** choosing the framework or ORM first (`stack-selection`), query plans and schema design (`data-engineering`), module boundaries (`software-architecture`), or pnpm/uv/Ruff/Dependabot toolchain management (`package-management`).

## Preflight

```bash
rg --files -g package.json -g bun.lock -g bun.lockb -g bunfig.toml -g '*lock*' -g Cargo.toml -g rust-toolchain.toml -g pyproject.toml -g go.mod -g '*.csproj' -g '*test*' -g '*ci*'
```

Read manifests, lockfiles, scripts and CI before choosing commands. For new unconstrained services prefer **Bun > Node.js > Rust > Python**. Existing deployment/runtime requirements win; a Bun lockfile alone does not prove the application runs on Bun. Check only the detected toolchain's version and compatibility, especially native addons and Node APIs under Bun.

## Workflow

1. Establish runtime, framework, package manager, supported versions and executable quality gates. Preserve existing Go/.NET projects; do not migrate them incidentally.
2. Define request/response schemas, authentication and authorization boundaries, error mapping, pagination and idempotency where retries can duplicate writes. Read [API design](references/api-design.md) for contract changes.
3. Implement the vertical slice using the selected stack's reference below. Keep blocking work out of async handlers; define cancellation, deadlines and resource cleanup for affected I/O.
4. For caching, establish source of truth, key scope (including tenant), invalidation and failure behavior using [caching strategy](references/caching-strategy.md).
5. Exercise a real request plus relevant malformed input, authorization, timeout and duplicate-request paths against isolated dependencies. Run the repository's checks for this stack.
6. Report runtime and command evidence, including anything unverified. Hand delivery to `finishing-dev`; use `performance-engineering` for measured bottlenecks.

## Stack Decisions and Gates

Commands below are templates: use existing script names, environment and package manager. Do not install unrelated toolchains or silently skip a required missing gate.

| Detected stack | Gates | Operational trap |
|---|---|---|
| Bun / TypeScript | `bun --version`; `bun run typecheck`; `bun run lint`; `bun run test`; `bun run build` | Running TypeScript does not typecheck it; verify deployment under Bun and native addon compatibility |
| Node.js / TypeScript | `node --version`; `pnpm run typecheck`; `pnpm run lint`; `pnpm run test`; `pnpm run build` | Use npm/yarn instead when its lockfile owns the project; package manager is separate from runtime |
| Rust | `cargo fmt --check`; `cargo clippy --all-targets -- -D warnings`; `cargo test`; `cargo build --locked` | Blocking work and a held lock across await can exhaust async workers |
| Python / uv | `uv run ruff check .`; `uv run ruff format --check .`; `uv run pytest`; configured mypy/pyright command | Sync SDK calls block an async endpoint; reuse and close clients with application lifetime |
| Existing Go | `gofmt -l .`; `go vet ./...`; `go test -race ./...`; `go build ./...` | Nonempty gofmt output fails acceptance even with exit 0; every goroutine needs an exit path |
| Existing .NET | `dotnet format --verify-no-changes`; `dotnet build -warnaserror`; `dotnet test` | Propagate CancellationToken; never capture scoped dependencies in singletons |

## Reference Routing

- Bun and Node implementation: [backend-node.md](references/backend-node.md); inspect Bun's [Node compatibility](https://bun.sh/docs/runtime/nodejs-compat) before assuming parity. Use [NestJS](references/nestjs-best-practices.md) only for that framework.
- Rust ownership, errors and async: [rust-best-practices.md](references/rust-best-practices.md).
- Python services: [backend-python.md](references/backend-python.md); [FastAPI](references/fastapi-best-practices.md) for Pydantic and dependency lifetimes.
- Existing Go: [go-best-practices.md](references/go-best-practices.md). Existing .NET: [architecture](references/dotnet-architecture.md), [async](references/dotnet-async.md), [EF Core](references/dotnet-efcore.md).
- Circuit breakers, bulkheads, and at-least-once delivery with dedup for service-to-service calls: [resilience-patterns.md](references/resilience-patterns.md).
- pnpm, uv, Ruff, prek, Dependabot and other toolchain/package-manager work: `package-management`.
- Language troubleshooting and other topics not covered above: [Reference Map](references/TOPIC_MAP.md).

## Stop

- Required checks fail, dependencies cannot be isolated, or the target runtime cannot execute the service: report the blocker before claiming completion.
- A change needs live database mutation or deployment outside existing authorization: prepare and validate the change before requesting that action.
- A retry can duplicate a side effect, tenant data crosses a cache key, or owned background work has no shutdown path: repair the contract.

## Rules

- Hand schemas and migrations to `data-engineering`, deployment to `cloud-devops`, architecture to `software-architecture`, and focused security assessment to `security-ops`.
- Public responses must not leak dependency errors or credentials; preserve error causes internally for diagnosis.
- Avoid unbounded concurrency and per-request client pools. Bound work using measured capacity and the downstream limit.
- Bun is the first greenfield option, not permission to replace an established runtime, lockfile or test runner.

## Checklist

- [ ] Runtime, package manager and quality gates match manifests and deployment.
- [ ] Contract, failure and resource lifetime behavior implemented and tested.
- [ ] Applicable formatting, lint, typecheck, tests and build pass.
- [ ] Real request evidence recorded; performance claims measured.
