---
name: test-engineering
description: |
  Design and implement reliable unit, integration, contract, property, mutation, and performance tests. Use for TDD, Vitest, pytest, unhappy paths, flaky tests, fixtures, mocks, fuzzing, coverage gaps, and regression benchmarks.
---

# Test Engineering

## Workflow
1. Define the behavior, invariant, observable outcome, and failure modes before choosing test level.
2. Reproduce the defect with a failing test when fixing a bug.
3. Prefer the lowest test level that exercises the real contract; avoid mocking the subject under test.
4. Cover boundaries, invalid input, dependency failure, timeout, retry, concurrency, and unchanged-state guarantees.
5. Run focused tests, then the relevant suite; repeat flaky or concurrency-sensitive tests.
6. Use coverage to find blind spots, mutation to assess assertion strength, and profiling to prove performance claims.

## Reference Routing
- TDD: [tdd-methodology.md](references/tdd-methodology.md)
- Vitest basics: [vitest-core.md](references/vitest-core.md), [vitest-features.md](references/vitest-features.md)
- Detailed API topics: use the matching `core-*`, `features-*`, or `advanced-*` file.
- Topic selection: [TOPIC_MAP.md](references/TOPIC_MAP.md)

## Rules
- Assert externally meaningful behavior and exact failure semantics.
- Restore mocks, timers, environment, and global state after every test.
- Do not chase a coverage percentage with low-value assertions.
- Benchmarks need warmup, stable inputs, multiple samples, and before/after comparison.

## Checklist
- [ ] Test fails for the intended reason first.
- [ ] Important happy and unhappy paths are covered.
- [ ] Focused and relevant suites pass deterministically.
