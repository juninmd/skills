---
name: test-engineering
description: |
  Design and run test suites, end-to-end browser flows, regression gates, and quiet checks. Use for test-first TDD before implementing a feature or bugfix, unit and integration tests, Vitest, pytest, Playwright E2E, flaky test elimination, LLM gateway conformance, and coverage. Trigger on 'write a failing test first', 'this test is flaky', 'add an E2E test', 'raise coverage'.
---


# Test Engineering

**Not this skill:** diagnosing a production incident (`observability`), or reviewing a diff for defects (`code-review`).

## Preflight
```bash
cat package.json 2>/dev/null | jq -r '.scripts | to_entries[] | select(.key|test("test|spec")) | "\(.key): \(.value)"'
rg -n 'randomly|shuffle|seed' package.json pytest.ini pyproject.toml 2>/dev/null
```

Pick the test level from the contract being checked, not from habit.

## Workflow
1. Before choosing a level, write down the behavior, the invariant, the observable outcome, and the ways it can fail.
2. Write the failing test first, for a new feature just as for a bug fix. Run it and confirm it **fails on its assertion, for the reason you intended**. An import, syntax, or fixture error is not a red run; fix it and rerun until the assertion itself fails.
3. Choose the lowest level that still exercises the real contract. Never mock the subject under test.
4. Cover boundaries, invalid input, dependency failure, timeout, retry, concurrency, and the unchanged-state guarantee (after an error, nothing was written).
5. Iterate with focused runs. Before claiming done, run the project's full test command, not just the new file, and name every failure, including ones this change did not cause.
6. Use coverage for blind spots, mutation testing for assertion strength, profiling for performance claims.

## Choosing the Level

| Level | Use when | Typical mistake |
|---|---|---|
| Unit | Pure logic, branching, boundaries | Mocking the subject; asserting implementation instead of behavior |
| Integration | Real DB, real HTTP boundary, real serialization | One fixture shared across workers, so runs interleave and flake |
| Contract | A consumer depends on your response shape | Green tests, broken client |
| Property | An invariant must hold over a whole domain | A weak generator that never reaches the edges |
| Mutation | Assertions look thin | Chasing the score instead of the surviving mutants |
| Benchmark | You are making a performance claim | No warmup, a single sample, no before/after |

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
Never retry a flaky test; trace it to one source and remove it. A flake with failure rate p is caught in n runs with probability 1-(1-p)^n.

| Source | Tell | Fix |
|---|---|---|
| Shared state | Passes alone, fails in the suite | Own fixture, own schema or tenant, own temp path |
| Order dependence | Passes only in file order | Shuffle in CI; the test is asserting on leftovers |
| Time | Fails near midnight, month end, or under another TZ | Freeze the clock; pin TZ |
| Randomness | Fails about 1 run in N | Fixed seed, printed on failure |
| Async | Fails on a faster or slower machine | Await the observable condition; never sleep |
| Port or resource | Fails only in parallel | Per-worker port, or mark serial |

If this change cannot fix it, never skip or delete the test. Leave it running and reporting, with an open ticket and named owner, per the project's flake policy. Quarantine window and exit count are project policy. At the deadline the owner rewrites the test or records an explicit decision to delete it; expiry alone never deletes.

## Reference Routing
- Consult [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.
- Picking a test double, or spotting a mystery-guest or fragile-test smell in review: [test-doubles.md](references/test-doubles.md).
- Running the red-green cycle, or confirming an expected value is independent of the code: [tdd-methodology.md](references/tdd-methodology.md).
- Building the "Contract" level against another service: [contract-testing.md](references/contract-testing.md).

## Stop
- A new test passes on its first run. It covers existing behavior, or nothing; rework it until it fails for the intended reason.
- You are about to retry a test instead of attributing it. A retry hides the cause of the failure.
- You are mocking the subject under test. Stop; the test now asserts the mock.
- A negative-path test (proving a gate rejects bad input) is about to run on a real tracked file. Use a disposable temp file and check anything touched byte for byte ([real-world-cases.md](references/real-world-cases.md)).

## Rules
- Refactoring and simplification go to `code-review`, UI issues to `frontend-engineering`, service bugs to `backend-systems`.
- Assert externally meaningful behavior and exact failure semantics: error type and message, not merely that something threw.
- After every test, restore mocks, timers, environment, and global state. A leaked timer fails a later, innocent test.
- Order dependence is a defect, not a setting. Run the suite shuffled in CI.
- Concurrent tests that share a fixture, database, or temp path will interleave. Give each worker its own, or mark those tests serial.
- Do not chase a coverage number: 100% with weak assertions is worse than 70% with sharp ones; it looks finished.
- Frontend end-to-end uses Playwright for web and desktop alike; Electron support is official but experimental, and Tauri needs a documented driver exception. UI review rules (screenshot evidence, determinism) belong to `code-review`.
- "Connection refused" during a test run is not a network fault: a required service was not started, or a call was left unmocked.
- Prefer a real containerized dependency when fidelity matters.
- Benchmarks need warmup, stable inputs, several samples, and a before/after comparison.
- A passing gate can be a broken gate. After editing or relying on a linter config, backup, or verification tool, feed it a known-bad case and confirm it still fails ([real-world-cases.md](references/real-world-cases.md)).

## Excuses

| Excuse | Why it fails |
|---|---|
| "This behavior is too obvious to test" | The test exists to fail when the rule changes, not to prove what you already know |
| "I will add the test after the code lands" | A test written afterward passes first time, so it never showed it can fail, and it records what the code does, not what it should do |
| "I already tried it by hand" | A manual check leaves no record, covers only the cases you remember, and cannot rerun on the next change |
| "I'll keep my draft as a reference while I write the test" | The test ends up fitted to the draft. Set the draft aside and let the failing test drive the code |
| "It is too hard to test" | Hard to test means hard to use. Narrow the interface or inject the boundary; do not skip the test |
| "That failure was already there" | Name it anyway. A red test left unmentioned makes the report false by omission |
| "It only fails in CI, so it is a CI problem" | Order, seed, and concurrency are the product's problem; reproduce with --sequence.shuffle |
| "Coverage is at 90%, that is enough" | Coverage measures what ran, not what was asserted; mutation measures the assertions |
| "It passed five times, so it is not flaky" | Five runs catch a 5% flake only about a quarter of the time; the run count is the claim |

## Checklist
- [ ] The test failed first, on its assertion (not an error), for the intended reason.
- [ ] Full suite run before claiming done; every failure named.
- [ ] Level chosen for the contract under test; the subject is not mocked.
- [ ] Unhappy paths covered: invalid input, dependency failure, timeout, unchanged state on error.
- [ ] Ordering or parallelism checks run where relevant.
- [ ] No global state, timer, or mock left behind after the run.
