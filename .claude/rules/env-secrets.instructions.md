---
name: env-secrets
description: "Use when handling environment variables, secrets, .env files, or secret rotation practices. Triggers: env vars, secrets, .env, secret rotation, credentials."
applyTo: '**/.env*, **/.gitignore, **/docker-compose*.yml, **/values.yaml'
paths:
  - "**/.env*"
  - "**/.gitignore"
  - "**/docker-compose*.yml"
  - "**/values.yaml"
trigger: glob
globs: "**/.env*,**/.gitignore,**/docker-compose*.yml,**/values.yaml"
---

# Rule: Environment & Secrets Management

> **Mission:** Zero secrets in code. Template everything. Protect at runtime.

## File Structure

```
.env                 # Local development — NEVER commit
.env.local           # Local overrides — NEVER commit
.env.development     # Dev environment
.env.test            # Test environment
.env.example         # Placeholder template — COMMIT THIS
```

## .env.example (COMMIT THIS)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# API Keys — use placeholder values
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx

# Auth
JWT_SECRET=your-secret-key-min-32-chars
SESSION_SECRET=your-session-secret-here

# App
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## .gitignore (MUST HAVE)

```gitignore
.env
.env.local
.env.*.local
*.pem
*.key
*.p12
service-account.json
```

## Validate at Startup with Zod (MANDATORY)

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ENABLE_LOGGING: z.string().transform(v => v === 'true').pipe(z.boolean()).default('false' as never),
});

export const env = envSchema.parse(process.env);
// Throws at startup if any required var is missing or invalid
```

## Security Protocol

1. **Pre-commit:** `git diff --cached --name-only | grep -i '\.env'` to catch staged env files
2. **Secret Scanning:** Run `gitleaks` or `trufflehog` in CI on every push
3. **Never log secrets:** Filter `*_KEY`, `*_SECRET`, `*_TOKEN`, `PASSWORD` fields
4. **Production secrets:** Use a vault (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault)

## Checklist

- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] `.env.example` committed with placeholder values
- [ ] Zod schema validates all required vars at startup
- [ ] App exits with clear error if required vars are missing
- [ ] No secrets appear in logs
- [ ] CI runs secret scanner on every push
