---
name: test-engineering
description: |
  Design and implement reliable unit, integration, contract, property, mutation, and performance tests. Use for TDD, writing the failing test before the fix, Vitest, pytest, unhappy paths, flaky tests, fixtures, mocks, fuzzing, coverage gaps, and regression benchmarks.
---

# Test Engineering

## Preflight
```bash
cat package.json | jq -r '.scripts | to_entries[] | select(.key|test("test|spec")) | "\(.key): \(.value)"'
rg -n 'randomly|shuffle|seed' package.json pytest.ini pyproject.toml 2>/dev/null
```

The level follows from the contract under test, never from habit.

## Workflow
1. Name the behavior, the invariant, the observable outcome, and the failure modes — before choosing a test level.
2. Fixing a bug? Write the failing test first and watch it fail **for the intended reason** — one that passes beforehand proves nothing.
3. Pick the lowest level that exercises the real contract. Never mock the subject under test.
4. Cover boundaries, invalid input, dependency failure, timeout, retry, concurrency, and the unchanged-state guarantee (on error, nothing was written).
5. Run focused first, then the relevant suite, then shuffled.
6. Use coverage to find blind spots, mutation to grade assertion strength, profiling to back a performance claim.

## Choosing the Level

| Level | Use when | Cost of getting it wrong |
|---|---|---|
| Unit | Pure logic, branching, boundaries | Mocking the subject; asserting implementation, not behavior |
| Integration | Real DB, real HTTP boundary, real serialization | Shared fixture across workers — interleaves and flakes |
| Contract | A consumer depends on your shape | Passing tests, broken client |
| Property | An invariant holds across a domain | Weak generator that never reaches the edge |
| Mutation | Assertions look thin | Chasing a score instead of the surviving mutants |
| Benchmark | A performance claim is being made | No warmup, one sample, no before/after |

## Useful Invocations

```bash
vitest run --reporter=verbose path/to/file.test.ts   # focused
vitest run --sequence.shuffle --sequence.seed=1234   # order dependence
vitest run --coverage                                # blind spots

pytest -x -q tests/test_thing.py::test_case          # focused, stop at first
pytest -p no:randomly --count=50 tests/test_flaky.py # reproduce flake
pytest --lf                                          # last failed only
```

## Flake Attribution
Never retry a flaky test; attribute it to exactly one source and remove that source. Detecting a p-flake in n runs is `1-(1-p)^n` — five green runs at p=5% catch it about 23% of the time, so state n before calling a test stable.

| Source | Tell | Fix |
|---|---|---|
| Shared state | Passes alone, fails in suite | Own fixture, own schema/tenant, own temp path |
| Order dependence | Passes in file order only | Shuffle in CI; it is asserting on residue |
| Time | Fails near midnight, month end, or in another TZ | Freeze the clock; pin `TZ` |
| Randomness | Fails ~1 run in N | Fixed seed, printed on failure |
| Async | Fails on a faster or slower machine | Await the observable condition, never `sleep` |
| Port or resource | Fails only in parallel | Per-worker port, or mark serial |

## Reference Routing
- Every reference is indexed with its trigger in [TOPIC_MAP.md](references/TOPIC_MAP.md). Start there and open only the file it names.
- Browser journeys belong to `webapp-testing`; the underlying defect to `diagnostics`; a suite result judged against a captured baseline to `regression-gate`.

## Stop
- The test passes before the fix. It proves nothing — make it fail for the intended reason first.
- A test is about to be retried instead of attributed. Retrying hides a real bug about half the time.
- The subject under test is being mocked. Stop; the test now asserts the mock.

## Rules
- Assert externally meaningful behavior and exact failure semantics — the error type and message, not just that it threw.
- Restore mocks, timers, environment, and global state after every test. A leaked timer fails a later, innocent test.
- Order dependence is a defect, not a configuration preference. Run the suite shuffled in CI.
- Concurrent tests sharing one fixture, database, or temp path will interleave. Give each worker its own, or mark those tests serial.
- Do not chase a coverage percentage: 100% with weak assertions is worse than 70% with sharp ones, because it looks finished.
- `connection refused` in a test run is not a network fault: a required service was not started, a call was left unmocked, or the environment differs from local.
- Prefer a real containerized dependency when fidelity matters — an in-memory SQLite that accepts SQL Postgres rejects is a false green.
- Benchmarks need warmup, stable inputs, multiple samples, and a before/after comparison; report medians and tails, never a single run.

## Excuses

| Excuse | Why it is false |
|---|---|
| "This behavior is too obvious to test" | The test exists to fail when the rule changes, not to prove what you already know |
| "I will add the test after the fix lands" | A test never seen failing asserts nothing; write it first and watch it fail for the intended reason |
| "It only fails in CI, so it is a CI problem" | Order, seed, and concurrency are the product's problem — reproduce with `--sequence.shuffle` |
| "Coverage is at 90%, that is enough" | Coverage grades what ran, not what was asserted; mutation grades the assertions |
| "It passed five times, so it is not flaky" | Five runs catch a 5% flake about a quarter of the time; the count is the claim |

## Checklist
- [ ] The test failed first, for the intended reason.
- [ ] Level chosen for the contract under test; the subject is not mocked.
- [ ] Unhappy paths covered: invalid input, dependency failure, timeout, unchanged state on error.
- [ ] Suite passes shuffled and in parallel, not only in file order.
- [ ] No global state, timer, or mock left standing after the run.
