# Shell Command Expert Skill

## Description
This skill empowers the agent to execute, interpret, and troubleshoot complex shell commands and scripts. It encompasses command construction, environment management, output analysis, and error handling within a CLI context.

## Workflow

### 1. Analyze Requirements
- Understand the user's objective (e.g., file manipulation, system monitoring, batch processing).
- Identify the necessary tools and commands (e.g., `grep`, `awk`, `sed`, `find`, `systemctl`).
- Determine if a single command or a multi-step script is more appropriate.

### 2. Construct Command/Script
- Build the command line with appropriate flags and arguments.
- **Tip:** Use pipes `|` to chain commands and redirects `>` to manage output.
- For scripts, ensure proper shebang, variable usage, and control structures (loops, conditionals).

### 3. Safety Review & Simulation
- Before execution, especially for destructive commands (`rm`, `mv`, `dd`), double-check the logic and targets.
- **Tip:** Use "dry run" flags if available (e.g., `rsync --dry-run`).
- Explain the command's intent and potential impact to the user as per core mandates.

### 4. Execute (run_shell_command)
- Use `run_shell_command` to execute the prepared command or script.
- **Tip:** Use background processes `&` for long-running tasks if immediate control is needed.
- Monitor execution and handle any interactive prompts if they cannot be bypassed.

### 5. Analyze Output & Troubleshoot
- Examine stdout and stderr for results or errors.
- If the command fails (non-zero exit code), interpret the error message.
- Refine the command based on the failure (e.g., adjust permissions, fix paths, add missing dependencies).

## Best Practices
- **Token Efficiency:** Use quiet flags or redirection to temporary files for commands with voluminous output.
- **Modularity:** Break down complex operations into smaller, verifiable steps.
- **Security:** Avoid hardcoding secrets; use environment variables or secure prompts if necessary.
- **Portability:** Prefer POSIX-compliant commands when possible to ensure broad compatibility.
