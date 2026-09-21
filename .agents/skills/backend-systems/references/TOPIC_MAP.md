# backend-systems Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `GENERATION.md` | Verifying the vendored pnpm docs' source commit and generation date before trusting or re-vendoring them |
| `api-design.md` | Designing a new endpoint or contract, or deciding whether a change is breaking and needs versioning |
| `backend-node-real-world-cases.md` | Fixing a Node.js/NestJS endpoint, resolver, or pnpm-workspace bug — check the applicable case checklist first |
| `backend-node.md` | Starting Node.js backend work — repo preflight, ESM/CJS error symptoms, or graceful SIGTERM shutdown |
| `backend-python-real-world-cases.md` | Fixing a FastAPI endpoint, async/I/O bug, or Ruff/type-checker migration — check the applicable case checklist first |
| `backend-python.md` | Starting Python backend work — repo preflight, or diagnosing a blocking call stalling every concurrent FastAPI request |
| `best-practices-ci.md` | Wiring or speeding up pnpm in GitHub Actions CI (store caching, install steps) |
| `best-practices-migration.md` | Migrating an existing npm or Yarn project to pnpm |
| `best-practices-performance.md` | Slow pnpm installs — tuning frozen-lockfile, offline mode, or optional-dependency skipping |
| `caching-strategy.md` | Choosing a cache layer, TTL, or invalidation mechanism, or debugging stale/incorrect cached data |
| `core-cli.md` | Looking up a pnpm CLI command or flag (install, add, run, dlx, why, audit) |
| `core-config.md` | Configuring pnpm-workspace.yaml or .npmrc settings |
| `core-store.md` | Understanding or debugging pnpm's content-addressable store and hard-link layout |
| `core-workspaces.md` | Setting up a pnpm monorepo or referencing local packages with the workspace: protocol |
| `dependabot.md` | Adding or tuning automated dependency-update PRs — schedule, cooldown, grouping |
| `dotnet-architecture.md` | Structuring a new .NET service or reviewing its layering, DI, and SOLID compliance |
| `dotnet-async.md` | Reviewing .NET async code — Async naming, CancellationToken propagation, ConfigureAwait, or error-handling gaps |
| `dotnet-efcore.md` | Working with EF Core — migrations, N+1 query prevention, AsNoTracking, or indexing decisions |
| `dotnet-examples.md` | Need a concrete .NET code sample (async service, unit test, DI registration) to copy from |
| `dotnet-testing.md` | Setting up .NET tests with xUnit — test pyramid, mocking, or coverage commands |
| `fastapi-best-practices.md` | Structuring a FastAPI project or handling a Pydantic v2 validation edge case (scale, not just shape) |
| `features-aliases.md` | Installing a package under an alias or running two versions of the same package via pnpm's npm: protocol |
| `features-catalogs.md` | Centralizing shared dependency versions across a pnpm workspace with catalogs |
| `features-hooks.md` | Customizing pnpm's package resolution or lockfile via a .pnpmfile.cjs hook |
| `features-overrides.md` | Forcing a specific transitive dependency version in pnpm to fix a vulnerability or conflict |
| `features-patches.md` | Patching a third-party npm package's source directly with pnpm patch |
| `features-peer-deps.md` | Debugging pnpm peer-dependency auto-install or strict-mode resolution errors |
| `go-best-practices.md` | Starting or reviewing a Go service — project layout, error wrapping, concurrency, or lint gates |
| `migration-checklist.md` | Migrating a Python project off pip/requirements.txt or setup.py onto uv |
| `modern-python-patterns.md` | Checking whether a Python pattern is legacy (pip, manual venv, requirements.txt) versus the current uv/ruff/ty stack |
| `nestjs-best-practices.md` | Structuring a NestJS module or hardening DTO validation against mass-assignment or overflow edge cases |
| `node-operations.md` | Troubleshooting Node installs (EACCES, phantom deps, proxy certs) or migrating npm to pnpm |
| `node-setup.md` | Choosing or preserving the Node runtime, package manager, and monorepo tooling for a project |
| `pep723-scripts.md` | Deciding between a PEP 723 inline-metadata script and a full pyproject.toml project for a one-off script |
| `pnpm-features.md` | Need the consolidated pnpm CLI, workspace, config, store, and dependency-features reference in one place |
| `pnpm-standards.md` | Enforcing pnpm governance — lockfile commit policy, frozen-lockfile CI, audits, or strict mode |
| `prek.md` | Choosing or migrating to prek instead of Python pre-commit for faster hook execution |
| `pyproject.md` | Looking up pyproject.toml field syntax — project metadata, dependencies, or tool configuration |
| `python-operations.md` | Running Python quality gates (ruff, type checker, pytest coverage) or writing an async pytest-asyncio test |
| `python-setup.md` | Initializing a new Python project or configuring pyproject.toml/uv environment settings |
| `real-world-cases.md` | Fixing a Go, Rust, or .NET service bug — concurrency race, resource-lifetime leak, or performance regression |
| `resilience-patterns.md` | Circuit breakers, bulkheads, and at-least-once delivery with idempotent-consumer dedup |
| `ruff-config.md` | Configuring Ruff's lint select/ignore rules, line length, or formatter settings in pyproject.toml |
| `rust-best-practices.md` | Starting or reviewing Rust code — ownership/borrowing, Result-based error handling, or clippy/cargo gates |
| `security-setup.md` | Installing or wiring security tooling (prek, secret scanners, actionlint, shellcheck) into a repo's pre-commit/CI |
| `testing.md` | Configuring pytest — coverage thresholds, markers, or testpaths for a Python project |
| `ts-patterns.md` | Writing advanced TypeScript type-level logic — conditional/mapped/template-literal types, generics, or overloads |
| `ts-quality.md` | Wiring TypeScript CI quality gates — Biome, tsc --noEmit, or SWC-based transpilation speedups |
| `ts-safety.md` | Hardening tsconfig strictness or removing `any` — mandatory compiler flags and type-guard patterns |
| `ts-testing.md` | Writing or reviewing Vitest tests for TypeScript logic — AAA structure and edge/error-path coverage |
| `ts-troubleshooting.md` | Debugging slow tsc, a stalled strict-mode migration, or choosing a runtime-validation pattern (Zod, discriminated unions) |
| `uv-commands.md` | Looking up a uv CLI command (init, add, sync, run, build) or installation method |
