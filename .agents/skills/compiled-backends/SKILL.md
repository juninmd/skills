---
name: compiled-backends
description: |
  Build and maintain Go, Rust, and .NET backend services. Use for ownership and borrowing, Result errors, clippy, goroutine leaks and data races, gofmt and go vet, ASP.NET, EF Core, CancellationToken, xUnit. Trigger on 'fix this Rust borrow error', 'goroutine leak', 'the .NET service deadlocks', 'audit this Go service'. Not Node, Bun, or Python (backend-systems).
---

# Compiled Backends

Go, Rust, and .NET services share one failure shape: resources and concurrency that the compiler or runtime will not police for you. Gates first, then the language reference.

**Not this skill:** Bun, Node.js, and Python services or API contracts (`backend-systems`), schema and query plans (`data-engineering`), module boundaries (`software-architecture`), choosing the language (`stack-selection`), measured bottlenecks (`performance-engineering`).

## Preflight
```bash
rg --files -g Cargo.toml -g rust-toolchain.toml -g go.mod -g '*.csproj' -g '*.sln' -g '*test*' -g '*ci*' | head -30
```
Read manifests and CI before choosing commands. Preserve the existing language and framework; never migrate incidentally.

## Workflow
1. Detect the stack and its executable gates from the table below.
2. Read the language reference before editing; check [real-world-cases](references/real-world-cases.md) for the matching bug shape.
3. Make the smallest change; define cancellation, deadlines, and cleanup for every task, goroutine, or async call it touches.
4. Run the gates and a real request or test that exercises the failure path.
5. Report command output, and anything unverified. Hand delivery to `finishing-dev`.

## Gates and traps
| Stack | Gates | Operational trap |
|---|---|---|
| Rust | `cargo fmt --check`; `cargo clippy --all-targets -- -D warnings`; `cargo test`; `cargo build --locked` | Blocking work or a lock held across await exhausts async workers |
| Go | `gofmt -l .`; `go vet ./...`; `go test -race ./...`; `go build ./...` | Nonempty gofmt output fails even with exit 0; every goroutine needs an exit path |
| .NET | `dotnet format --verify-no-changes`; `dotnet build -warnaserror`; `dotnet test` | Propagate CancellationToken; never capture scoped dependencies in singletons |

## Reference Routing
- Rust: [rust-best-practices.md](references/rust-best-practices.md)
- Go: [go-best-practices.md](references/go-best-practices.md)
- .NET: [architecture](references/dotnet-architecture.md), [async](references/dotnet-async.md), [EF Core](references/dotnet-efcore.md), [testing](references/dotnet-testing.md), [examples](references/dotnet-examples.md)
- Bug in a compiled service: [real-world-cases.md](references/real-world-cases.md)
- Everything else: [Reference Map](references/TOPIC_MAP.md)

## Stop
- A required gate fails or the toolchain is missing: report the blocker before claiming done.
- A goroutine, task, or handle has no shutdown path.
- A change would migrate the language or framework.

## Rules
- Hand API contracts and caching to `backend-systems`, schemas to `data-engineering`, deployment to `cloud-devops`, security review to `security-ops`.
- Never silence a lint, clippy, or analyzer warning to pass; fix it.
- Run the race detector or equivalent for any concurrency change.

## Checklist
- [ ] Language, framework, and gates match the manifests.
- [ ] Every spawned task has cancellation and a shutdown path.
- [ ] Format, lint, build, and tests pass.
- [ ] Failure path exercised with real output recorded.
