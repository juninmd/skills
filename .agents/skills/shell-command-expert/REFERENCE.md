# Shell Command Expert Reference

## Tools

### 1. `run_shell_command`
**Description:** Executes a given shell command as `bash -c <command>`.
**Parameters:**
- `command` (string): Exact bash command to execute.
- `description` (string): Brief description of the command for the user.
- `dir_path` (string, optional): The path of the directory to run the command in.
**Usage:**
- Use for any CLI-based task: file management, git operations, system checks, etc.
- **Tip:** Chain commands with `&&` or `;` for sequential execution.
- **Tip:** Use `2>&1` to capture both stdout and stderr in the output.
- **Background Processes:** Append `&` to run a process in the background. Note that you must manage these processes (e.g., using PIDs).

### 2. Common CLI Utilities
- **`grep` / `ripgrep` (`rg`):** Search for patterns in text/files.
- **`find` / `fd`:** Find files in the filesystem.
- **`sed` / `awk`:** Stream editing and text processing.
- **`curl` / `wget`:** Transfer data from or to a server.
- **`tar` / `zip` / `unzip`:** Archive and compress files.
- **`ps` / `top` / `htop`:** Monitor system processes.
- **`chmod` / `chown`:** Manage file permissions and ownership.

## Shell Features
- **Pipes (`|`):** Connect the stdout of one command to the stdin of another.
- **Redirection (`>`, `>>`, `<`):** Redirect input and output to/from files.
- **Variables:** Use `$VAR` to access environment variables or script-defined variables.
- **Command Substitution:** Use `$(command)` to use the output of a command as an argument.
- **Control Structures:** `if`, `for`, `while`, `case` for complex logic.
