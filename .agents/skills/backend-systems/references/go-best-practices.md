# Go Development Best Practices

Guidelines for environment setup, project structure, and quality control in Go.

## 1. Environment and Project Setup
- **Initialization:** `go mod init <path>`
- **Dependencies:** `go get <pkg>`, `go mod tidy`.
- **Structure (Standard Layout):**
  - `/cmd`: Entry points.
  - `/internal`: Private code (API, config, logic).
  - `/pkg`: Public libraries.
  - `go.mod`: Dependency management.

## 2. Idiomatic Patterns
- **Error Handling:** Always wrap errors with context: `fmt.Errorf("...: %w", err)`. Never swallow errors.
- **Concurrency:** Use channels and goroutines for I/O; prefer `sync.WaitGroup` for simple joins.
- **Logging:** Use the standard library `log/slog` for structured logging.

## 3. Testing and Quality
- **Unit Testing:** Use `go test ./...`; cover changed behavior, critical paths, and regression cases.
- **Assertions:** Prefer standard library checks or `testify/assert` for readability.
- **Quality Gates:**
  - `go fmt`: Automatic formatting.
  - `go vet`: Static analysis for suspicious constructs.
  - `golangci-lint`: Comprehensive multi-linter runner.

## References
- [Go Documentation](https://go.dev/doc/)
- [Standard Project Layout](https://github.com/golang-standards/project-layout)
