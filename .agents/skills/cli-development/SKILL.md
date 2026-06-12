---
name: cli-development
description: "Modern CLI Development for Designing CLI, Implementing interactive, Handling stdin/stdout via commander."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Node.js 24+, Python 3.13+, Rust, Go"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Modern CLI Development

Expert methodology for building user-friendly, robust command-line applications with professional error handling, help systems, and piping support.

**USE FOR:**
- Designing CLI commands with clear argument structure and flags (commander, yargs, Click, Typer, Clap).
- Implementing interactive prompts, progress bars, and colored output (inquirer, ora, rich).
- Handling stdin/stdout piping and streaming for large data processing.
- Composing CLI apps with subcommands, plugins, and version management.
- Validating arguments, providing helpful error messages, and documenting via `--help`.

**DO NOT USE FOR:**
- Bash/shell scripting (use existing shell patterns).
- Web-based or GUI applications.
- Simple Node.js scripts without proper error handling or help systems.

**INVOKES:**
- `commander`, `yargs`, `click`, `typer`, `clap`, `inquirer`, `ora`, `chalk`.

## Methodology
Professional CLIs balance power-user features (piping, exit codes) with accessibility (clear help, validation errors).

## Core Principles
1. **Unix Philosophy:** Read from stdin, write to stdout, fail with non-zero exit code; compose with pipes.
2. **Clear Help:** Every command exports `--help` with examples; abbreviations optional but documented.
3. **Progressive Disclosure:** Simple defaults; advanced flags hidden behind `--advanced` or subcommands.

## Checklist
- [ ] Command structure clearly defined: main command, subcommands, positional args, flags.
- [ ] Argument parser chosen (Commander, Yargs, Click, Typer, Clap) with validation.
- [ ] Help text auto-generated from code; examples included for all subcommands.
- [ ] Error messages are actionable: show expected format, suggest fixes, include exit codes.
- [ ] Supports piping: reads from stdin, writes structured output (JSON, CSV) to stdout.
- [ ] Interactive prompts for required args (avoid silent failures); confirm destructive actions.
- [ ] Progress bars, spinners, and status messages use appropriate libraries (ora, rich).
- [ ] Version flag (`--version`) and update check implemented (via GitHub releases or npm).
- [ ] Exit codes follow conventions (0=success, 1=general error, 2=misuse, >2=specific errors).
