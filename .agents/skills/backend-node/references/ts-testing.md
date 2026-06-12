# TypeScript Algorithm Testing

Strategies for verifying logic correctness using Vitest.

## 1. Testing Strategy (AAA)
- **Arrange:** Set up data and mocks.
- **Act:** Invoke the target function.
- **Assert:** Verify outcomes with descriptive expectations.

## 2. Coverage Targets
- **Critical Code:** ≥ 80% coverage for algorithms and complex business rules.
- **Edge Cases:** Explicitly test `null`, `undefined`, empty arrays, and boundary values.
- **Error Paths:** Test exception handling, timeouts, and validation failures.

## 3. Execution (Vitest)
```bash
# Run tests with coverage
vitest run --coverage
```
