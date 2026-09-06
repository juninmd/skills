
# Quiet Checks

## Preflight
```bash
jq -r '.scripts | to_entries[] | "\(.key): \(.value)"' package.json   # what this project actually runs
rg -n 'verbose|--reporter|-v\b' package.json Makefile .github/workflows/*.yml 2>/dev/null
```

A green run has exactly one useful bit: the exit status. Everything printed on the way to it is a cost, and a full test log is one of the largest avoidable token costs in a session.

## Workflow
1. Read the project's own scripts first. Wrap what exists; never invent a parallel command line the maintainer does not use.
2. Pick the quiet form from the table below, and keep the failure detail — quiet means fewer lines, never fewer checks.
3. Run it and read the **exit status**, not the output.
4. Exit 0 → report "passed" and move on. Do not paste the summary to prove it.
5. Non-zero → read a bounded slice of the tail, identify the failing target, then re-run **only that target** verbosely.
6. Record the quiet invocations in the project's `AGENTS.md` so the next session starts with them — that is `agents-md`.

## Quiet Form by Tool

| Tool | Quiet invocation | Still shows |
|---|---|---|
| npm / pnpm | `npm run build --silent` · `pnpm -s run build` | the script's own output only |
| vitest | `vitest run --reporter=dot` | one dot per test, full failures |
| jest | `jest --silent --reporters=summary` | summary plus failures |
| pytest | `pytest -q --no-header` | one char per test, full tracebacks |
| eslint | `eslint . --quiet -f compact` | errors only, one line each |
| tsc | `tsc --noEmit --pretty false` | one line per diagnostic, no code frames |
| ruff / black | `ruff check -q` · `black -q .` | violations only |
| cargo | `cargo test -q` · `cargo build -q` | failures and warnings |
| go | `go test ./...` | package lines and failures (never add `-v`) |
| gradle / maven | `./gradlew -q test` · `mvn -q test` | failures only |
| docker | `docker build -q` | the image id |
| pip / uv | `pip install -q` · `uv sync -q` | errors only |
| git | `git checkout -q` · `git status --porcelain` | machine-readable, no prose |
| curl | `curl -sS` | errors, never the progress meter |

No quiet flag? Redirect and slice instead — `shell-operations` owns that mechanic.

## The Pipe Eats the Exit Status
```bash
set -o pipefail                      # without it, the status below is tail's, always 0
pnpm -s test 2>&1 | tail -n 30

pnpm -s test > /tmp/test.log 2>&1; status=$?   # safer: keep the status and the whole log
tail -n 30 /tmp/test.log; exit $status
```

`cmd | tail` reports the pipeline's **last** command. Piping a test run into `tail`, `head`, or `grep` without `pipefail` turns every failure into a pass — the exact opposite of what the quiet run was for.

## Verbosity Is a Failure Budget

| Situation | Output to read |
|---|---|
| Run passed | none — the exit status is the whole result |
| Run failed | last ~30 lines, then the failing target re-run verbosely |
| Failure is not in the tail (early error, hang) | grep the log for `error|fail|timeout`, still bounded |
| Diagnosing, not verifying | go verbose deliberately, scoped to one test or one file — that is `diagnostics` |
| Flaky or nondeterministic | keep the seed and the run count, not the log — `test-engineering` |

## Stop
- A quiet command is piped into `tail`, `head`, or `grep` without `pipefail`. The exit status is now meaningless; fix the pipeline before trusting the result.
- The run is green and its output is about to be pasted as proof. The status was the proof.
- Quiet mode hid the evidence a diagnosis needs. Re-run scoped and verbose — never silence a command you are still investigating.
- `--quiet` on a linter is being read as "clean". It suppressed warnings; say errors-only, or drop the flag before making the claim.

## Rules
- Quiet changes the reporter, never the work. A flag that skips tests, narrows a suite, or lowers a threshold is not a quiet flag.
- Report the command you actually ran, verbatim. A summarized run nobody can reproduce is not evidence.
- Failures stay loud, and stay complete: never truncate a stack trace or a diff into uselessness to save tokens.
- Prefer the project's script (`pnpm -s test`) over a hand-built invocation, so the quiet run and CI stay the same run.
- Bound every check with a timeout; a hung silent command looks exactly like a slow passing one.
- Background and long-running processes redirect to a file: `shell-operations` owns that mechanic, and delivery evidence belongs to `finishing-dev`.
- Inside an unattended loop the same rule holds harder: one number or one status per iteration, never a log — see `metric-loop`.

## Checklist
- [ ] Project's own scripts read before any invocation was chosen.
- [ ] Quiet form used for every check: test, build, typecheck, lint, install.
- [ ] Exit status read directly, or `pipefail` set where a pipe intervenes.
- [ ] Green runs reported without their output; failures re-run scoped and verbose.
- [ ] Every check timeout-bounded.
- [ ] Quiet invocations recorded in `AGENTS.md` for the next session.
