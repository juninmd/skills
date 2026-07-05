---
name: backend-node
description: |
  Build and maintain Node.js and TypeScript backends. Use for NestJS services, pnpm workspaces, strict TypeScript, REST or GraphQL APIs, DTO validation, tests, builds, and API contracts.
---

# Backend Node.js

## Workflow
1. Inspect `package.json`, lockfile, workspace config, `tsconfig`, framework version, and existing scripts.
2. Preserve the repository package manager and architecture; do not migrate tooling unless requested.
3. Validate external input at the boundary, keep domain logic framework-light, and return typed errors.
4. Add focused tests for success, invalid input, dependency failure, timeout, and authorization boundaries.
5. Run the narrowest existing lint, typecheck, test, build, and service smoke commands.

## Reference Routing
- Start with the [topic map](references/TOPIC_MAP.md) when the task spans multiple Node.js or pnpm concerns.
- Real service/API cases: [real-world-cases.md](references/real-world-cases.md)
- Environment and runtime: [node-setup.md](references/node-setup.md), [node-operations.md](references/node-operations.md)
- pnpm workspaces and policy: [pnpm-standards.md](references/pnpm-standards.md), [pnpm-features.md](references/pnpm-features.md)
- NestJS structure: [nestjs-best-practices.md](references/nestjs-best-practices.md)
- TypeScript safety: [ts-safety.md](references/ts-safety.md), [ts-patterns.md](references/ts-patterns.md)
- Tests and troubleshooting: [ts-testing.md](references/ts-testing.md), [ts-troubleshooting.md](references/ts-troubleshooting.md)
- Read the detailed `core-*`, `features-*`, and `best-practices-*` references only for pnpm-specific work.

## Rules
- Keep `strict` typing; narrow `unknown` instead of introducing `any`.
- Use frozen lockfiles in CI and never rewrite a lockfile without a dependency change.
- In NestJS, keep controllers thin and validate DTOs before service execution.
- Generate OpenAPI from the implemented contract and test breaking changes.

## Checklist
- [ ] Repository conventions and strict types are preserved.
- [ ] Inputs, auth, errors, and failure paths are tested.
- [ ] Typecheck, tests, build, and smoke pass.
