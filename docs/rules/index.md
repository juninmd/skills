# Rules

Governance instructions that are always active. No invocation needed — they apply to every task in every session.

Rules are defined as `.instructions.md` files under `.agents/rules/` and are loaded automatically by compatible AI assistants.

## Active Rules

### Security

**File:** `security.instructions.md`

Zero-vulnerability policy:
- OWASP Top 10 enforcement
- Zod validation on all external inputs (API bodies, env vars, query strings)
- Parameterized queries — no string interpolation in SQL
- No hardcoded secrets or API keys
- Authentication middleware on all protected routes
- Input sanitization before rendering

---

### Git Workflow

**File:** `git-workflow.instructions.md`

- Never commit directly to `main` or `master`
- Feature branches: `feat/`, `fix/`, `refactor/`, `docs/` prefixes
- [Conventional Commits](https://conventionalcommits.org) format: `type(scope): description`
- Use `git status -s` instead of plain `git status`
- PR-first collaboration — all changes via pull request
- Branch names: `feat/user-auth`, `fix/payment-timeout`

---

### Testing

**File:** `testing.instructions.md`

- Minimum coverage: **80%** (agents default to 90%)
- Unit tests for all business logic
- Integration tests for all API endpoints
- Meaningful assertions — not just `expect(result).toBeDefined()`
- Error path testing required
- Mock only external dependencies, not internal modules

---

### Code Design Principles

**File:** `code-design-principles.instructions.md`

- Clean Code: self-documenting names, small functions (<100 lines)
- SOLID: SRP per module, OCP via composition
- DRY: extract when duplicated 3+ times with same semantics
- KISS: simplest implementation that works
- YAGNI: no speculative abstractions

---

### Error Handling

**File:** `error-handling.instructions.md`

- Meaningful error messages that explain what went wrong
- Typed errors with domain-specific error classes
- No silent failures or empty `catch` blocks
- Graceful degradation with fallback behavior
- User-facing errors must not expose internal details

---

### Naming Conventions

**File:** `naming-conventions.instructions.md`

- Variables and functions: camelCase (JS/TS), snake_case (Python), camelCase (Go)
- Classes and interfaces: PascalCase
- Constants: SCREAMING_SNAKE_CASE
- Files: kebab-case for JS/TS, snake_case for Python
- Boolean variables: `is`, `has`, `can`, `should` prefix

---

### Observability

**File:** `observability.instructions.md`

- Structured JSON logging (no `console.log` in production)
- Correlation IDs on all requests
- Metrics for key business operations
- Distributed trace propagation
- Alert on SLO violations, not just errors

---

### Data Privacy

**File:** `data-privacy.instructions.md`

- PII must never appear in logs
- GDPR-compliant data handling
- Data minimization — collect only what's needed
- Encryption at rest for sensitive data
- Consent before collection

---

### Dependency Management

**File:** `dependency-management.instructions.md`

- Pin major versions in production dependencies
- Regular security audits (`pnpm audit`, `pip audit`)
- Remove unused dependencies
- Track deprecation notices
- Prefer well-maintained packages with active communities

---

### Dockerfile Standards

**File:** `dockerfile-standards.instructions.md`

- Multi-stage builds required
- Alpine or Distroless runtime images
- Non-root user in final stage
- No secrets in image layers
- Health check required

---

### Environment & Secrets

**File:** `env-secrets.instructions.md`

- Secrets via environment variables only
- Never hardcode API keys, passwords, or tokens
- `.env` files in `.gitignore`
- Rotation protocol: assume any committed secret is compromised
- Use secret managers (Vault, AWS Secrets Manager) in production

---

### Shell Scripting

**File:** `shell-scripting.instructions.md`

- `set -euo pipefail` at the top of every script
- Quote all variables: `"$var"` not `$var`
- Use `[[` not `[` for conditionals
- `trap` for cleanup on exit
- POSIX-compatible where cross-platform support is needed

---

### Command Safety

**File:** `command-safety.instructions.md`

- No destructive operations without explicit user confirmation
- `rm -rf` requires confirmation
- Database drops require confirmation
- Production deployments require confirmation
- Destructive git operations (`reset --hard`, force push) require confirmation

---

### Context Efficiency

**File:** `context-efficiency.instructions.md`

- Read only the files needed for the task
- Use targeted search (grep, glob) rather than reading entire directories
- Summarize large file contents before processing
- Avoid repeating large code blocks in responses

---

### Workspace Navigation

**File:** `workspace-nav.instructions.md`

- Use glob patterns to find files efficiently
- Prefer `grep` with specific patterns over directory traversal
- Build a mental model of the project structure before diving into files
- Use `git log` and `git blame` for context on changes
