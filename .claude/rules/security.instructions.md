---
name: security
description: "Use when validating inputs, reviewing auth, handling secrets, or applying OWASP-aligned security controls. Triggers: security, OWASP, input validation, auth middleware, secret protection, SQL injection, XSS."
applyTo: '**/*.{ts,tsx,js,jsx},**/*.py,**/*.sql'
paths:
  - "**/*.{ts,tsx,js,jsx}"
  - "**/*.py"
  - "**/*.sql"
trigger: glob
globs: "**/*.{ts,tsx,js,jsx},**/*.py,**/*.sql"
---

# Rule: Security

> **Mission:** Zero vulnerabilities. Validate everything. Trust nothing.

## Input Validation — Zod (MANDATORY)

```typescript
const UserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).trim(),
});

const result = UserSchema.safeParse(req.body);
if (!result.success) throw new ValidationError('Invalid input', result.error.flatten());
```

Never use `req.body as any` — always parse through a schema.

## Secret Management

```typescript
// ✅ Environment variables
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error('OPENAI_API_KEY is required');

// ❌ Hardcoded — VIOLATION
const apiKey = 'sk-proj-xxxxx';
```

## SQL Injection Prevention

```typescript
// ✅ Parameterized
await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ String interpolation — SQL INJECTION
await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

## Authentication & Authorization

```typescript
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError();
  req.user = await verifyToken(token);
  next();
}

function requirePermission(permission: string) {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) throw new ForbiddenError();
    next();
  };
}

router.delete('/users/:id', requireAuth, requirePermission('users:delete'), deleteUser);
```

## XSS Prevention

```tsx
// ✅ React escapes by default
<div>{userInput}</div>

// ❌ Never
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## OWASP Top 10 Coverage

| OWASP | Prevention |
|---|---|
| A01 Broken Access Control | Auth middleware + permission checks |
| A02 Cryptographic Failures | HTTPS only, secure cookies, no MD5/SHA1 |
| A03 Injection | Parameterized queries, Zod validation |
| A04 Insecure Design | Threat modeling, secure defaults |
| A05 Security Misconfiguration | Hardened configs, minimal exposure |
| A06 Vulnerable Components | `bun audit` + Dependabot in CI |
| A07 Auth Failures | Secure session management |
| A08 Data Integrity | Signed tokens, integrity checks |
| A09 Logging Failures | Structured logs + alerting |
| A10 SSRF | URL validation, allowlist for fetch |

## Security Response Protocol

```
1. STOP if vulnerability found
2. Fix CRITICAL issues before continuing
3. Rotate any exposed secrets immediately
4. Document in security-incident.md
```

## Secret Staging Guard

```bash
# Before every commit — block accidental secret staging
git diff --cached | grep -E "(SECRET|TOKEN|PASSWORD|API_KEY|sk-)" && echo "⚠️ Potential secret staged" && exit 1
```

Never commit `.env`, keys, or tokens. Use `.gitignore` and runtime environment variables.

## Checklist

- [ ] Zod schemas on all external inputs (API bodies, query params, env vars)
- [ ] No `any` types bypassing validation
- [ ] Parameterized queries only
- [ ] Auth middleware on all protected routes
- [ ] CORS configured with explicit origins (no `*` in production)
- [ ] Rate limiting on public endpoints
- [ ] `bun audit` / `npm audit` passes in CI
- [ ] Secrets never logged or committed
- [ ] `git diff --cached` reviewed before committing
