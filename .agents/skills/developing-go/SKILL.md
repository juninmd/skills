---
name: developing-go
description: |
  **DEVELOPMENT SKILL** - Build efficient and idiomatic applications with Go.
  USE FOR: Go modules, idiomatic Go patterns, error wrapping, golangci-lint, go test, net/http APIs, microservices in Go.
  DO NOT USE FOR: generic C-family programming, frontend development, heavy GUI applications.
  INVOKES: go CLI, golangci-lint.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Development with Go

Expert guidance for building modern, high-performance applications using Go's idiomatic conventions and toolchain.

**USE FOR:**
- Initializing and managing Go modules and dependencies.
- Implementing RESTful APIs using `net/http`, `chi`, or `gin`.
- Writing idiomatic Go code with proper error handling (`%w`) and structured logging (`slog`).
- Designing internal package boundaries and project structures.
- Configuring quality gates and automated testing suites.

**DO NOT USE FOR:**
- Legacy GOPATH-based projects (unless migrating to modules).
- Deep system integration tasks better suited for C/Rust (unless via cgo).

**INVOKES:**
- `go build`, `go test`, `go fmt`, `golangci-lint` commands.

## Methodology and Guidelines
Implementation details for project structure, error patterns, and testing are documented in:
- [Go Development Best Practices](references/go-best-practices.md)

## Core Principles
1. **Idiomaticity:** Follow "Effective Go" standards and use standard library whenever practical.
2. **Error Safety:** Wrap all returned errors to maintain execution context.
3. **Quality First:** Run `go fmt` and `go vet` after every significant code change.

## Checklist
- [ ] Confirm package layout and dependency boundaries before implementing logic.
- [ ] Ensure all exported APIs have comprehensive unit tests.
- [ ] Verify that errors are handled and wrapped, never ignored.
