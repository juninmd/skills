# CLI implementation Examples

Patterns for logging and command structure in Python and Node.js.

## 1. Typer + Rich (Python)
```python
import typer
from rich.console import Console

app = typer.Typer()
console = Console()

@app.command()
def build(env: str = typer.Option("dev", help="Environment")):
    console.print(f"[bold blue]Building {env}...[/bold blue]")
```

## 2. Structured Logging
```python
import structlog
def setup_logs(json_mode: bool):
    proc = [structlog.processors.JSONRenderer()] if json_mode else [structlog.dev.ConsoleRenderer()]
    structlog.configure(processors=proc)
```

## 3. Common Tasks
- **Init Python:** `uv init --app && uv add typer rich structlog`
- **Init Node:** `npm init && pnpm add commander chalk zod`
