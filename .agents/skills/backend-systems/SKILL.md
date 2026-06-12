---
name: backend-systems
description: |
  Implement compiled backend services and libraries in Go, Rust, or .NET. Use for APIs, concurrency, cancellation, error handling, EF Core, resource lifetimes, performance-sensitive code, tests, and builds.
---

# Backend Systems

## Workflow
1. Detect the language, toolchain version, module/workspace layout, and repository quality commands.
2. Follow the language's ownership, error, and concurrency idioms; avoid cross-language pattern transfer.
3. Define cancellation, timeout, resource lifetime, and partial-failure behavior at I/O boundaries.
4. Add focused unit/integration tests, then run formatter, linter, tests, and build.
5. Benchmark only when performance is a requirement; compare before and after under the same workload.

## Reference Routing
- Go: [go-best-practices.md](references/go-best-practices.md)
- Rust: [rust-best-practices.md](references/rust-best-practices.md)
- .NET architecture and async: [dotnet-architecture.md](references/dotnet-architecture.md), [dotnet-async.md](references/dotnet-async.md)
- EF Core and tests: [dotnet-efcore.md](references/dotnet-efcore.md), [dotnet-testing.md](references/dotnet-testing.md)
- .NET examples: [dotnet-examples.md](references/dotnet-examples.md)

## Rules
- Go: wrap errors with context and propagate `context.Context`.
- Rust: avoid `unsafe`; justify and test every unavoidable unsafe boundary.
- .NET: flow `CancellationToken`, avoid sync-over-async, and use scoped resource lifetimes.

## Checklist
- [ ] Errors, cancellation, and cleanup are explicit.
- [ ] Formatter, linter, tests, and build pass.
- [ ] Performance claims have repeatable evidence.
