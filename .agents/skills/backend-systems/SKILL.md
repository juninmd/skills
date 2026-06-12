---
name: backend-systems
description: "Comprehensive Backend Systems Engineering covering Go, Rust, and .NET."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Go, Rust, .NET Core"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Backend Systems Engineering

Expert methodology for building high-performance, compiled backend systems. This skill unifies development in Go, Rust, and C# (.NET).

**USE FOR:**
- Building efficient microservices and APIs with Go (net/http).
- Developing safe, zero-cost abstraction systems with Rust (Cargo).
- Building enterprise web applications with .NET (C#, EF Core).
- Managing memory safety, concurrency, and cross-platform compilation.

**DO NOT USE FOR:**
- Scripting or rapid prototyping (use `backend-python` or `backend-node`).
- Frontend development (use `frontend-engineering`).

**INVOKES:**
- `go`, `cargo`, `rustc`, `dotnet`, `clippy`, `golangci-lint`.

## Core Principles
1. **Safety First:** Leverage compiler checks (Rust's borrow checker, Go's strict typing) to prevent runtime errors.
2. **Concurrency:** Use native concurrency models (Goroutines, async/await, Rust async) appropriately.
3. **Idiomatic Code:** Follow the standard formatting and conventions of the respective language (`gofmt`, `cargo fmt`).
4. **Performance:** Optimize for low latency and minimal memory overhead.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Go Development](references/go-dev.md)
- [Rust Development](references/rust-dev.md)
- [.NET Development](references/dotnet-dev.md)

## Checklist
- [ ] Ensure the correct compiler/toolchain version is specified (e.g., `go.mod`, `Cargo.toml`, `.csproj`).
- [ ] Run language-specific linters (`clippy`, `golangci-lint`) and resolve all warnings.
- [ ] Handle errors explicitly (e.g., Go's `if err != null`, Rust's `Result` type).
