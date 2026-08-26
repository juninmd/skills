---
name: tooling-dev
description: |
  Build and maintain command-line tools, developer automation, and code generators. Use for CLI arguments, exit codes, non-interactive execution, config discovery, signals, structured output, packaging, and integration tests.
---

# Tooling Development

## Preflight
```bash
cat package.json | jq '{bin, files, engines}'   # what actually ships
command -v <tool> && <tool> --help | head -20   # the current contract, if it exists
```

Write the invocation examples first — including the one inside a CI job and the one inside a pipe. They define the contract more honestly than a design document.

## Workflow
1. Write the invocation examples first — including the one inside a CI job and the one inside a pipe. They define the contract more honestly than any design doc.
2. Inspect the repository's runtime, packaging, config, logging, and distribution conventions before adding a fourth way to do any of them.
3. Separate command parsing from domain logic. The core must be callable without a terminal, or it can never be tested or reused.
4. Support `--help`, non-interactive execution, machine-readable output, and bounded cancellation.
5. Test invalid flags, missing config, partial files, interruption, and cross-platform paths — not just the happy invocation.
6. Smoke the **installed or packaged** command, never only the source entry point. Packaging is where tools break.

## The Stream Contract
This split is the entire reason a tool composes.

| Stream | Carries | Rule |
|---|---|---|
| stdout | the result — the thing a pipe consumes | machine-readable when not a TTY |
| stderr | progress, warnings, diagnostics | never part of the result |
| exit code | success or the class of failure | 0 only when the work actually happened |

| Code | Means |
|---|---|
| 0 | success |
| 1 | generic runtime failure |
| 2 | usage error — bad flag, missing argument |
| 3–63 | tool-specific, documented in `--help` |
| 130 | interrupted (`SIGINT`, 128+2) |

A single exit code 1 for everything makes automation impossible: the caller cannot tell "you typed it wrong" from "the network died".

## Adapt to the Terminal, Then Get Out of the Way

```js
const isTTY = process.stdout.isTTY;
const color = isTTY && !process.env.NO_COLOR && !argv.noColor;
// JSON when piped, human table when interactive
isTTY ? renderTable(rows) : process.stdout.write(JSON.stringify(rows) + '\n');
```

Honor `NO_COLOR` and an explicit `--no-color` regardless of TTY detection. Never emit a spinner or a progress bar into a redirected stream — it becomes megabytes of escape codes in a CI log.

## Failure Paths People Skip

| Event | Correct behavior |
|---|---|
| `SIGINT` / `SIGTERM` | stop, **delete the partial output file**, exit non-zero |
| Downstream pipe closes (`head`) | catch `EPIPE`, exit quietly — never a stack trace |
| Running in CI with no TTY | never prompt; require an explicit `--yes` |
| Output file already exists | preview, back up, or demand `--force` |
| Config found in several places | documented precedence, and `--print-config` to show what won |

Config precedence, highest first: **command flag → environment variable → project file → user file → built-in default.** Print the resolved source on request; "why is it using that value" is the most common support question a tool generates.

## Reference Routing
- Practical tooling cases: [real-world-cases.md](references/real-world-cases.md)
- CLI behavior and operational standards: [tooling-best-practices.md](references/tooling-best-practices.md)
- Implementation patterns: [tooling-examples.md](references/tooling-examples.md)
- Reference docs generated from code or schemas: use the `documentation` skill.

## Stop
- The tool would prompt in a non-TTY context. Never prompt in CI; require an explicit flag.
- A partial output file would survive an interruption. Write to a temp path and rename atomically instead.
- Only the source entry point was smoked. Test the packaged command — packaging is where tools break.

## Rules
- A truncated artifact that looks complete is worse than no artifact. Write to a temp path and rename atomically on success.
- Never prompt in CI. Provide explicit flags for confirmation and for quiet mode.
- Avoid regex parsing when a structured parser exists — the regex works until the first quoted comma.
- Version the output format. A tool whose JSON shape drifts silently breaks every script built on it; `--format-version` or a `schema` field costs nothing now and everything later.
- `--help` is the primary documentation. If a behavior is not in it, the behavior does not exist for most users.
- Shell scripts and one-off command safety belong to `shell-operations`; publishing and versioning the tool to `release-management`.

## Checklist
- [ ] Invocation examples written first, including the CI and piped cases.
- [ ] Core logic callable without a terminal.
- [ ] stdout carries only the result; diagnostics on stderr; exit codes distinguish usage from runtime failure.
- [ ] TTY detection, `NO_COLOR`, signals, and `EPIPE` all handled.
- [ ] Config precedence documented and inspectable.
- [ ] Partial output never left behind; the packaged command smoke-tested.
