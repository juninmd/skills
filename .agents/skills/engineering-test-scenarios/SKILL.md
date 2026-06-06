---
name: engineering-test-scenarios
description: |
  **QA SKILL** - Deliberately design the unhappy-path tests that catch real defects, not just happy-path coverage.
  USE FOR: boundary value analysis, equivalence partitioning, error/exception paths, null/empty/malformed input, concurrency & race conditions, timeout/retry, fault injection, security abuse cases.
  DO NOT USE FOR: property/mutation/fuzz automation (use generative-testing), red/green cycle mechanics (use test-driven-development), runtime proof (use verifying-changes).
  INVOKES: test-driven-development, generative-testing, verifying-changes.
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "Failure scenario taxonomy requires concrete invariant examples."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Engineering Test Scenarios

Most AI-written tests assert the happy path and stop. This skill forces the opposite reflex: for every happy path, enumerate the failure paths that actually break in production. Test design owns *what to assert and why*; framework mechanics belong to `test-driven-development`.

**USE FOR:**
- Boundary value analysis and equivalence partitioning of every input.
- Error/exception paths: null, empty, malformed, wrong type, out of range.
- Concurrency: races, TOCTOU, double-submit, ordering, deadlock.
- Timeout, retry exhaustion, partial failure, and rollback.
- Fault injection: dependency throws, returns null, or hangs.
- Security/abuse cases: injection, oversized input, privilege bypass.

**DO NOT USE FOR:**
- Generating inputs automatically (use `generative-testing` for property/mutation/fuzz).
- The red/green/refactor loop itself (use `test-driven-development`).
- Executing and proving the run (use `verifying-changes`).

**INVOKES:**
- `test-driven-development` for assertion structure and the cycle.
- `generative-testing` to scale a designed scenario into property/fuzz runs.
- `verifying-changes` to execute and capture fail-to-pass evidence.

## Rule: For Every Happy Path, Enumerate Failure Paths

Each passing scenario must spawn 3–5 deliberate failure scenarios across these classes.

| Input class | Design it for | Assert |
|---|---|---|
| Boundary | min, min−1, max, max+1, zero | exact error code + state unchanged |
| Null / empty / blank | `null`, `""`, whitespace | rejected, no partial mutation |
| Malformed / wrong type | `"abc"`, unicode, overflow | clear message naming the field |
| Error path | dependency down, 4xx/5xx, permission denied | graceful failure, no orphaned writes |
| Concurrency | two writers, same key, in parallel | one wins, invariant holds (e.g. balance ≥ 0) |
| Timeout / retry | injected latency past SLA | times out, resources released, no hang |
| Abuse / security | injection, oversized, forbidden combo | blocked, logged, no escalation |

**Discipline:** every error test asserts the *exact* error and that state is unchanged — "it throws" is not an assertion. Name tests by failure mode (`rejects null recipient`), not `test_error_case`.

## Checklist

- [ ] Inputs partitioned into valid / invalid / boundary classes and documented.
- [ ] 3–5 failure scenarios designed per happy path (not just one).
- [ ] Every error test asserts exact error code/message AND state unchanged.
- [ ] Preconditions, postconditions, and invariants encoded as assertions.
- [ ] Concurrency scenarios cover races/ordering with the invariant asserted.
- [ ] Timeout/retry paths verify resource cleanup and no hung processes.
- [ ] Fault injection exists for each external dependency (throw/null/slow).
- [ ] At least two abuse/security cases per public entry point.
- [ ] Tests named by failure mode; rationale for each boundary noted.
- [ ] Designed scenarios handed to `generative-testing`/`verifying-changes` to scale and prove.
