# Grill-Me Interview Procedure

Iteratively interview the user to resolve design ambiguities, edge cases, and decision branches before committing to an implementation plan.

## Preflight
```bash
git status --short
rg -n '<domain or feature keyword>' src/ | head -n 20   # answer what the codebase already decides
```

Rule zero: every question answerable by inspecting the codebase, configuration, or tests costs user patience for nothing. Explore the repository first.

## Workflow
1. **Explore First:** Inspect relevant files, existing endpoints, types, and schemas to establish baseline facts and narrow down what is genuinely undecided.
2. **Filter Questions:** Cap the interview at 3 to 5 critical decisions. If a choice is trivial or an implementation detail, assume the simplest path and record it rather than interrogating.
3. **Map the Decision Tree:** Identify key forks in architecture, contracts, edge behaviors, and permissions. Resolve dependencies in order (do not ask about caching before deciding sync vs async).
4. **Draft Recommended Options with 1-Line Rationale:** For every question, present structured choices and explicitly mark the recommended default: `(Recommended)` or `[default]`, explaining why in one line (trade-off, consistency, or security).
5. **Ask via Interactive Tools or Focused Batches:** Use `ask_question` when the tool is available (renders native selectable options; do not add a manual 'Other' option). Otherwise, format structured Markdown prompts.
6. **Lock Acceptance Criteria:** Convert confirmed decisions into observable acceptance conditions and proceed to [phase-plan.md](phase-plan.md).

## Filter: Ask vs. Assume

| Scenario | Action |
|---|---|
| Changes data schema, storage, or migration | ❓ Ask (with recommendation) |
| Changes security boundary, roles, or auth | ❓ Ask (with recommendation) |
| Breaks existing public API or CLI contract | ❓ Ask (with recommendation) |
| Pattern already established elsewhere in repo | 🔍 Mirror established pattern (do not ask) |
| Reversible implementation detail or minor naming | ⚡ Pick the simplest option, note as assumption |

## Decision Tree Hierarchy

| Order | Decision Level | Examples |
|---|---|---|
| 1 | Core Scope & Bounds | What is in-scope vs out-of-scope; synchronous response vs background queue |
| 2 | Data & Contracts | New schema vs extend existing; API payload shape; status codes |
| 3 | Permissions & Security | Role access, tenant boundaries, secret handling |
| 4 | Edge Cases & Errors | Handling duplicates, empty states, timeouts, partial failure |
| 5 | Non-functional | Latency targets, caching, pagination limits |

## Question Formatting

Always provide context, options, and a clear recommended choice with rationale:

```markdown
**Question:** How should duplicate submissions within 5 seconds be handled?
- [x] (Recommended) Return the existing result idempotently — avoids double processing while remaining resilient to network retries.
- [ ] Reject with 409 Conflict — surfaces duplicate attempts explicitly to the caller.
- [ ] Allow and process both requests — simplest implementation, but permits duplicates.
```

## Stop
- The ask expands into a full product specification or PRD: hand off to `requirements-planning`.
- All major branches in the decision tree are resolved (or 3-5 critical questions answered): stop grilling and write the plan.
- The session is headless or unattended: do not block on questions; state documented defaults and proceed with non-dependent steps.
