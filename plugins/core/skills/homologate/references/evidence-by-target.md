# Evidence by target

Open the row for the target in play. Each lists how to read the running version, how to trigger for real, and where the proof lives. Replace placeholders; commands that create or restart things are writes and need authorization.

## Contents
- Service over HTTP
- Scheduled job
- Chat or notification bot
- UI, desktop, or mobile app
- Game server or mod
- Data pipeline

## Service over HTTP
```bash
curl -fsS "$BASE/version"                                   # or the image tag below
kubectl -n NS get deploy NAME -o jsonpath='{.spec.template.spec.containers[*].image}'
curl -fsS -o /dev/null -w '%{http_code} %{time_total}s\n' "$BASE/real/path"
```
Proof: the response body of the real route, not `/health`. Include one 4xx on bad input.

## Scheduled job
```bash
kubectl -n NS get cronjob NAME -o jsonpath='{.spec.jobTemplate.spec.template.spec.containers[*].image}'
kubectl -n NS create job --from=cronjob/NAME NAME-homolog-$(date +%s)   # write: confirm first
kubectl -n NS wait --for=condition=complete job/NAME-homolog-... --timeout=300s
kubectl -n NS logs job/NAME-homolog-... --tail=40
```
Proof: the artifact the job produces (message, row, file), not the job's exit code. Delete the manual job afterwards. Without a cluster: run the job's entry command once, then once more for idempotency.

## Chat or notification bot
Proof lives in the channel. Read it back with the platform API or have the owner confirm a screenshot; the bot's "message sent" log is not evidence. Test with a private chat first; check formatting, language, accents, and that dedupe prevents a second identical send on rerun.

## UI, desktop, or mobile app
Drive the real build, not the dev server, and capture a screenshot of the state after the action. For web, use the browser MCP or Playwright against the deployed URL and quote the console errors count (expected zero). Check keyboard path and a failure state (offline, empty data).

## Game server or mod
```bash
rg -ni "error|fail|crash|segfault|bad plugin" server.log | tail -n 20   # after the scenario, not before
```
Proof: the scenario played through to the end (round finishes, map changes, player disconnects) with no new error lines and the process still up. Crashes often appear only after the trigger event, so force it.

## Data pipeline
Count and sample at the destination: row count against the source window, a null/duplicate check, and the newest timestamp. Rerun the same window and confirm the count is unchanged.
