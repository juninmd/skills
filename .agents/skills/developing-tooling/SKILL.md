---
name: developing-tooling
description: "Tooling Developer for Designing user-friendly, Implementing structured, Applying rich via typer."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Tooling Developer

Expert methodology for building high-quality command-line interfaces (CLI) and automation tools that follow modern engineering standards.

**USE FOR:**
- Designing user-friendly CLI interfaces with robust help and validation.
- Implementing structured JSON logging for CI/CD observability.
- Applying rich formatting and colors for interactive terminal usage.
- Writing automated tests for CLI invocations and business logic.
- Packaging tools for distribution as standalone binaries.

**DO NOT USE FOR:**
- Complex backend API servers (use developing-fastapi/developing-nestjs).
- Tasks better suited for pure Bash or PowerShell without library overhead.

**INVOKES:**
- `typer`, `commander`, `uv`, `pnpm` CLI tools.

## Methodology and Guidelines
Implementation details for stack, design principles, and examples are documented in:
1. [CLI Tooling Best Practices](references/tooling-best-practices.md)
2. [CLI Implementation Examples](references/tooling-examples.md)

## Core Principles
1. **Machine First:** Default to machine-readable output (JSON) in non-interactive environments.
2. **Safety:** Never expose internal stack traces unless requested via `--debug`.
3. **Determinism:** Use semantic exit codes to signal failure types.

## Checklist
- [ ] Define inputs, outputs, and operator workflow before implementation.
- [ ] Ensure every command and option has clear documentation.
- [ ] Verify exit codes for both success and realistic failure scenarios.
- [ ] Validate that logs are structured (JSON) when running in CI.
