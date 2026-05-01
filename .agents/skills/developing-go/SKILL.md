---
name: developing-go
description: "Go with modules, goroutines, clean architecture. For backend/CLI. Triggers: Go, golang."

argument-hint: "[file/module] [options]"
---

# Development with Go

This skill standardizes modern Go development utilizing go modules, idiomatic Go conventions, and robust testing.

## 🧱 Recommended Stack
- **Runtime:** Go 1.23+
- **Management:** `go mod`
- **Quality:** `golangci-lint`, `go fmt`, `go vet`
- **Testing:** `go test`, `testify` (optional for assertions)
- **APIs:** `net/http` standard library, `chi`, or `gin`

## Recommended Baseline

- Go **1.23+** with structured logging (`slog`).
- Dependency management exclusively via **`go mod`**.
- Format code with **`go fmt`** and lint with **`golangci-lint`**.
- Error handling must wrap errors using `fmt.Errorf` with the `%w` verb.
- Testing with standard **`go test`**. Minimum coverage: **80%**.

## Instructions

### 1. Environment Setup

```bash
# Initialize a new project
go mod init github.com/username/my-project

# Add dependency
go get github.com/stretchr/testify

# Download dependencies
go mod tidy
```

### 2. Project Structure (Standard)

```text
my-project/
├── cmd/
│   └── my-app/
│       └── main.go
├── internal/
│   ├── api/
│   ├── config/
│   └── service/
├── pkg/
├── go.mod
├── go.sum
└── Makefile
```

### 3. Error Handling

```go
// ✅ Correct: wrapping errors
if err != nil {
    return fmt.Errorf("failed to process order %s: %w", orderID, err)
}

// ❌ Incorrect: swallowing errors
if err != nil {
    return err // Loses context
}
```

### 4. Testing Patterns

```go
// internal/service/user_test.go
package service_test

import (
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestGetUser(t *testing.T) {
    // Arrange
    service := NewUserService()

    // Act
    user, err := service.GetUser(1)

    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, user)
}
```

### 5. Quality Gates

| Tool | Command | Purpose |
|---|---|---|
| `go fmt` | `go fmt ./...` | Code formatting |
| `go vet` | `go vet ./...` | Examine Go source code and report suspicious constructs |
| `golangci-lint` | `golangci-lint run` | Comprehensive linting |
| `go test` | `go test -cover ./...` | Unit testing and coverage |

## Checklist

- [ ] Confirm the package layout and dependency boundaries before moving types or interfaces.
- [ ] Run `go fmt`, `go vet`, and the narrowest relevant tests after each change.
- [ ] Keep exported APIs small, explicit, and easy to test.

## References

- [Go Official Documentation](https://go.dev/doc/)
- [Go 1.23 Release Notes](https://go.dev/doc/go1.23)
