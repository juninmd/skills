# CLI Tooling Best Practices

Guidelines for creating high-quality command-line tools and automation scripts.

## 1. Recommended 2026 Stack
- **Python:** `uv` + `typer` + `rich` + `structlog`.
- **Node.js:** `pnpm` + `commander` + `zod` + `pino`.
- **Distribution:** `PyOxidizer` (Python) or `pkg` (Node) for binaries.
- **Observability:** OpenTelemetry SDK + structured JSON logs.

## 2. Interface Design (CLIG)
- **Help:** Detailed `--help` with examples for every command.
- **Arguments:** Strong typing and rigorous validation (Pydantic/Zod).
- **Output:** Colors for humans (`rich`/`chalk`), JSON for machines.
- **Exit Codes:** 0 (Success), 1 (Error), 2 (Incorrect usage).

## 3. Testing Strategy
- **Unit:** Mock I/O and test isolated logic.
- **Integration:** Invoke the CLI directly using runners (e.g., `CliRunner`).
- **Coverage:** Target > 80% coverage.

## References
- [The Twelve-Factor App](https://12factor.net/)
- [Command Line Interface Guidelines](https://clig.dev/)
