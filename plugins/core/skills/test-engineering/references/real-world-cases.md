# Test Engineering Real-World Cases

Use this first when deciding what to test and how much proof is enough.

## Bug Fix
- Write or run the smallest reproduction before editing.
- Add a regression test that fails for the reported symptom, not just the changed line.
- Cover the adjacent failure path most likely to regress again.
- Rerun the original reproduction after the fix.

## API or Service Contract
- Test boundary validation, auth, happy path, dependency failure, timeout, and unchanged-state guarantees.
- Prefer real serializers, validators, and database transactions over mocks when those are the contract.
- Mock only network, clock, randomness, and expensive or uncontrollable dependencies.

## Frontend Interaction
- Unit-test pure state transitions; component-test user-visible behavior.
- Use real browser mode when CSS/layout, focus, pointer events, or browser APIs are the risk.
- Assert accessible names, focus movement, validation text, and submit/disable behavior.

## Flaky or Concurrent Test
- Repeat the failing test before changing production code.
- Remove shared global state, leaked timers, unawaited promises, order dependence, and real-time sleeps.
- Restore mocks, timers, environment variables, and storage after each test.

## Performance Claim
- Use fixed inputs, warmup, multiple samples, and before/after comparison.
- Fail the test on meaningful regression thresholds, not noisy micro-differences.
