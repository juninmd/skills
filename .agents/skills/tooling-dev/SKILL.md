---
name: tooling-dev
description: |
  Build and maintain command-line tools, developer automation, code generators, and documentation extraction. Use for CLI arguments, exit codes, non-interactive execution, config discovery, structured output, packaging, and integration tests.
---

# Tooling Development

## Workflow
1. Define users, invocation examples, stdin/stdout/stderr contract, exit codes, and automation requirements.
2. Inspect repository runtime, packaging, config, logging, and distribution conventions.
3. Separate command parsing from domain logic; make the core callable without a terminal.
4. Support `--help`, non-interactive execution, machine-readable output when needed, and bounded cancellation.
5. Test valid input, invalid flags, missing config, partial files, interrupted processes, and cross-platform paths.
6. Run package/build checks and smoke the installed or packaged command, not only the source entry point.

## Reference Routing
- Practical tooling cases: [real-world-cases.md](references/real-world-cases.md)
- CLI behavior and operational standards: [tooling-best-practices.md](references/tooling-best-practices.md)
- Implementation patterns: [tooling-examples.md](references/tooling-examples.md)

## Rules
- Write primary results to stdout, diagnostics to stderr, and failures with non-zero exit codes.
- Never prompt in CI; provide explicit flags for confirmation and quiet modes.
- Avoid regex parsing when a structured parser exists.
- Do not overwrite user files without preview, backup, or explicit force behavior.

## Checklist
- [ ] Help, output streams, and exit codes are accurate.
- [ ] Non-interactive and failure paths are tested.
- [ ] Packaged command smoke passes.
