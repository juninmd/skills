# Vitest Core APIs and CLI Reference

Guidelines for configuring and running Vitest tests.

## 1. Test Inception
- **test/it:** Define individual test cases.
- **describe:** Group related tests into suites.
- **modifiers:** Use `.skip`, `.only`, `.concurrent`, or `.todo` to control execution.

## 2. Assertion API (Expect)
- **Basic:** `expect(val).toBe(expected)`.
- **Object:** `expect(obj).toEqual(expected)`.
- **Async:** `await expect(promise).resolves.toBe(val)`.
- **Errors:** `expect(fn).toThrow(error)`.

## 3. CLI Commands
- `vitest`: Start in watch mode.
- `vitest run`: Run once (CI mode).
- `vitest run --coverage`: Generate coverage reports.
- `vitest -t <name>`: Filter by test name.
- `vitest <path>`: Filter by file pattern.
