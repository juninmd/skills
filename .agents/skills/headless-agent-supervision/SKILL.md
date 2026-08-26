---
name: headless-agent-supervision
description: |
  Keep a long-running headless CLI agent alive across an expiring access token, an exhausted provider quota, and a silent stall. Use for supervising an unattended batch run and for relaunch-on-401, sleep-until-reset-on-429 loops.
license: MIT
---

# Supervising a headless agent run

## Preflight
```bash
"$AGENT" --version && "$AGENT" --help | grep -iE 'print|timeout|conversation'  # non-interactive mode exists?
ls -t "$LOG_DIR"/*.log | head -1                                               # where the real error text lands
ls -t "$OUT_DIR" | head -3                                                     # current progress marker
```

A headless run needs three things settled before it starts: how it resumes without redoing work, where its errors are actually written, and what observable output proves it is still progressing. Missing the third turns every failure into a silent one.

## Failure table

| Symptom | Cause | Response |
|---|---|---|
| `401 UNAUTHENTICATED` after roughly an hour | access token expired; many CLIs do not refresh in non-interactive mode | relaunch after a short delay so it picks up a fresh token from the credential cache |
| `429 RESOURCE_EXHAUSTED` | provider quota exhausted | parse the reset timestamp from the log, sleep past it with a margin, relaunch |
| 429 that returns immediately after the reset | a second, longer quota window sits behind the short one | treat both the same way: obey whatever reset time the log reports |
| No output and no error for a long stretch | stalled run | fail the watchdog on output age, not on process liveness — a hung process is still alive |
| Dies instantly, no progress, every attempt | launched without a full session context | launch from an authenticated interactive shell, not a background scheduler |

## Workflow
1. Make the job resumable: it must continue from the last completed item, so a relaunch never redoes finished work.
2. Wrap the invocation in a supervisor loop that classifies the exit rather than blindly retrying.
3. On auth failure, wait briefly and relaunch; the delay exists so a refreshed credential lands first.
4. On quota exhaustion, read the reset timestamp out of the log, sleep until it plus a margin, then relaunch.
5. On an unclassified exit, back off and cap the attempts. Endless relaunch of a deterministic failure burns quota for nothing.
6. Watch output age separately from the loop and alert with the last log lines when it goes stale.
7. Record the run boundary: the supervisor dies with its shell, so a new session must be able to tell whether the job finished.

```bash
attempt=0
while :; do
  "$AGENT" --resume "$JOB_ID" --print "$PROMPT" --timeout 10h >>"$RUN_LOG" 2>&1 && break
  if   grep -q 'RESOURCE_EXHAUSTED' "$RUN_LOG"; then
    reset=$(grep -oiE '"[a-z]*resettime[^"]*":"[^"]*"' "$RUN_LOG" | tail -1 | cut -d'"' -f4)
    sleep "$(( $(date -d "$reset" +%s) - $(date +%s) + 300 ))"; attempt=0
  elif grep -q 'UNAUTHENTICATED' "$RUN_LOG"; then
    sleep 90; attempt=0
  else
    attempt=$((attempt+1)); [ "$attempt" -ge 5 ] && break; sleep $((30 * attempt))
  fi
done
```

## Stop
- The same unclassified error repeats past the attempt cap. Report it with the log excerpt; a supervisor is not a fix for a broken job.
- Output is stale past the watchdog threshold. Report the stall rather than killing and relaunching blindly — a partially written artifact can be worse than a stopped run.
- The job is not resumable. Fix that first; supervising a non-resumable job multiplies cost on every relaunch.
- The run would move onto a paid tier to get past a quota wall. That is the user's call, never the supervisor's.

## Rules
- Classify the exit before retrying. Retry-on-anything is how a loop burns a whole quota window on a typo.
- Sleep to the provider's reported reset time, never to a guessed interval.
- Watchdog on output age, not process liveness.
- Launch from the session shell where credentials are live; a detached scheduler task typically starts without full auth and dies on the first call with no progress.
- The supervisor is bound to the session that started it. Say so, and re-check on the next session instead of assuming it survived.
- Bound every wait and every attempt count — see `shell-operations`. Designing the agent loop itself is `agent-engineering`.

## Checklist
- [ ] job resumes from the last completed item
- [ ] auth failure and quota exhaustion handled distinctly, not as one retry
- [ ] quota sleep derived from the log's reset timestamp plus a margin
- [ ] unclassified failures backed off and capped
- [ ] watchdog on output age, alerting with the log excerpt
- [ ] completion state discoverable by a later session
