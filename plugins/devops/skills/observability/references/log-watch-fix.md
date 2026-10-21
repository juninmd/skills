# Log watch and fix

A closed loop for a live system: observe the logs, turn each new error into one tracked signature, fix its root cause, redeploy, and observe again. It ends on evidence (a clean window) or a budget, never on a hunch. Proving one change on its target is the `homologate` reference of `finishing-dev`; surviving auth and quota expiry in a headless run is `agent-orchestration`.

## Contents
- Preflight
- Workflow
- Decision table
- Invocations
- Gotchas
- Stop rules

## Preflight
```bash
git status --short && git rev-parse --short HEAD    # the version about to be watched
```
Pick the log source and its health check in [log-sources.md](log-sources.md). Create the ledger ([signature-ledger.md](signature-ledger.md)) in the session temp directory, outside the repository.

## Workflow
1. **Contract first.** Write down the source command, the scope, what "clean" means (no new signature across N minutes **and** one full trigger cycle), the budget (iterations, wall clock, fixes), and which environments may be redeployed without asking.
2. **Baseline.** Read the existing log once, group it, and mark known-benign noise so it never counts as a regression.
3. **Watch.** Read bounded slices, never a raw stream into context. Filter with `rg -ni` and pipe through `scripts/signatures.mjs`; check process health separately (restarts, exit codes, OOM), because a crash can leave no error line.
4. **One signature, one ledger row.** Statuses are `new`, `diagnosing`, `fixed`, `benign`, `external`, `reopened`.
5. **Classify before touching code.** Own defect, bad config, external dependency, or environment limit (quota, VRAM, disk). Only the first two are fixable here; the rest get a hypothesis and a note, not a patch to the symptom.
6. **Fix the root cause.** Reproduce with a failing test or a recorded input first, make the smallest fix, run the repo's gates, ship through the project's pipeline. No retry or sleep to hide a race, no log-level change to hide a line.
7. **Prove the fix on the same signal.** Confirm the new version is running, force the condition that produced the error (the game end, the cron run, the bad payload), and re-watch. A signature is `fixed` only after it is absent across that trigger.
8. **Loop or stop** at step 3 until the clean window or a stop rule fires.

## Decision table

| Observation | Meaning | Action |
|---|---|---|
| Log silent after a redeploy | Stream detached from the new process, or it died | Re-attach to the new instance and check restarts before calling it clean |
| New signature right after a fix | Regression or an unmasked second defect | Reopen; compare against the previous version |
| Same signature after a fix | Fix targeted the wrong cause | Count it against the thrash guard; re-reproduce |
| Error only on one input or instance | Data or node specific | Capture that input as the reproduction |
| Resource limit (OOM, quota, disk) | Environment, not logic | `external` with evidence; propose a limit or queue change to the user |
| Fix needs a destructive or out-of-scope change | Beyond the contract | Halt and report |

## Invocations
```bash
# last 10 minutes, errors grouped, new ones first
kubectl -n NS logs deploy/NAME --since=10m | node .agents/skills/observability/scripts/signatures.mjs --ledger "$LEDGER"
node --test .agents/tools/log-signatures.test.mjs   # the helper's own tests
```

## Gotchas
- A quiet log is not a healthy system: rotation, a restarted pod, or a dead process all produce silence. Check the process, not only the text.
- Following one pod or file misses its replacement; use `--previous` for crash loops and `tail -F` across rotation.
- "Error" misses crashes that print nothing matching; read exit codes and restart counts too.
- Logs hold tokens and personal data; extract the failing lines and mask before quoting.
- Searching the web for an unknown error is fine; verify the answer against the running version before applying it.
- Redeploying to watch is a write on a shared environment: use the declared authorization, not a hand edit on the server.

## Stop rules
- Clean window reached: report the ledger.
- Budget spent, or three failed fixes on one signature: report hypotheses and evidence.
- The next action is destructive, outside the declared environments, or needs credentials you were not given.
- A fix would need to suppress a signal rather than correct it.
