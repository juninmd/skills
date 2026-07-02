---
name: command-safety
applyTo: '**/*.sh, **/Makefile, **/.gitlab-ci.yml, **/Dockerfile, **/docker-compose*.yml'
description: Critical safety rules for executing destructive commands.
---

# Rule: Command Safety
# Priority: CRITICAL
# Description: Prevent data loss and unsafe command execution.

## Restricted Commands
1.  `rm -rf <path>`:
    - **Never** execute without confirming the full path.
    - **Warning**: Avoid unexpanded variables (`rm -rf $VAR/`).
2.  `sudo <cmd>`:
    - Use only when permission is denied or when installing system packages (`apt`).
    - **Never** use `sudo pip` (it can break the system environment).
3.  `pkill <name>`:
    - **Caution**: It can terminate critical processes with similar names.
    - Prefer `kill <pid>` after validating with `ps`.
    - **Alternative**: use `pkill -f <pattern>` carefully.
    - **Signals**: suggest `pkill` or `kill` only when a process is stuck; prefer soft signals (SIGTERM) before force (SIGKILL).
4.  `mv <src> <dest>`:
    - **Move/Rename Guard**: when suggesting `mv` in directories with many files, validate destination to avoid accidental overwrites.
5.  `chmod 777` ou `-R 777`:
    - **Never** use open permissions as a quick fix. Apply least privilege (`755` or `644` as examples).
6.  `git push --force`:
    - **Maximum Alert**: never force-push to `main`/`master` or shared branches. Restrict force pushes to your own development branches.

## Confirmation Protocol
- For batch-destructive commands (`xargs rm`, `find -delete`), always run a dry-run (`echo`) first.
- **Response Protocol**: if a command is dangerous, show it in a separate code block with a clear **SECURITY ALERT** warning.
