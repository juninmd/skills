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

## 4. Lifecycle and Compatibility
- Argument parsing edge cases (`--`, negative numbers, repeated flags) and exit code
  conventions: [argument-and-exit-conventions.md](argument-and-exit-conventions.md).
- Signal handling, atomic writes, TTY/piping, cross-platform paths, packaging, and
  flag deprecation: [packaging-and-compatibility.md](packaging-and-compatibility.md).
- Separating the callable core from the command-line adapter is Hunt & Thomas's
  orthogonality principle from *The Pragmatic Programmer* applied to a CLI: the
  domain logic should not know it is being invoked from a terminal.

## References
- [The Twelve-Factor App](https://12factor.net/) — config discovery and precedence.
- [Command Line Interface Guidelines](https://clig.dev/) — help text, output, and argument conventions.
- *The Pragmatic Programmer* (Hunt & Thomas) — tool design, automation, and orthogonality.
- *Clean Code* (Robert C. Martin) — naming and structure, applied to commands and flags.
