---
name: portkill
description: |
  Find and free TCP ports held by running processes, cross-platform. Use for EADDRINUSE errors, dev-server port conflicts, and killing the listener on a given port on Windows, macOS, or Linux. Trigger on 'port in use', 'address already in use', 'EADDRINUSE', 'kill process on port 3000', 'port is busy', 'what process listens on this port'.
---

# Port Kill

**Not this skill:** debugging why a service did not start (`backend-systems`), or watching logs during an incident (`observability`).

## Preflight
```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object LocalAddress,OwningProcess
```
```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Confirm something actually listens on the port before killing anything — the PID is the evidence.

## Workflow
1. Run the helper to list the PIDs listening on the port; verify they are the process you expect, not a system service or another dev's process.
2. Show the process name for each PID (`ps`/`Get-Process`) before terminating. Killing an unknown PID is the failure mode this skill exists to prevent.
3. Terminate with a graceful signal first: `--force` only when the port is still taken after a TERM, or on Windows where the toolchain offers no TERM.
4. Re-check the port is free after the kill; exit 0 only when it was freed or already free.
5. If the same PID returns after being killed, the owner is a process manager (Docker, launchd, Windows service, PM2): kill the owner, not the child — killing only the child races the restart loop.

## Decision table

| OS | List listener | Graceful kill | Force kill |
|---|---|---|---|
| Windows | `Get-NetTCPConnection -LocalPort P -State Listen` | n/a (no TERM for arbitrary PIDs) | `taskkill /PID P /F` |
| macOS | `lsof -nP -iTCP:P -sTCP:LISTEN` | `kill P` (SIGTERM) | `kill -9 P` |
| Linux | `ss -ltnp 'sport = :P'` or `lsof` | `kill P` (SIGTERM) | `kill -9 P` |
| Any, scripted | `node scripts/portkill.mjs P --list` | `node scripts/portkill.mjs P` | `node scripts/portkill.mjs P --force` |

## Real command block

```bash
node scripts/portkill.mjs 3000 --list   # show PID(s), kill nothing
node scripts/portkill.mjs 3000          # graceful terminate
node scripts/portkill.mjs 3000 --force  # hard kill (taskkill /F on Windows)
```

Script behaviors that matter: only LISTEN-state sockets on the target port; ignores ESTABLISHED/UDP noise; skips its own PID (the script never kills the agent running it); exit 0 when the port is free, 1 when a kill failed or the port outlived the kill.

## Stop
- The PID is a system process (PID 4 on Windows, root-owed daemons) or a system service name you cannot identify. Escalate instead of force-killing.
- The port belongs to a remote/mapped service (WSL port relay, Docker published port). Kill the container or the feature is relaunching in seconds.
- You are inside a WSL/Docker Devcontainer session and the port shows on the host. Run the commands in the correct namespace first.

## Rules
- Never kill a PID without printing its process name first.
- `--force` needs a justification: the graceful kill failed, or the OS has no graceful path for that PID.
- Never kill more than one port per command run as a batch "cleanup" without listing every owner first.
- Debugging the app itself hands off to `backend-systems`; CI port conflicts hand off to `cloud-devops`.

## Checklist
- [ ] Listener listed before any kill, process name shown.
- [ ] Graceful signal attempted before `--force` (or absence documented).
- [ ] Port verified free after the kill.
- [ ] Own PID and system-critical PIDs excluded.
