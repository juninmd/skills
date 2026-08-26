---
name: backend-systems
description: |
  Implement compiled backend services and libraries in Go, Rust, or .NET. Use for APIs, concurrency, cancellation, error handling, EF Core, resource lifetimes, performance-sensitive code, tests, and builds.
---

# Backend Systems

## Preflight
```bash
go version && go env GOFLAGS || true
cargo --version && cat rust-toolchain.toml 2>/dev/null
dotnet --info | head -5
ls go.mod Cargo.toml *.sln *.csproj 2>/dev/null   # which toolchain owns this
```

Read the toolchain version before writing for it. Language idioms do not transfer, and neither do the flags.

## Workflow
1. Detect the language, toolchain version, module or workspace layout, and the repository's own quality commands.
2. Follow that language's ownership, error, and concurrency idioms. Cross-language pattern transfer is the most reliable way to write code that compiles and is wrong.
3. Define cancellation, timeout, resource lifetime, and partial-failure behavior **at every I/O boundary**, before the happy path.
4. Add focused unit and integration tests, then run the language gates.
5. Benchmark only when performance is a requirement; delegate method and workload design to `performance-engineering`.

## Language Gates
Run all of them. Each catches a class the others do not.

```bash
# Go
gofmt -l . && golangci-lint run && go test -race ./... && go vet ./...

# Rust
cargo fmt --check && cargo clippy --all-targets -- -D warnings && cargo test

# .NET
dotnet format --verify-no-changes && dotnet build -warnaserror && dotnet test
```

`go test -race` is not optional on anything concurrent. It catches the data race that a passing test hides, and that race will otherwise be found in production, intermittently, by a customer.

## Concurrency Contracts

| Language | Every concurrent unit needs | Failure if missing |
|---|---|---|
| Go | a termination path — `errgroup`, `context`, or a closed channel | goroutine leak; memory grows until OOM |
| Go | `defer close(ch)` in the **only** sender | send on closed channel, or a reader blocked forever |
| Rust | ownership handoff via channel, or `Send + Sync` on shared state | it does not compile — which is the point |
| .NET | `CancellationToken` flowed to every await | work continues after the request is gone |
| .NET | no sync-over-async (`.Result`, `.Wait()`) | thread-pool starvation, then deadlock |

## Errors at the Library Edge

```go
// Go: wrap with context, keep the chain inspectable
if err != nil {
    return fmt.Errorf("fetch order %s: %w", id, err)   // %w, never %v
}
```

```rust
// Rust: one typed enum at the edge; callers never see a dependency's error type
#[derive(thiserror::Error, Debug)]
pub enum StoreError {
    #[error("order {0} not found")] NotFound(String),
    #[error(transparent)] Backend(#[from] sqlx::Error),
}
```

Leaking a dependency's error type across your public API makes that dependency permanent — you cannot swap it without a breaking change.

## Reference Routing
- Practical systems cases: [real-world-cases.md](references/real-world-cases.md)
- Go: [go-best-practices.md](references/go-best-practices.md)
- Rust: [rust-best-practices.md](references/rust-best-practices.md)
- .NET architecture and async: [dotnet-architecture.md](references/dotnet-architecture.md), [dotnet-async.md](references/dotnet-async.md)
- EF Core and tests: [dotnet-efcore.md](references/dotnet-efcore.md), [dotnet-testing.md](references/dotnet-testing.md)
- .NET examples: [dotnet-examples.md](references/dotnet-examples.md)

## Stop
- `go test -race` fails, or was not run on concurrent code. It is not optional; the race will be found in production instead.
- A goroutine has no termination path, or a `CancellationToken` is not flowed. Fix before shipping — both leak silently.
- A dependency error type crosses the public API. Convert it at the edge, or that dependency becomes permanent.

## Rules
- Go: propagate `context.Context` to every I/O call, as the first parameter, always. A function that cannot be cancelled is a function that will hang a request.
- Go: never start a goroutine whose exit nobody waits on.
- Rust: avoid `unsafe`; justify and test every unavoidable unsafe boundary, and keep it as small as the invariant requires.
- Rust: prefer a channel over a shared `Mutex` for ownership handoff; reach for a lock only for genuinely shared state.
- .NET: use scoped resource lifetimes, and never resolve a scoped service from a singleton — the captured dependency outlives its scope and holds a dead connection.
- EF Core: a lazy-loaded navigation inside a loop is an N+1 that only appears with real data. Project explicitly or `Include` deliberately.
- HTTP contract shape belongs to `api-design`; database operation to `data-engineering`; delivery to `finishing-dev`.

## Checklist
- [ ] Toolchain version and repository commands detected before writing.
- [ ] Cancellation, timeout, and resource lifetime defined at every I/O boundary.
- [ ] Errors typed at the library edge; no dependency error type leaks across the API.
- [ ] Every concurrent unit has a termination path.
- [ ] Formatter, linter, tests (with `-race` where it applies), and build all pass.
- [ ] Performance claims backed by repeatable measurement, not by reading the code.
