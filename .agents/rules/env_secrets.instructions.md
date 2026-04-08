---
name: env-secrets
description: Protocol for environment variable management and sensitive information protection.
applyTo: '**/.env*, **/.gitignore, **/docker-compose*.yml, **/values.yaml, **/*.{ts,js,py,go,java}'
---

# Rule: Environment & Secrets
# Identifier: env_secrets

## Description
Protocol for environment variable management and protection of sensitive information.

## Detected Practices
- Usage of `.env` files for local configuration.
- References to secrets from GCP and GitLab CI.

## Rules
1. **No Secrets in Code**: NEVER commit `.env` files, service account `.json` keys, or tokens. These files MUST be in `.gitignore`.
2. **Environment Templates**: always maintain an up-to-date `.env.example` with required keys and safe placeholder values.
3. **Loading Protocol**: when starting a script or service, validate required environment variables and emit a clear error if any are missing.
4. **Secret Retrieval**: prefer runtime secret retrieval (for example, GCP Secret Manager) instead of storing secrets in plain-text files.

## Security Protocol
1. **Gitignore Audit**: before any `git add` or `git commit`, confirm that `.env`, `.key`, `.json` (service accounts), and `.pem` files are listed in `.gitignore`.
2. **Explicit Exclusion**: if environment files are not ignored, add them immediately to `.gitignore`.
3. **Pre-Commit Check**: inspect staged files (`git diff --cached --name-only`) to ensure no secret was accidentally added.
4. **Variable Warning**: if an `export TOKEN=...` command is suggested, include an immediate warning: "Do not persist this command in shell history if the token is sensitive."
5. **Commit Prevention**: if a `.env` file is detected in staging, block the flow, alert the user, and suggest `git reset HEAD <file>`.
