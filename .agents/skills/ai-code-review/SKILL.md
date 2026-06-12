---
name: ai-code-review
description: "AI-Assisted Code Review for Identifying potential, Detecting security, Flagging performance via auditing-code, security-scanning."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# AI-Assisted Code Review

Professional guidance for using AI models and automation to augment code review workflows, catch issues early, and maintain consistency at scale.

**USE FOR:**
- Identifying potential bugs and logic errors in diffs.
- Detecting security vulnerabilities and injection risks.
- Flagging performance anti-patterns (N+1 queries, memory leaks).
- Suggesting refactors for readability and maintainability.
- Enforcing naming conventions and style consistency.
- Finding missing error handling or edge cases.
- Catching type safety issues and potential null pointer exceptions.
- Automated pre-review checks before human review.

**DO NOT USE FOR:**
- Architectural design decisions (use `improving-codebase-architecture`).
- Feature approval or business logic validation (requires human context).
- Test coverage decisions (use `test-driven-development`).

**INVOKES:**
- `auditing-code` for detailed human-level reviews.
- `security-scanning` for vulnerability detection.
- `applying-clean-code` for readability suggestions.
- `test-driven-development` for validation.

## AI Review Workflow

1. **Automated Pre-Review (Immediate)**
   - Lint checks, type safety, null safety.
   - Run ultra-fast linters first: `ruff` (Python), `biome` (JS/TS).
   - Security baseline checks: `bandit`, `pnpm audit`, `gitleaks`.
   - Performance red flags (cycles in dependencies, large allocations).
   - Format and convention violations.

2. **Diff-Based Analysis**
   - Analyze changed lines in context of entire function.
   - Flag functions with Cyclomatic Complexity > 10 for refactoring.
   - Detect design violations, missing error handling, and code smells.
   - Detect added technical debt.

3. **Issue Classification**
   - **Blocker:** Security, correctness, crashes → must fix.
   - **Major:** Performance, maintainability → discuss in review.
   - **Minor:** Style, naming → suggest but non-blocking.

4. **Contextual Prompts**
   - Provide full function context, not isolated lines.
   - Include test coverage for changed code.
   - Reference similar working patterns in codebase.

## Best Practices
- **Fix First:** Always run tools with auto-fix flags (`--fix`, `--write`) before reporting results.
- **Context Detection:** Automatically detect project language and select appropriate toolset.
- **Severity Classification:** Classify findings by severity: blocker (security), high (design), medium (style).

## Checklist

- [ ] Automated review runs on every pull request.
- [ ] Findings are classified by severity (blocker/major/minor).
- [ ] False positives are tracked and rules are refined.
- [ ] Security findings always require human review.
- [ ] Breaking API changes are flagged.
- [ ] Performance anti-patterns are caught (N+1, memory leaks, etc.).
- [ ] Error handling is complete (no silent failures).
- [ ] Tests validate changed behavior, not just existence.
