# Log sources

Pick the row for the system under watch. Always bound the read (`--since`, `--tail`, `-n`) and pipe through the signature helper instead of dumping the stream. The health check column is what step 3 uses to catch a silent death.

## Contents
- Kubernetes
- Docker
- systemd and plain files
- Windows
- CI runs

## Kubernetes
```bash
kubectl -n NS logs deploy/NAME --since=10m --tail=500
kubectl -n NS logs POD --previous --tail=200                # crash loop
kubectl -n NS get pods -l app=NAME -o wide                  # health: restarts, age
kubectl -n NS get pod POD -o jsonpath='{.status.containerStatuses[*].lastState.terminated.reason}'   # OOMKilled?
kubectl -n NS get events --sort-by=.lastTimestamp | tail -n 15
```
A rollout replaces the pod: re-run the `get pods` health check after every deploy.

## Docker
```bash
docker logs --since 10m --tail 500 NAME
docker inspect -f '{{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}' NAME
```

## systemd and plain files
```bash
journalctl -u UNIT --since "10 min ago" --no-pager | tail -n 500
systemctl is-active UNIT
tail -n 500 /path/server.log      # use tail -F to survive rotation
```

## Windows
```powershell
Get-Content .\server.log -Tail 500
Get-Content .\server.log -Wait -Tail 0     # live follow; run bounded or in the background
Get-Process NAME -ErrorAction SilentlyContinue | Select-Object Id,StartTime,WorkingSet64
```
Pipe PowerShell output to `node signatures.mjs`; check the file encoding if accents arrive garbled.

## CI runs
```bash
gh run list --limit 5 --json databaseId,status,conclusion,headSha
gh run view RUN_ID --log-failed | rg -ni "error|fail" | head -n 40
```
Seconds-long failures with empty steps usually mean a structural break (quota, runner, billing); confirm that before reading the diff.
