---
name: security-and-privacy
description: Unified security, secrets management, and data privacy (LGPD) rules.
applyTo: '**/*.env,**/*.env.example,**/.gitignore,**/*.py,**/*.ts,**/*.js,**/*.sql,**/*.md'
---

# Rule: Security and Privacy

## 1. Environment and Secrets
- **No Secrets in Code**: Never commit `.env`, keys, or tokens. Use `.gitignore`.
- **Templates**: Maintain `.env.example` with placeholders.
- **Retrieval**: Prefer runtime retrieval (GCP Secret Manager).
- **Audit**: Check `git diff --cached` for accidental secret staging.

## 2. Data Privacy (LGPD)
- **Classification**: Identify personal/sensitive fields in models.
- **Minimization**: Collect only what is strictly necessary.
- **Protection**: Encrypt sensitive data at rest and in transit.
- **Logs**: Redact/anonymize sensitive data in logs. **No PII in logs**.
- **Subject Rights**: Support access, correction, and deletion flows.

## 3. Protocol
- If an `export TOKEN=...` is suggested, add a history persistence warning.
- Block flow if `.env` is detected in staging.
