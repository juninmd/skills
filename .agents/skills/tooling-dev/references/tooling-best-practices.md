# CLI Tooling Best Practices

Guidelines for creating high-quality command-line tools and automation scripts.

## 1. Stack Selection
- Preserve the repository language, package manager, and CLI framework.
- For new tools, verify maintained options and choose the smallest stack that satisfies packaging and platform requirements.
- Add structured logs or telemetry only when the tool has an operational consumer.

## 2. Interface Design (CLIG)
- **Help:** Detailed `--help` with examples for every command.
- **Arguments:** Strong typing and rigorous validation (Pydantic/Zod).
- **Output:** Colors for humans (`rich`/`chalk`), JSON for machines.
- **Exit Codes:** 0 (Success), 1 (Error), 2 (Incorrect usage).

## 3. Testing Strategy
- **Unit:** Mock I/O and test isolated logic.
- **Integration:** Invoke the CLI directly using runners (e.g., `CliRunner`).
- **Coverage:** Cover command contracts, exit codes, invalid input, failures, and baseline regressions.

## References
- [The Twelve-Factor App](https://12factor.net/)
- [Command Line Interface Guidelines](https://clig.dev/)
