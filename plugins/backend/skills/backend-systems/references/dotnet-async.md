# .NET Async and Error Handling Guidelines

Best practices for asynchronous programming and resilient error management.

## 1. Async/Await Patterns
- **Naming:** All async methods MUST end with the `Async` suffix.
- **Cancellation:** Accept and propagate `CancellationToken` throughout the call chain.
- **Consistency:** Use `await` consistently; avoid fire-and-forget unless explicitly required for non-critical tasks.
- **Libraries:** Use `ConfigureAwait(false)` in library code to prevent deadlocks.
- **Efficiency:** Stream large payloads instead of loading them fully into memory.

## 2. Error Handling and Logging
Use structured error handling with custom exceptions:
- **Catch Blocks:** Differentiate between validation errors (Warning) and system failures (Error).
- **Logging:** Include context in logs and use appropriate levels (Info, Warning, Error, Critical).
- **Async Safety:** Ensure exceptions in async tasks are awaited or handled to prevent process crashes.

## 3. Pre-Commit Checklist
- [ ] Async/await used consistently.
- [ ] Cancellation tokens propagated.
- [ ] Error handling is comprehensive.
- [ ] Logging includes sufficient context.
