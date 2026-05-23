# TDD Principles and Workflow

Detailed guidelines for behavior-first development and vertical slices.

## 1. Core Principles
- **Observable Behavior:** Tests must target public interfaces, not private implementation details.
- **Refactor Survival:** Tests should remain green through internal code restructures.
- **Minimal Mocking:** Mock only unstable boundaries (network, time, random). Prefer integration checks for internal collaborators.
- **Incrementalism:** Do not batch tests. Write exactly one test for the next specific behavior.

## 2. Red-Green-Refactor Cycle
1. **Vertical Slice:** Select the smallest end-to-end behavior to prove.
2. **Red:** Write one failing test that names a user-relevant outcome (return value, UI state, side effect).
3. **Green:** Implement the minimal code required to pass the test. Reject premature generalization.
4. **Refactor:** Clean up code and tests while green. Improve interfaces and remove duplication.
5. **Repeat:** Add the next behavior only after the current slice is verified and readable.

## 3. Anti-Patterns
- **Testing Privates:** Couplings tests to non-public helpers.
- **Wide Mocks:** Mocking local classes that should be exercised together.
- **Batch Testing:** Writing all tests before any implementation.
- **Shape Encoding:** Asserting on object internal structure instead of behavior.
- **False Pass:** Keeping tests that pass despite broken logic.
