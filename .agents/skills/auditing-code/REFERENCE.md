# Code Auditor Referência 📚
## Tools

### 1. `run_shell_command`
**Description:** Executes shell commands, useful for running linters and security scanners.
**Usage:**
- Use concise commands.
- Redirect output to temporary files if large.
- Example: `pylint my_script.py`
- Example: `bandit -r .`
- Example: `eslint src/**/*.js`

### 2. `search_file_content`
**Description:** Searches file content for specific patterns using `ripgrep`.
**Parameters:**
- `pattern` (string): The regex pattern to search for.
- `dir_path` (string): The directory to search within.
**Usage:**
- Use specific regex patterns to find potential vulnerabilities.
- Example: `search_file_content(pattern="eval\(", dir_path="src/")` (Finds usage of `eval`)
- Example: `search_file_content(pattern="password\s*=\s*['"]", dir_path="config/")` (Finds hardcoded passwords)

### 3. `read_file`
**Description:** Reads the content of a file.
**Parameters:**
- `file_path` (string): Path to the file to read.
**Usage:**
- Use to examine code context around a finding.
- Verify if a flagged issue is a false positive.

