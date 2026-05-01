---
name: vscode-auto-update
description: "Auto-update VS Code on Debian/Ubuntu. Triggers: vscode, update."
argument-hint: "[options]"
disable-model-invocation: true
---

# Objective

Automate updating Visual Studio Code on Debian/Ubuntu x86_64 by downloading the official `.deb` and installing it reliably.

# When to use

- Perform a one-off update from the official stable download link.
- Schedule automatic updates via `systemd` timer or `cron`.
- Install a specific `.deb` on isolated machines without adding the Microsoft APT repository.

# Prerequisites

- Debian/Ubuntu x86_64.
- `curl` or `wget`.
- `sudo` with privilege to install packages.
- `apt` (recommended) or `dpkg`.
- Sufficient temporary disk space for downloads.

# Workflow

1. Validate architecture with `uname -m`.
2. Download the official `.deb` from the stable URL.
3. Install using `sudo apt install -y ./file.deb` (preferred) or `sudo dpkg -i ./file.deb` then `sudo apt-get install -f -y`.
4. Verify the installation with `code --version`.

# Recommended single-command example

```
curl -L -o /tmp/code_latest_amd64.deb "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"
sudo apt install -y /tmp/code_latest_amd64.deb
rm -f /tmp/code_latest_amd64.deb
code --version
```

# Example robust script

Save as `/usr/local/bin/vscode-auto-update.sh` and make it executable (`sudo chmod +x /usr/local/bin/vscode-auto-update.sh`):

```
#!/usr/bin/env bash
set -euo pipefail

if [ "$(uname -m)" != "x86_64" ]; then
  echo "Unsupported architecture: $(uname -m)"
  exit 1
fi

TMPDIR="$(mktemp -d)"
OUT="$TMPDIR/code_latest_amd64.deb"
trap 'rm -rf "$TMPDIR"' EXIT

echo "Downloading VS Code..."
curl -fsSL -o "$OUT" "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"

echo "Installing..."
sudo apt install -y "$OUT"

echo "Installation complete. Installed version:"
code --version
```

# Scheduling (recommended)

Prefer a `systemd` timer on modern Ubuntu systems.

Systemd timer (daily at 12:00, randomized up to 1 hour):

- Service: `/etc/systemd/system/vscode-auto-update.service` (`ExecStart=/usr/local/bin/vscode-auto-update.sh`)
- Timer: `/etc/systemd/system/vscode-auto-update.timer` (`OnCalendar=*-*-* 12:00:00`, `RandomizedDelaySec=1h`)

Cron equivalent (daily at 12:00):

```
0 12 * * * /usr/local/bin/vscode-auto-update.sh >/var/log/vscode-auto-update.log 2>&1
```

# Security & recommendations

- Always download from the official HTTPS URL.
- For managed fleets, prefer configuring the official Microsoft APT repository so `apt` and `unattended-upgrades` can manage updates. Use the provided `install-vscode-repo.sh` artifact to add keys and the source list.

# Acceptance criteria

- `code --version` reports the installed version.
- `dpkg -l code` shows the `code` package and correct architecture.
- The updater script exits with code `0` on success.

# Branching / decisions

- If package dependencies are missing, run `sudo apt-get install -f -y`.
- In CI environments or systems without `sudo` this skill is not applicable.
- Abort if architecture is not `x86_64`.

# Open questions

1. Should the skill automatically install and enable the systemd timer, or only provide artifacts and instructions?
2. Prefer `systemd timer` or `cron` as the default scheduler?
3. Should we remove `RandomizedDelaySec` to run exactly at 12:00?

# Example prompts

- "Download and install the latest VS Code now."
- "Generate the updater script and enable a daily systemd timer at 12:00."
- "Show manual commands only."

# Artifacts referenced

- `/usr/local/bin/vscode-auto-update.sh`
- `/etc/systemd/system/vscode-auto-update.service`
- `/etc/systemd/system/vscode-auto-update.timer`
- `/var/log/vscode-auto-update.log`

## Checklist

- [ ] Confirm the target distro, architecture, and privilege model before installing packages.
- [ ] Prefer the official repository path for managed machines and the `.deb` path for isolated hosts.
- [ ] Verify `code --version` after installation or scheduled automation changes.

## References

- [VS Code on Linux](https://code.visualstudio.com/docs/setup/linux)
- [systemd.timer](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html)

