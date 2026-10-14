# Backend Node.js Real-World Cases

Use this first for practical service changes, API bugs, and production-facing backend work.

## Endpoint or Resolver Change
- Read the route/resolver, DTO/schema, service, repository/client, auth guard, and tests before editing.
- Validate all external input at the boundary; keep domain logic independent from transport objects.
- Return typed domain errors and map them to HTTP/GraphQL errors at the edge.
- Test success, invalid input, unauthorized/forbidden, not found, dependency failure, and timeout.

## NestJS Service
- Keep controllers thin: parse, authorize, call service, map response.
- Keep providers explicit; avoid hidden module-level mutable state.
- Use request-scoped providers only when necessary; prefer stateless services.
- Test services without booting the whole app unless module wiring is the behavior under test.

## pnpm Workspace
- Use the repo package manager and lockfile policy.
- Scope commands to the touched package first, then run the relevant aggregate gate.
- Do not rewrite the lockfile unless dependencies changed.
- For package exports, verify both TypeScript compile and runtime import shape.

## External Integration
- Add timeouts, retries only for idempotent operations, and cancellation propagation.
- Redact tokens, cookies, and authorization headers from logs and errors.
- Contract-test request/response shape when the integration is user-facing or brittle.
