
# Backend Node.js

## Contents

- Preflight
- Workflow
- ESM vs CJS — Settle This First
- Shutdown That Does Not Drop Requests
- Fire-and-Forget Loses Errors
- Cancellation Propagation
- Reference Routing
- Stop
- Rules
- Checklist

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

## Fire-and-Forget Loses Errors

Calling an async function without `await` and without handling its result does not skip the
error — it sends it to `unhandledRejection`, disconnected from the request that triggered it, with
no correlation id and often no log at all if the handler was never wired up.

```ts
// wrong: the caller moves on immediately; a rejection here has no path back to this request
sendWelcomeEmail(user.id);

// right: still non-blocking for the response, but the failure is owned
void sendWelcomeEmail(user.id).catch(err =>
  logger.error({ err, userId: user.id }, 'welcome email failed'),
);
```

The `void` operator documents the fire-and-forget as deliberate; the `.catch` is what actually
makes it safe. A background task queue (BullMQ, pg-boss) is the better answer once retries,
backoff, or delivery guarantees matter — see
[resilience-patterns.md](resilience-patterns.md) for the idempotency that then requires on retry.

## Cancellation Propagation

A client that disconnects or times out should stop the work it triggered, not leave it running to
completion against a response nobody reads. Thread an `AbortSignal` from the inbound request down
through every downstream call that accepts one.

```ts
app.get('/report', async (req, res) => {
  const controller = new AbortController();
  req.on('close', () => controller.abort());          // client gone: stop downstream work
  const data = await fetch(upstreamUrl, { signal: controller.signal });
  res.json(await data.json());
});
```

An `AbortSignal` not wired to `fetch`, the database driver, or a long-running loop is decoration —
the request keeps consuming a connection and CPU time for a caller that already left.

## Reference Routing
- Multi-topic tasks: start at the [topic map](TOPIC_MAP.md).
- Real service/API cases: [backend-node-real-world-cases.md](backend-node-real-world-cases.md)
- Node/npm/pnpm environment, runtime, and toolchain setup: `package-management`
- NestJS structure: [nestjs-best-practices.md](nestjs-best-practices.md)
- TypeScript safety: [ts-safety.md](ts-safety.md), [ts-patterns.md](ts-patterns.md)
- Tests and troubleshooting: [ts-testing.md](ts-testing.md), [ts-troubleshooting.md](ts-troubleshooting.md)

## Stop
- The build red on `strict`, or a new `any` at a boundary. Narrow `unknown` instead; one `any` erases every type downstream.
- A blocking call sits on a request path. Move it off before shipping — the symptom is latency everywhere, traced to nothing.
- The lockfile changed without a dependency change. Revert it; a drifting lockfile makes CI unreproducible.

## Rules
- Keep `strict` on. Narrow `unknown` instead of reaching for `any`; one `any` at a boundary erases the types of everything downstream of it.
- Use frozen lockfiles in CI (`pnpm install --frozen-lockfile`, `npm ci`) and never rewrite a lockfile without a dependency change.
- In NestJS, keep controllers thin, validate DTOs before the service runs, and register a global validation pipe that whitelists DTO fields and rejects unknown ones — without `forbidNonWhitelisted`, extra fields pass through silently.
- Generate OpenAPI from the implemented contract, not by hand, and test breaking changes against it. Contract shape belongs to [api-design](api-design.md). Go, Rust, and .NET services belong to `backend-systems`.
- Migrating to a stricter package manager breaks imports that only worked through hoisting — phantom dependencies. Declare them explicitly before the migration, not after the build fails.
- Never block the event loop: synchronous crypto, large `JSON.parse`, and `fs.readFileSync` on a request path stall every other request. Measure with `performance-engineering` before assuming which one it is.
- Unhandled promise rejections terminate the process by default in modern Node. Attach a handler that logs and exits deliberately rather than letting the default kill a request mid-flight.

## Checklist
- [ ] Package manager, module system, and `strict` setting read before writing code.
- [ ] Input validated at the boundary; errors typed and mapped in one place.
- [ ] No `any` introduced; `unknown` narrowed instead.
- [ ] Graceful shutdown drains in-flight work and closes pools.
- [ ] The repository's own lint, typecheck, test, build, and smoke pass.
