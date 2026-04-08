---
name: developing-tooling
description: Development of CLI tools, automation scripts, and internal utilities with a focus on robustness, logging, and testing.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Tooling Developer

This skill guides the creation of high-quality command-line tools (CLI) and automation scripts, following software engineering standards (Testing, Logging, Documentation).

## 🧱 Recommended Stack 2026
- **Internal Python CLI:** `uv` + `typer` + `rich` + `structlog` + `pytest`.
- **Internal Node CLI:** `pnpm` + `commander` + `zod` + `pino` + `vitest`.
- **Distribution:** binaries with `PyOxidizer`/`shiv` (Python) or `pkg`/`nexe` (Node) when necessary.
- **Observability:** OpenTelemetry SDK + structured JSON logs.

## Instructions
1.  **Interface Design:** Use robust libraries for CLI (Python: `typer`/`click`, Go: `cobra`, Node: `commander`).
    *   **Help:** Every command must have a detailed `--help` with examples.
    *   **Arguments:** Validate inputs rigorously (strong typing with Pydantic/Zod).
2.  **Logging and Observability:**
    *   **Structured Logs:** Use structured logs (JSON) for CI/CD execution (`structlog` in Python).
    *   **Human Logs:** Use colored/formatted logs (`rich` or `chalk`) for interactive execution.
    *   **Levels:** Clearly differentiate `DEBUG`, `INFO`, `WARNING`, `ERROR`.
3.  **Error Handling:**
    *   Never show stack traces to the end-user (except with `--debug`).
    *   Use semantic exit codes (0=success, 1=general error, 2=incorrect usage).
4.  **Testing Strategy:**
    *   **Unit Tests:** Test isolated business logic (I/O mocking).
    *   **Integration Tests:** Test CLI invocation (e.g., `typer.testing.CliRunner`).
    *   **Coverage:** Aim for > 80% coverage.

## Common Tasks
*   **Create CLI (Python):** `uv init --app && uv add typer rich structlog`
*   **Create CLI (Node):** `npm init && pnpm add commander chalk winston`

## Examples
### Valid Python CLI Example (Typer + Rich)
```python
import typer
from rich.console import Console
import structlog

app = typer.Typer()
console = Console()
log = structlog.get_logger()

@app.command()
def deploy(env: str = typer.Option(..., help="Environment (dev/prod)")):
    """Deploy application to specified environment."""
    log.info("starting_deploy", env=env)
    try:
        # Business Logic...
        console.print(f"[green]Deploy to {env} successful![/green]")
    except Exception as e:
        log.error("deploy_failed", error=str(e))
        console.print(f"[red]Error:[/red] {e}")
        raise typer.Exit(code=1)

if __name__ == "__main__":
    app()
```

### Valid Logging Configuration Example
```python
# Configure structlog for JSON output in CI, Console in Dev
import sys
import structlog

def configure_logging(json_mode: bool):
    processors = [structlog.processors.JSONRenderer()] if json_mode else [structlog.dev.ConsoleRenderer()]
    structlog.configure(processors=processors, logger_factory=structlog.PrintLoggerFactory())
```

## Resources
- **12-Factor CLI Apps:** Principles for building command-line apps (Config via Env Vars, Logs via Stdout).
