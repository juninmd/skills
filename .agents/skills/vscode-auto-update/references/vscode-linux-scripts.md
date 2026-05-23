# VS Code Update Scripts and Scheduling

Robust automation for maintaining VS Code on Linux.

## 1. Robust Updater Script
Save as `/usr/local/bin/vscode-auto-update.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
if [ "$(uname -m)" != "x86_64" ]; then exit 1; fi
TMPDIR="$(mktemp -d)"
OUT="$TMPDIR/code_latest_amd64.deb"
trap 'rm -rf "$TMPDIR"' EXIT
curl -fsSL -o "$OUT" "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"
sudo apt install -y "$OUT"
code --version
```

## 2. Scheduling with Systemd
Prefer timers for randomized execution.
- **Service:** `/etc/systemd/system/vscode-auto-update.service`
- **Timer:** `/etc/systemd/system/vscode-auto-update.timer`
```ini
[Timer]
OnCalendar=*-*-* 12:00:00
RandomizedDelaySec=1h
```

## 3. Scheduling with Cron
`0 12 * * * /usr/local/bin/vscode-auto-update.sh >/var/log/vscode-auto-update.log 2>&1`
