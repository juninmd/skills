#!/usr/bin/env bash
set -euo pipefail

LOG="/var/log/vscode-auto-update.log"
mkdir -p "$(dirname "$LOG")"

echo "$(date -Iseconds) - Starting vscode-auto-update" >> "$LOG"

if ! command -v apt-get >/dev/null 2>&1; then
  echo "apt-get not found; aborting" >> "$LOG"
  exit 1
fi

echo "$(date -Iseconds) - apt-get update" >> "$LOG"
apt-get update -y >> "$LOG" 2>&1 || true

if dpkg -s code >/dev/null 2>&1; then
  echo "$(date -Iseconds) - Upgrading 'code' package" >> "$LOG"
  apt-get install -y --only-upgrade code >> "$LOG" 2>&1 || apt-get install -y code >> "$LOG" 2>&1
else
  echo "$(date -Iseconds) - Installing 'code' package" >> "$LOG"
  apt-get install -y code >> "$LOG" 2>&1
fi

if command -v code >/dev/null 2>&1; then
  echo "$(date -Iseconds) - Installed version: $(code --version | head -n1 2>/dev/null || echo 'unknown')" >> "$LOG"
else
  echo "$(date -Iseconds) - 'code' command not found after install" >> "$LOG"
fi

echo "$(date -Iseconds) - Completed" >> "$LOG"
