---
name: generative-testing
description: "Generative Testing & Mutation Analysis for Defining invariants, Mutating code, Fuzzing untrusted via hypothesis."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Python 3.13+, Node.js 24+, Java, Go"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Generative Testing & Mutation Analysis

Expert methodology for discovering edge cases and validating test robustness through property-based testing and mutation testing.

**USE FOR:**
- Defining invariants and running property-based tests to find edge cases (Hypothesis, QuickCheck, jqwik).
- Mutating code to verify tests catch regressions (Stryker, pytest-mutagen, pitest).
- Fuzzing untrusted input boundaries with generated payloads.
- Analyzing coverage and identifying dead code paths.
- Validating complex state machines and concurrent systems.

**DO NOT USE FOR:**
- Manual test case creation (use test-driven-development).
- UI/frontend testing.
- End-to-end integration scenarios (use contract-testing).

**INVOKES:**
- `hypothesis`, `pytest`, `stryker`, `jqwik`, `pitest`, `coverage`, `test-driven-development`.

## Methodology
Generative testing inverts traditional QA: instead of writing test cases, you define invariants and let generators find violations.

## Core Principles
1. **Invariants First:** Define what must always be true; generators find counterexamples.
2. **Mutation Validation:** Kill mutants to prove tests actually enforce behavior.
3. **Shrinking:** Failed test cases are minimized to simplest failing input; aids debugging.

## Checklist
- [ ] Property-based test framework chosen (Hypothesis, QuickCheck, jqwik) and integrated into CI/CD.
- [ ] Core invariants defined for all critical functions (e.g., "output length <= input length + constant").
- [ ] Test inputs generated from realistic distributions; edge cases (empty, null, large) covered.
- [ ] Mutation testing tool configured (Stryker, pytest-mutagen, pitest); weak tests flagged.
- [ ] Mutation survival rate enforced: >80% of mutations killed by tests (fail CI if lower).
- [ ] Fuzz testing enabled for parsing, deserialization, and untrusted input handlers.
- [ ] Code coverage enforced: >85% line coverage + branch coverage for critical paths.
- [ ] Concurrent code tested with property-based approach (detect race conditions, deadlocks).
- [ ] Regression database maintained: failing inputs from production added to generators.
