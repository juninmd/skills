# backend-systems Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `api-design.md` | Designing a new endpoint or contract, or deciding whether a change is breaking and needs versioning |
| `backend-node-real-world-cases.md` | Fixing a Node.js/NestJS endpoint, resolver, or pnpm-workspace bug — check the applicable case checklist first |
| `backend-node.md` | Starting Node.js backend work — repo preflight, ESM/CJS error symptoms, or graceful SIGTERM shutdown |
| `backend-python-real-world-cases.md` | Fixing a FastAPI endpoint, async/I/O bug, or Ruff/type-checker migration — check the applicable case checklist first |
| `backend-python.md` | Starting Python backend work — repo preflight, or diagnosing a blocking call stalling every concurrent FastAPI request |
| `caching-strategy.md` | Choosing a cache layer, TTL, or invalidation mechanism, or debugging stale/incorrect cached data |
| `fastapi-best-practices.md` | Structuring a FastAPI project or handling a Pydantic v2 validation edge case (scale, not just shape) |
| `nestjs-best-practices.md` | Structuring a NestJS module or hardening DTO validation against mass-assignment or overflow edge cases |
| `python-operations.md` | Running Python quality gates (ruff, type checker, pytest coverage) or writing an async pytest-asyncio test |
| `resilience-patterns.md` | Circuit breakers, bulkheads, and at-least-once delivery with idempotent-consumer dedup |
| `testing.md` | Configuring pytest — coverage thresholds, markers, or testpaths for a Python project |
| `ts-patterns.md` | Writing advanced TypeScript type-level logic — conditional/mapped/template-literal types, generics, or overloads |
| `ts-quality.md` | Wiring TypeScript CI quality gates — Biome, tsc --noEmit, or SWC-based transpilation speedups |
| `ts-safety.md` | Hardening tsconfig strictness or removing `any` — mandatory compiler flags and type-guard patterns |
| `ts-testing.md` | Writing or reviewing Vitest tests for TypeScript logic — AAA structure and edge/error-path coverage |
| `ts-troubleshooting.md` | Debugging slow tsc, a stalled strict-mode migration, or choosing a runtime-validation pattern (Zod, discriminated unions) |

pnpm, uv, Ruff, prek, and Dependabot topics moved to `package-management`'s reference map.
