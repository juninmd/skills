---
name: developing-dotnet
description: "Developing with .NET for Designing REST, Developing microservices, Configuring EF via dotnet build."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file, write_file, replace]
---

# Developing with .NET

Expert methodology for building production .NET apps using modern C# patterns and Clean Architecture.

**USE FOR:**
- Designing REST or gRPC Web APIs.
- Developing microservices and Worker Services.
- Configuring EF Core with migrations and repositories.
- Implementing async/await with `CancellationToken`.
- Setting up testing suites using xUnit and Moq.

**DO NOT USE FOR:**
- Legacy .NET Framework maintenance.
- Frontend development (unless Blazor specified).

**INVOKES:**
- `dotnet build`, `dotnet test` commands.

## Architecture and Standards
Refer to these specialized modules:
1. [Architecture/Design](references/dotnet-architecture.md) | [Async/Error](references/dotnet-async.md)
2. [EF Core/Data](references/dotnet-efcore.md) | [Testing](references/dotnet-testing.md)
3. [Examples](references/dotnet-examples.md)

## Core Principles
1. **Fail Fast:** Run Unit tests before integration/E2E.
2. **Safety:** Enable nullable reference types; validate all inputs.
3. **Efficiency:** Use `.AsNoTracking()` for read-only queries.

## Checklist
- [ ] Confirm .NET/C# versions before starting.
- [ ] Accept `CancellationToken` in all async methods.
- [ ] Ensure unit test coverage for new logic.
- [ ] Verify that no secrets are logged.
