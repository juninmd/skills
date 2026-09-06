# Where Strict Mode Fails, and What Covers It

`set -euo pipefail` and `Set-StrictMode` are the floor, not the ceiling. Both have well-known gaps where a failing command produces no error and the script keeps going. These are the cases to check by hand.

## bash: `set -e` does not fire

**Inside a condition.** Any command in an `if`, `while`, `until`, or `&&`/`||` chain runs with errexit disabled — including everything it calls.

```bash
if run_migration; then echo ok; fi   # a failure inside run_migration is swallowed
migrate && deploy                     # migrate failing just skips deploy, silently
```

Cover it by capturing the status explicitly:

```bash
set +e; run_migration; status=$?; set -e
(( status == 0 )) || { echo "migration failed: $status" >&2; exit "$status"; }
```

**All but the last command of a function called in a condition.** Same rule: the whole call tree inherits the suspension.

**Command substitution assigned to `local` or `declare`.** The exit status you see is the status of `local`, which is always 0.

```bash
local out="$(failing_command)"   # $? is 0 — the failure is gone
```

Split the declaration from the assignment:

```bash
local out
out="$(failing_command)" || return   # now the status is the command's
```

The same applies to `export VAR="$(...)"` and `readonly VAR="$(...)"`.

**Pipelines.** `pipefail` covers the exit status, but `PIPESTATUS` is what tells you *which* stage failed:

```bash
cmd_a | cmd_b | cmd_c
echo "${PIPESTATUS[@]}"   # e.g. "1 0 0"
```

**Subshell in a command substitution.** `x=$( set -e; ... )` does not propagate to the parent; check `$?` after.

**Arithmetic evaluating to zero.** `(( count++ ))` returns 1 when the result is 0, which under `set -e` aborts the script. Use `(( count++ )) || true`, or `count=$(( count + 1 ))`.

**`set -u` and arrays.** Under bash before 4.4, `"${arr[@]}"` on an empty array trips unset-variable. Use `"${arr[@]:-}"` when the version is not guaranteed.

**Traps.** `set -e` exits without running cleanup unless you install one: `trap 'rm -rf "$TMPDIR_LOCAL"' EXIT`.

## PowerShell: `$ErrorActionPreference = 'Stop'` does not fire

**Native executables.** `$ErrorActionPreference` governs cmdlet errors only. `git`, `npm`, `docker`, `terraform` — anything that is not a cmdlet — signals failure through `$LASTEXITCODE`, and PowerShell keeps going.

```powershell
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci failed ($LASTEXITCODE)" }
```

Wrap it once instead of repeating the check:

```powershell
function Invoke-Checked {
    param([scriptblock] $Command)
    & $Command
    if ($LASTEXITCODE -ne 0) { throw "command failed with exit $LASTEXITCODE" }
}
Invoke-Checked { npm ci }
```

On PowerShell 7.3+, `$PSNativeCommandUseErrorActionPreference = $true` makes native failures terminating. Set it explicitly — it is not the default in every host — and keep the guard for older hosts.

**Non-terminating cmdlet errors under a suppressed action.** `-ErrorAction SilentlyContinue` hides the message but does not make the operation succeed; `$?` and `$Error[0]` still carry it. If you truly want a failure ignored, make it terminating and swallow it deliberately: `try { Cmdlet -ErrorAction Stop } catch { }`.

**`try`/`catch` does not catch non-terminating errors.** A cmdlet emitting a non-terminating error skips `catch` entirely. Add `-ErrorAction Stop` to the cmdlet you want caught.

**`$LASTEXITCODE` is stale.** It reflects the last *native* command, not the last cmdlet. Read it immediately after the call, before anything else runs.

**Pipelines stop at the first terminating error only.** A native command mid-pipeline that fails still lets the rest of the pipeline consume whatever it produced. Assign, check, then pipe.

## Exit status hygiene, both shells

- Check status at the boundary where you can still do something about it, not at the end.
- Fail with a message that names the command and the status; a bare `exit 1` costs a debugging round trip.
- A cleanup path must run on failure: `trap ... EXIT` in bash, `try { } finally { }` in PowerShell.
