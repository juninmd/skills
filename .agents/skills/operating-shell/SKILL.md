---
name: operating-shell
description: Fundamental system and security operations in the Linux/Unix terminal.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[command/script] [options]"
disable-model-invocation: true
---

# Shell Core & Safety

This skill manages navigation, file manipulation, and command execution in the operating system, prioritizing security and efficiency.

## Flow

### 1. Construct Command
- **Chaining:** Use pipes `|` to connect commands (e.g., `grep | sort`).
- **Redirection:** Use `>` to save output to temporary files and avoid terminal flood.
- **Background:** Use `&` for long-running processes, but monitor the PID.

### 2. Safety Review (Dry Run)
- **Destructive Commands:** Before `rm`, `mv`, or `dd`, double-check the target.
- **Simulation:** Whenever possible, use "dry run" flags (e.g., `rsync --dry-run`, `make --dry-run`).
- **Sudo:** Avoid implicit `sudo`. If necessary, explain the reason.

### 3. Execution & Troubleshooting
- **Exit Codes:** Check `$?` after execution (0 = success).
- **Efficiency:** Use silent flags (`-q`, `--quiet`) in verbose commands to save tokens.

## Common Tools
- **Find:** `find . -name "*.log" -type f` (Precise location).
- **Grep:** `grep -r "pattern" .` (Content search).
- **Process:** `ps aux | grep <name>` and `kill <PID>` (Process management).
- **Network:** `curl -v <url>` (Connectivity debugging).

## Best Practices
- **Token Efficiency:** Redirect long outputs to files (`cmd > /tmp/log.txt`) and read only what's necessary (`head -n 20 /tmp/log.txt`).
- **Security:** Never hardcode passwords or API keys in commands. Use environment variables (`$MY_SECRET`).
- **Cleanliness:** Remove temporary files after use.
