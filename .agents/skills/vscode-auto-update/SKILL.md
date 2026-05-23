---
name: vscode-auto-update
description: |
  **MAINTENANCE SKILL** - Automate VS Code updates on Debian/Ubuntu systems.
  USE FOR: VS Code manual updates (.deb), setting up automated update scripts, configuring systemd timers/cron for VS Code, verifying Linux installation.
  DO NOT USE FOR: Windows/macOS updates, non-Debian distros (RedHat/Arch), VS Code extension management, general apt-get troubleshooting.
  INVOKES: apt install, dpkg, systemd-timer, curl.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Debian, Ubuntu (x86_64)"
allowed-tools: [run_shell_command, read_file, write_file]
---

# VS Code Auto-Updater (Linux)

Expert methodology for automating and maintaining Visual Studio Code installations on Debian-based Linux systems through official binary distribution.

**USE FOR:**
- Performing one-off updates from the official Microsoft stable channel.
- Generating and installing robust update automation scripts.
- Configuring daily maintenance schedules using systemd timers or cron.
- Auditing the current VS Code installation and architecture compatibility.

**DO NOT USE FOR:**
- Managing applications in CI environments without sudo access.
- Deploying VS Code to non-x86_64 architectures.

**INVOKES:**
- `apt`, `dpkg`, `curl`, `systemctl` CLI tools.

## Methodology and Guidelines
Implementation details for manual workflows, scripts, and scheduling are documented in:
1. [Installation & Workflow](references/vscode-linux-setup.md)
2. [Scripts & Scheduling](references/vscode-linux-scripts.md)

## Core Principles
1. **Official Only:** Always download from the official Microsoft HTTPS download endpoints.
2. **Safety:** Validate system architecture (`x86_64`) before attempting any installation.
3. **Hygiene:** Ensure temporary artifacts (`.deb` files) are removed immediately after installation.

## Checklist
- [ ] Confirm architecture and distribution compatibility before starting.
- [ ] Ensure `sudo` privileges are available for the install/update step.
- [ ] Verify the installed version with `code --version` post-update.
- [ ] Test any scheduled automation (timer/cron) with a dry-run invocation.
