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

## 4. Atomic Write on Interrupt
```js
process.on('SIGINT', () => { fs.rmSync(tmpPath, { force: true }); process.exitCode = 130; });
fs.writeFileSync(tmpPath, output);
fs.renameSync(tmpPath, destPath); // only the rename makes the write visible
```
Full signal-handling and cross-platform detail: [packaging-and-compatibility.md](packaging-and-compatibility.md).

## 5. Argument Parser with `--` and Negative Numbers
```python
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--limit", type=int)   # accepts --limit=-5 unambiguously
parser.add_argument("files", nargs="*")    # everything after `--` lands here
args, extra = parser.parse_known_args()
```
Full edge-case table: [argument-and-exit-conventions.md](argument-and-exit-conventions.md).
