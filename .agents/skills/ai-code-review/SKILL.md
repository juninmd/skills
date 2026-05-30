---
name: ai-code-review
description: |
  **DEVELOPMENT SKILL** - Leverage AI-assisted code review automation and diff analysis.
  USE FOR: identifying bugs, style violations, performance issues, security concerns, suggesting refactors, consistency checks in diffs.
  DO NOT USE FOR: architectural reviews (use improving-codebase-architecture), feature approval (requires human judgment), test coverage (use test-driven-development).
  INVOKES: auditing-code, security-scanning, applying-clean-code, test-driven-development.
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
   - Security baseline checks (secrets, SQL injection patterns).
   - Performance red flags (cycles in dependencies, large allocations).
   - Format and convention violations.

2. **Diff-Based Analysis**
   - Analyze changed lines in context of entire function.
   - Compare with similar patterns in codebase.
   - Flag breaking changes to public APIs.
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

- **Always require human review** for security and architectural changes.
- **Feed AI context:** Full functions, related files, test cases—not isolated diffs.
- **Classify findings by risk:** Distinguish blockers from suggestions.
- **Learn from patterns:** If AI flags a pattern 10 times, add linting rule.
- **Reduce false positives:** Tune prompts or rules that generate >30% false positives.
- **Document decisions:** Why a pattern was accepted or rejected.

## Checklist

- [ ] Automated review runs on every pull request.
- [ ] Findings are classified by severity (blocker/major/minor).
- [ ] False positives are tracked and rules are refined.
- [ ] Security findings always require human review.
- [ ] Breaking API changes are flagged.
- [ ] Performance anti-patterns are caught (N+1, memory leaks, etc.).
- [ ] Error handling is complete (no silent failures).
- [ ] Tests validate changed behavior, not just existence.
