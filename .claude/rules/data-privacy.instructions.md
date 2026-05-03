---
name: data-privacy
description: "Use when handling PII, masking secrets, isolating context, or reviewing privacy-sensitive data flows. Triggers: PII, data privacy, secret detection, GDPR, redact sensitive data."
applyTo: '**/*'
paths:
  - "**"
trigger: always_on
---

# Rule: Data Privacy & AI Safety

> **Mission:** Protect user data. Trust nothing. Sanitize everything.

## PII — What to Redact

| Type | Example | Mask |
|---|---|---|
| Email | `john@example.com` | `<EMAIL>` |
| Name | `John Doe` | `<USER_NAME>` |
| IP Address | `192.168.1.1` | `<IP>` |
| API Key | `sk-proj-xxxxx` | `<API_KEY>` |
| JWT Token | `eyJhbGci...` | `<TOKEN>` |
| Phone | `+1-555-123-4567` | `<PHONE>` |
| SSN / CPF | `123-45-6789` | `<SSN>` |
| Credit Card | `4111-1111-1111-1111` | `<CARD>` |
| File Path | `C:\Users\john_doe\...` | `~\...` |

## Automatic Sanitization in Logs

```typescript
const SENSITIVE_PATTERNS = [
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '<EMAIL>' },
  { pattern: /sk-[a-zA-Z0-9]{48}/g, replacement: '<API_KEY>' },
  { pattern: /Bearer\s+[a-zA-Z0-9._-]+/g, replacement: 'Bearer <TOKEN>' },
  { pattern: /password["'\s:=]+[^\s"']+/gi, replacement: 'password=<REDACTED>' },
];

export function sanitize(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return SENSITIVE_PATTERNS.reduce((s, { pattern, replacement }) => s.replace(pattern, replacement), obj);
  }
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitize(v)]));
  }
  return obj;
}
```

## Context Isolation — When Using AI Assistants

1. **Never paste real user data** — summarize patterns, use fake data
2. **Use placeholders**: `<USER_EMAIL>`, `<ORDER_ID>`, `<USER_NAME>`
3. **Sanitize before sharing** — run through sanitize() before pasting logs
4. **Treat every prompt as potentially public** — even "private" assistants may log

```bash
# ❌ Exposes all env vars
env | grep API

# ✅ Only what's needed
echo "API_URL=$API_URL"
```

## Secret Detection in CI

```bash
# Scan before committing
gitleaks detect --source . --verbose

# As a pre-commit step
bunx gitleaks protect --staged --fail
```

## .gitignore Essentials

```gitignore
.env
.env.local
.env.*.local
*.pem
*.key
*.p12
service-account.json
```

## Checklist

- [ ] `gitleaks` or `trufflehog` runs in CI on every push
- [ ] All logs pass through `sanitize()` before writing
- [ ] No PII in variable names, comments, or test fixtures
- [ ] `.gitignore` covers all secret file patterns
- [ ] File paths redacted in user-facing error messages

## Data Privacy (LGPD / GDPR)

- **Classification:** Identify personal/sensitive fields in all data models
- **Minimization:** Collect only what is strictly necessary for the feature
- **Protection:** Encrypt sensitive data at rest and in transit
- **Logs:** Never log PII — redact/anonymize before writing to any log sink
- **Subject Rights:** Support access, correction, and deletion flows for user data
