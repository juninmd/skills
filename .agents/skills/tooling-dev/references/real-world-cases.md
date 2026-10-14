# Tooling Development Real-World Cases

Use this first for CLIs, developer automation, generators, and scripts.

## New CLI Command
- Define invocation examples, inputs, outputs, exit codes, and CI behavior before coding.
- Keep parsing/adapters separate from callable core logic.
- Support `--help`, quiet/non-interactive mode, and machine-readable output when automation needs it.
- Smoke the installed command, not only the source file.

## File Rewriter or Generator
- Parse structured formats with real parsers.
- Preserve unrelated formatting and comments when possible.
- Provide dry-run, diff, or preview before overwriting user files.
- Test idempotency and partial-file failure.

## Cross-Platform Script
- Use the host shell's path and quoting rules.
- Avoid shell-specific behavior unless the tool declares that shell.
- Test spaces in paths, Windows drive paths, missing env vars, and interrupted child processes.

## Integration Tool
- Separate human logs from JSON/stdout contracts.
- Bound network calls and child processes with timeouts.
- Redact credentials from logs and crash reports.

## Deprecating a Flag or Subcommand
- Ship the replacement alongside the old behavior before announcing removal.
- Warn on stderr with the replacement name and the version the old form disappears in.
- Never repurpose a removed flag name; fail loudly (`EX_USAGE`) instead of doing something new silently.
- See [packaging-and-compatibility.md](packaging-and-compatibility.md) for the full sequence.

## Packaging a Release
- Smoke the installed or packaged artifact (tarball, single binary), not the source tree.
- Pin the runtime version in the manifest so an unsupported host fails at install, not at first use.
- Generate shell completions from the same flag definitions the parser uses.
- Tag and publish from CI on a green SHA — see the `git-workflow` skill's release procedure.
