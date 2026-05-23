# Vitest Features and Mocking

Detailed guidelines for advanced testing scenarios.

## 1. Vi Utilities (Mocking)
- **Spies:** `const spy = vi.spyOn(obj, 'method')`.
- **Mocks:** `const mock = vi.fn().mockReturnValue(val)`.
- **Module Mocks:** `vi.mock('./module', () => ({ ... }))`.
- **Timers:** `vi.useFakeTimers()` and `vi.advanceTimersByTime(ms)`.

## 2. Lifecycle Hooks
- `beforeEach` / `afterEach`: Run for every test.
- `beforeAll` / `afterAll`: Run once per suite.
- Use `afterEach(() => { vi.restoreAllMocks() })` to ensure isolation.

## 3. Advanced Features
- **Snapshots:** Use `toMatchSnapshot()` for large UI or data trees.
- **Type Testing:** Use `expectTypeOf()` and `assertType()` for type-level verification.
- **Environments:** Toggle between `node`, `jsdom`, or `happy-dom` via `test.environment`.
- **Concurrency:** Run independent tests in parallel using the `concurrent` modifier.
