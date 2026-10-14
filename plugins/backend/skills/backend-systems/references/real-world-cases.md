# Backend Systems Real-World Cases

Use this first for Go, Rust, and .NET service/library work.

## API or Worker Change
- Trace request/job lifecycle, cancellation, retries, resource ownership, and error mapping.
- Test success, invalid input, dependency failure, timeout/cancellation, and cleanup.
- Preserve language idioms instead of porting patterns from another stack.

## Concurrency Bug
- Reproduce with race detector, deterministic scheduler/tooling, or repeated stress when available.
- Identify shared state, lock ordering, channel/task lifetime, and cancellation path.
- Prefer simpler ownership over larger critical sections.
- Add regression proof that fails before the fix.

## Resource Lifetime
- Make ownership and disposal/drop/close points explicit.
- Check connection pools, file handles, goroutines/tasks, subscriptions, and cancellation tokens.
- Test early error, panic/exception path, and shutdown.

## Performance Work
- Establish baseline with representative inputs.
- Profile before optimizing.
- Keep algorithmic fixes ahead of micro-optimizations.
- Report before/after with the same tool, environment, and sample size.
