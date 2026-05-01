# Code Reviewer

**File:** `.agents/agents/code-reviewer.agent.md`

A principal-level code reviewer that runs parallel Security, Architecture, and Performance reviewers and consolidates findings into structured PR/MR comments.

## When to Invoke

- Before merging any feature branch
- During PR/MR creation
- After significant refactors
- For security audits
- When you want multi-perspective feedback on a design decision

## Invoke

```
/code-reviewer
```

Or describe the task: _"review the auth module"_, _"check this PR for security issues"_

## Capabilities

### 1. Security Review
- OWASP Top 10 vulnerability detection
- Hardcoded secrets and credentials
- Input validation (Zod / schema enforcement)
- SQL/NoSQL injection patterns
- Authentication and authorization gaps
- Dependency vulnerabilities

### 2. Architecture Review
- SOLID principles validation
- Clean Architecture adherence
- Design pattern appropriateness
- Testability and coupling analysis
- Technical debt identification
- API contract stability

### 3. Performance Review
- Algorithmic complexity (O(n²) or worse without justification)
- N+1 query detection
- Resource management (memory leaks, unclosed connections)
- Unnecessary re-renders (React)
- Missing memoization
- Bundle size impact

### 4. Test Coverage
- Checks coverage gate (>80%)
- Validates meaningful assertions (not just existence)
- Ensures edge cases are covered
- Checks error path testing

### 5. Mentorship Output
- Actionable feedback with clear remediation steps
- Learning opportunities flagged alongside issues
- Explains _why_ something is a problem, not just _what_

## Output Format

Reviews are structured with severity levels for easy scanning:

| Severity | Meaning |
|---|---|
| 🔴 BLOCKER | Must fix before merge — security, data loss, breaking change |
| 🟡 HIGH | Should fix — significant quality, performance, or design issue |
| 🟢 LOW | Nice to fix — minor improvements, style, optimization |
| 💡 SUGGESTION | Optional — learning opportunity, alternative approach |

## Execution Model

The agent runs three reviewers in parallel then synthesizes:

```
/code-reviewer
      ↓
  ┌─────────────────────────────────┐
  │  Security    Architecture  Perf │  (parallel)
  └─────────────────────────────────┘
              ↓
        Consolidated Review
        with severity table
```

## Example Output

```
## Code Review — feat/user-auth

### 🔴 BLOCKER — SQL Injection Risk
`src/db/users.ts:42` — String interpolation in query. Use parameterized queries.

### 🟡 HIGH — Missing Input Validation
`src/api/users.ts:18` — No Zod schema on POST body. Add `z.object({...}).parse(req.body)`.

### 🟢 LOW — N+1 Query
`src/services/posts.ts:67` — Fetching user per post in a loop. Batch with `findMany({ where: { id: { in: ids } } })`.

### Coverage: 74% ⚠️ (gate: 80%)
Missing tests for error paths in `src/services/auth.ts`.
```
