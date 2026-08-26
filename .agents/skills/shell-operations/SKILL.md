---
name: shell-operations
description: |
  Judge and run shell commands safely in bash and PowerShell: decide whether a destructive command is safe, write strict scripts, keep huge logs from flooding the context. Use for rm -rf safety, permissions, timeouts, shellcheck, PSScriptAnalyzer.
---

# Shell Operations

## Preflight
```bash
echo "$SHELL" && uname -s          # bash idioms do not survive PowerShell
shellcheck --version 2>/dev/null || echo 'no shellcheck'
```

Write for the host shell. A bash heredoc, `$VAR`, or `/dev/null` in a PowerShell context fails silently more often than loudly.

## Workflow
1. Write for the host shell. Bash idioms (`$VAR`, `/dev/null`, heredocs, `&&` chains in some hosts) do not survive PowerShell, and the failure is usually silent rather than loud.
2. Open with the strict preamble.
3. Treat that preamble as necessary, not sufficient — both shells have blind spots where it never fires.
4. Bind and validate before anything destructive.
5. Dry-run, then bound with a timeout, then run.
6. Lint before committing: `shellcheck` for bash, `Invoke-ScriptAnalyzer` for PowerShell.
7. Clean up temp files and background jobs, including on the failure path.

## Strict Preamble

```bash
set -euo pipefail
IFS=$'\n\t'          # stop word-splitting on spaces in filenames
trap 'rm -rf "$TMPDIR_LOCAL"' EXIT
```

```powershell
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true   # native exe failures throw
```

## Where Strict Mode Does Not Save You

| Shell | Blind spot | Cover |
|---|---|---|
| bash | `set -e` ignores failures inside `if`, `&&`, `\|\|`, and command substitution | check `$?` explicitly, or `|| exit 1` |
| bash | A failing command in a pipeline without `pipefail` | already covered above — never omit it |
| bash | `local x=$(cmd)` masks `cmd`'s exit status | declare, then assign on a separate line |
| PowerShell | Native `.exe` failures do not throw on older hosts | test `$LASTEXITCODE` after every call |
| PowerShell | `-ErrorAction SilentlyContinue` suppresses output but still fails the run | `try { } catch { }` with `-ErrorAction Stop` |

## Before Anything Destructive
An unset variable in a delete path is how `rm -rf /` happens.

```bash
: "${TARGET:?refusing an unset path}"
[[ "$TARGET" == /* && "$TARGET" != "/" ]] || { echo "refusing $TARGET"; exit 1; }
rm -rf -- "$TARGET"
```

```powershell
if (-not $Target) { throw 'refusing an unset path' }
Remove-Item -LiteralPath $Target -Recurse -Force -WhatIf   # drop -WhatIf once verified
```

| Command | Why it is worse than it looks |
|---|---|
| `rm -rf $DIR` | unquoted and unset expands to `rm -rf` in `$PWD` |
| `git clean -fdx` | deletes ignored files too — `.env`, local databases, caches |
| `docker system prune -af` | removes volumes on other projects too |
| `chmod -R 777` | world-writable, and unrecoverable as an audit finding |
| `kubectl delete -f dir/` | deletes everything the directory ever declared |

## Keeping Output Out of Context
A dumped log is the largest avoidable token cost there is.

```bash
cmd > /tmp/run.log 2>&1 || true      # capture everything
tail -n 40 /tmp/run.log              # read a slice
grep -nEi 'error|fail|timeout' /tmp/run.log | head -n 20   # or just the signal
timeout 180s <cmd>                   # never let it hang the session
```

## Reference Routing
- Where strict mode silently fails in each shell, and what covers it: [strict-shell.md](references/strict-shell.md)

## Stop
- A destructive command has an unset, empty, or unvalidated target. Bind it and abort; this is how `rm -rf /` happens.
- A network or test command has no timeout. Bound it before running; an unbounded command hangs the session.
- Output would be dumped into context. Redirect to a file and read a slice — it is the largest avoidable token cost there is.

## Rules
- Never interpolate an unvalidated variable into a destructive command.
- Quote every expansion. `"$var"`, `"$@"`, and `--` before user-controlled paths — a filename starting with `-` becomes a flag otherwise.
- A nonzero exit status is a stop condition, not a warning.
- Least privilege: narrow permission bits, no elevation unless required, never world-writable.
- Keep secrets out of command lines, scripts, and logs — arguments are visible in `ps` to every user on the box. Read them from the environment or a file.
- Background jobs redirect stdout and stderr to a known file; an unredirected background job loses its own failure.
- Force-push, reset, rebase, and other git history or remote decisions belong to `git-workflow`; building a real CLI to `tooling-dev`.

## Checklist
- [ ] Script matches the host shell and carries its strict preamble.
- [ ] Exit status checked where strict mode does not fire.
- [ ] Destructive paths bound-checked and dry-run first.
- [ ] Every network and test command timeout-bounded.
- [ ] Output captured to a file and read in slices, never dumped.
- [ ] `shellcheck` or `Invoke-ScriptAnalyzer` clean; temp files and jobs cleaned up on every path.
