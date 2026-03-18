---
name: developing-tooling
description: Desenvolvimento de ferramentas CLI, scripts de automação e utilitários internos com foco em robustez, logs e testes.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[file/module] [options]"
---

# Tooling Developer

Esta skill orienta a criação de ferramentas de linha de comando (CLI) e scripts de automação de alta qualidade, seguindo padrões de engenharia de software (Testes, Logs, Documentação).

## Instructions
1.  **Interface Design:** Use bibliotecas robustas para CLI (Python: `typer`/`click`, Go: `cobra`, Node: `commander`).
    *   **Help:** Todo comando deve ter `--help` detalhado com exemplos.
    *   **Arguments:** Valide inputs rigorosamente (tipagem forte com Pydantic/Zod).
2.  **Logging & Observability:**
    *   **Structured Logs:** Use logs estruturados (JSON) para execução em CI/CD (`structlog` em Python).
    *   **Human Logs:** Use logs coloridos/formatados (`rich` ou `chalk`) para execução interativa.
    *   **Levels:** Diferencie claramente `DEBUG`, `INFO`, `WARNING`, `ERROR`.
3.  **Error Handling:**
    *   Nunca mostre stack traces para o usuário final (exceto em `--debug`).
    *   Use códigos de saída (exit codes) semânticos (0=sucesso, 1=erro geral, 2=uso incorreto).
4.  **Testing Strategy:**
    *   **Unit Tests:** Teste a lógica de negócio isolada (Mock de I/O).
    *   **Integration Tests:** Teste a invocação do CLI (ex: `typer.testing.CliRunner`).
    *   **Coverage:** Almeje > 80% de cobertura.

## Common Tasks
*   **Create CLI (Python):** `uv init --app && uv add typer rich structlog`
*   **Create CLI (Node):** `npm init && pnpm add commander chalk winston`

## Examples
### Valid Python CLI (Typer + Rich)
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

### Valid Logging Configuration
```python
# Configure structlog for JSON output in CI, Console in Dev
import sys
import structlog

def configure_logging(json_mode: bool):
    processors = [structlog.processors.JSONRenderer()] if json_mode else [structlog.dev.ConsoleRenderer()]
    structlog.configure(processors=processors, logger_factory=structlog.PrintLoggerFactory())
```

## Resources
- **12-Factor CLI Apps:** Princípios para construção de apps de linha de comando (Config via Env Vars, Logs via Stdout).
