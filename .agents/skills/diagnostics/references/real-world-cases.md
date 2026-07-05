# Diagnostics Real-World Cases

Use this first for common failures that need fast isolation without guesswork.

## UI or Runtime Bug
- Start from the exact user-visible text, stack trace, URL, input, and timestamp.
- Reproduce once in the narrowest path; capture console/network errors without dumping secrets.
- Trace component, API, storage, and permission boundaries until the first wrong observable value.
- Fix root cause, then rerun the original path and one adjacent unhappy path.

## Test Failure
- Run the single failing test with verbose output.
- Check recent code, fixture, clock, environment, dependency, and order changes.
- If flaky, repeat enough times to prove rate before and after.
- Prefer deterministic setup over retries.

## Timeout or Performance Regression
- Determine whether the wait is CPU, I/O, lock, network, dependency startup, or polling.
- Add timing at boundaries before optimizing internals.
- Compare last known good inputs and versions.
- Prove the fix with before/after timings from the same command.

## Network or TLS
- Check DNS, route/port, TLS certificate, HTTP status, headers, and application body in that order.
- Test from the same runtime environment as the failure when possible.
- Separate connectivity, authentication, authorization, and application errors.
