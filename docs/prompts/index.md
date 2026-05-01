# Prompts

Reusable prompt templates for common engineering tasks. Invoke them with `/template-name` or let the assistant detect the task.

## Available Templates

| Template | Invoke | File |
|---|---|---|
| Explain | `/explain` | `explain.prompt.md` |
| Refactor | `/refactor` | `refactor.prompt.md` |
| Generate Tests | `/generate-tests` | `generate-tests.prompt.md` |
| Generate Dockerfile | `/generate-dockerfile` | `generate-dockerfile.prompt.md` |

---

## `/explain`

Step-by-step code explanation.

**Output structure:**
1. High-level summary (what does this code do?)
2. Logical breakdown (how does it work?)
3. Context and dependencies (what does it depend on?)
4. Edge cases and pitfalls (what could go wrong?)

**Usage:**
```
/explain src/services/auth.ts
/explain the payment processing flow
```

---

## `/refactor`

Refactor code using Clean Code and SOLID principles.

**What changes:**
- Improves readability and maintainability
- Applies SOLID where appropriate
- Reduces duplication (DRY)
- Simplifies complexity (KISS)
- Removes speculative code (YAGNI)

**What stays the same:**
- Business logic and behavior
- Public API contracts
- Test outcomes

**Usage:**
```
/refactor src/utils/validation.ts
/refactor the user registration handler
```

---

## `/generate-tests`

Generate comprehensive unit tests with Vitest or Jest.

**Coverage targets:**
- Happy path (normal operation)
- Edge cases (boundaries, empty inputs, max values)
- Error handling (invalid inputs, network failures, null values)
- Async behavior (promises, timeouts)

**Mocking:** uses `vi.mock` (Vitest) or `jest.mock` with typed mocks.

**Usage:**
```
/generate-tests src/services/payment.ts
/generate-tests for the auth middleware
```

---

## `/generate-dockerfile`

Generate a production-ready multi-stage Dockerfile.

**Standards applied:**
- Multi-stage build (separate build and runtime)
- Minimal base image (Alpine or Distroless)
- Non-root user
- Layer caching (dependencies before source)
- `.dockerignore` included
- Health check
- Security: no secrets in layers, read-only filesystem where possible

**Usage:**
```
/generate-dockerfile
/generate-dockerfile for a Node.js 24 API
/generate-dockerfile for a Python FastAPI service
```
