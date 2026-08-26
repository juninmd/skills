---
name: backend-node
description: |
  Build and maintain Node.js and TypeScript backends. Use for NestJS modules and dependency injection, pnpm workspaces, strict TypeScript, REST or GraphQL APIs, DTO validation, tests, builds, and API contracts.
---

# Backend Node.js

## Preflight
Read the repository before writing for it. These four answers change every decision that follows.

```bash
cat package.json | jq '{type, packageManager, scripts, engines}'
ls pnpm-lock.yaml package-lock.json yarn.lock 2>/dev/null   # which manager owns this
cat tsconfig.json | jq '.compilerOptions | {strict, module, moduleResolution}'
ls pnpm-workspace.yaml turbo.json nx.json 2>/dev/null       # monorepo?
```

## Workflow
1. Preserve what is there — package manager, module system, architecture. Do not migrate tooling unless asked; a tooling migration is its own change with its own review.
2. Validate external input at the boundary, keep domain logic framework-light, and return typed errors that map to status codes in one place.
3. Cover success, invalid input, dependency failure, timeout, and authorization paths; delegate the case matrix to `test-engineering`.
4. Run the narrowest existing lint, typecheck, test, build, and service smoke — the ones already in `scripts`, not ones you invent.

## ESM vs CJS — Settle This First
Getting it wrong produces errors that read like everything else.

| Symptom | Cause |
|---|---|
| `ERR_REQUIRE_ESM` | CJS `require()` of an ESM-only package |
| `Cannot use import statement outside a module` | ESM syntax in a CJS context |
| `ERR_MODULE_NOT_FOUND` on a relative import | TypeScript ESM needs the `.js` extension in source |
| `__dirname is not defined` | ESM has no `__dirname`; use `import.meta.url` |

`"type": "module"` flips the entire package. Built-ins take the `node:` prefix. Never mix the two systems inside one package.

## Shutdown That Does Not Drop Requests
A container gets `SIGTERM`, then a grace period, then `SIGKILL`. Exiting immediately drops in-flight requests; ignoring the signal gets the process killed mid-write.

```ts
process.on('SIGTERM', async () => {
  server.close();                  // stop accepting new connections
  await inFlight.drain();          // finish what is running
  await Promise.all([db.end(), broker.close()]);
  process.exit(0);
});
```

Keep liveness and readiness separate: readiness must fail **first** so the load balancer stops routing before the process stops answering.

## Reference Routing
- Multi-topic tasks: start at the [topic map](references/TOPIC_MAP.md).
- Real service/API cases: [real-world-cases.md](references/real-world-cases.md)
- Environment and runtime: [node-setup.md](references/node-setup.md), [node-operations.md](references/node-operations.md)
- pnpm CLI, workspaces, catalogs, overrides: [pnpm-features.md](references/pnpm-features.md)
- pnpm policy, CI, Docker, migration: [pnpm-standards.md](references/pnpm-standards.md)
- pnpm detail: read the `core-*`, `features-*`, and `best-practices-*` references only for pnpm-specific work — see the topic map
- NestJS structure: [nestjs-best-practices.md](references/nestjs-best-practices.md)
- TypeScript safety: [ts-safety.md](references/ts-safety.md), [ts-patterns.md](references/ts-patterns.md)
- Tests and troubleshooting: [ts-testing.md](references/ts-testing.md), [ts-troubleshooting.md](references/ts-troubleshooting.md)

## Stop
- The build red on `strict`, or a new `any` at a boundary. Narrow `unknown` instead; one `any` erases every type downstream.
- A blocking call sits on a request path. Move it off before shipping — the symptom is latency everywhere, traced to nothing.
- The lockfile changed without a dependency change. Revert it; a drifting lockfile makes CI unreproducible.

## Rules
- Keep `strict` on. Narrow `unknown` instead of reaching for `any`; one `any` at a boundary erases the types of everything downstream of it.
- Use frozen lockfiles in CI (`pnpm install --frozen-lockfile`, `npm ci`) and never rewrite a lockfile without a dependency change.
- In NestJS, keep controllers thin, validate DTOs before the service runs, and register a global validation pipe that whitelists DTO fields and rejects unknown ones — without `forbidNonWhitelisted`, extra fields pass through silently.
- Generate OpenAPI from the implemented contract, not by hand, and test breaking changes against it. Contract shape belongs to `api-design`.
- Migrating to a stricter package manager breaks imports that only worked through hoisting — phantom dependencies. Declare them explicitly before the migration, not after the build fails.
- Never block the event loop: synchronous crypto, large `JSON.parse`, and `fs.readFileSync` on a request path stall every other request. Measure with `performance-engineering` before assuming which one it is.
- Unhandled promise rejections terminate the process by default in modern Node. Attach a handler that logs and exits deliberately rather than letting the default kill a request mid-flight.

## Checklist
- [ ] Package manager, module system, and `strict` setting read before writing code.
- [ ] Input validated at the boundary; errors typed and mapped in one place.
- [ ] No `any` introduced; `unknown` narrowed instead.
- [ ] Graceful shutdown drains in-flight work and closes pools.
- [ ] The repository's own lint, typecheck, test, build, and smoke pass.
