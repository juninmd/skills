# Data Privacy and Safety Standards

## Goal
Ensure that no sensitive, personal, or corporate-confidential information is leaked through LLM prompts, logs, or command history.

## Rules

### 1. PII Masking (Personal Identifiable Information)
- **Email/Names**: Replace any real email addresses or user names with placeholders like `<USER_EMAIL>` or `<USER_NAME>`.
- **IP Addresses**: Never print or include internal IP addresses (e.g., 10.x.x.x, 192.168.x.x) in prompts unless absolutely necessary for local debugging.
- **Passwords/Tokens**: NEVER read files containing secrets (like `.env`, `.pem`, `id_rsa`) unless explicitly asked and the purpose is purely local.

### 2. Context Isolation
- When executing `run_shell_command`, avoid commands that output excessive environment variables (like `env` or `printenv`).
- If you find a secret (API Key, JWT, Password) during a file read, you MUST immediately notify the user and suggest adding it to `.gitignore` or `.env`.

### 3. Redaction in Logs
- All logs produced by skills must be sanitized.
- Personal file paths (e.g., `C:\Users\jr_ac\...`) should be redacted to `~\...` when possible to avoid leaking local system usernames.

### 4. Zero Trust in Prompts
- Do not assume that the LLM backend is private. Treat every prompt as potentially public if it's sent to an external API (like Gemini API, OpenAI, etc.).

## Verification
- Periodically run a scan for secrets using `gitleaks` or a similar tool.
- Audit your `.gitignore` to ensure it contains:
  - `.env`
  - `*.pem`
  - `id_rsa`
  - `node_modules/`
  - `coverage/`
