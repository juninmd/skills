---
name: agy-image-babysitter
description: |
  Keep an agy (Antigravity CLI) conversation generating images unattended: relaunch the headless loop 90s after a 401 token expiry and sleep until quotaResetTimeStamp after a 429. Use when asked to "deixar o agy gerando", resume image generation for meu-livro or another project after quota, or reactivate the "babá do agy".
license: MIT
metadata:
  version: 1.1.0
compatibility: windows (PowerShell 7); agy CLI logged in
---

# agy image babysitter

Runs `babysitter.ps1` (this folder) in the background: a loop that relaunches
`agy --conversation <id> --print "<prompt>" --dangerously-skip-permissions --print-timeout 10h`
and handles the two known deaths.

**Not this skill:** generating images yourself, or any non-agy automation (`tooling-dev`).

## Preflight
```powershell
Get-ChildItem "$HOME\.gemini\antigravity-cli\conversations\*.db" | Sort-Object LastWriteTime | Select-Object -Last 1   # newest conversation of the project
agy agentapi get-conversation-metadata          # alternative (see memory agy-antigravity-cli)
Get-Process agy -ErrorAction SilentlyContinue   # another interactive agy open? it renews the OAuth token cache
```
For meu-livro: ConversationId `654dc9ba-4469-468e-8ee6-9e11c7198776`, ProjectDir `D:\Solutions\pessoal\meu-livro`.

## Workflow
1. Find the conversation id (Preflight).
2. Launch in the background from the session shell (PowerShell tool, `run_in_background: true`); `<skill-dir>` is where this skill is installed, for example `$HOME\.claude\skills\agy-image-babysitter`:
```powershell
& "$env:LOCALAPPDATA\Programs\PowerShell\7\pwsh.exe" -NoProfile -ExecutionPolicy Bypass -File "<skill-dir>\babysitter.ps1" -ConversationId <id> -ProjectDir <project-folder>
```
3. Arm a stall Monitor: 30+ min without a new image in the output directory → alert with the error from `cli.log`.
4. Pass `-Prompt` when the default prompt does not apply. The default prompt says: continue from the exact point, save to the canonical paths, and send each image on Telegram (credentials in the project `.env`).

| Symptom | Action |
|---|---|
| 401 UNAUTHENTICATED (access token lives ~1h; agy does not refresh it in print mode) | script relaunches in 90s; the relaunch picks up a fresh token from the cache |
| 429 RESOURCE_EXHAUSTED | script reads `quotaResetTimeStamp` from `~/.gemini/antigravity-cli/cli.log`, sleeps until reset + 5 min, relaunches |
| Short quota (~3-4h, ~18 images) vs long quota (weekly, ~143h) | both handled identically by the script |
| No new image for 30+ min | Monitor alerts; read the last error in `cli.log` |
| Claude session ended | the process dies with it; relaunch in the new session if generation is not finished |
| Script exits after 100 relaunches with generation unfinished | `-MaxRounds` defaults to 100 (see `babysitter.ps1`); the loop stops there even if quota and auth are fine | Pass a higher `-MaxRounds` up front for a long unattended run, or relaunch once more when the Monitor reports the process has exited |

## Stop
- A paid provider is proposed: zero cost is the user's rule. This flow uses only the free Google plan quota.
- Task Scheduler launch: never. It starts without full auth and dies in 401 with no progress. Launch from the session shell.
- Free alternative without agy (meu-livro): `.venv-gpu\Scripts\python.exe -m scripts.generate_missing_scenes` (local GPU → ZeroGPU → Pollinations, sends Telegram itself).

## Rules
- Keep another interactive agy open (any project): it renews the OAuth token in the cache.
- Never print or copy the `.env` contents; the script reads the Telegram credentials itself.
- The babysitter dies with the Claude session; relaunch when opening a new session if generation is unfinished.

## Checklist
- [ ] babysitter running in the background with the right conversation id and project dir
- [ ] stall Monitor armed (30 min)
- [ ] another interactive agy open for token renewal
- [ ] no paid provider, no Task Scheduler
