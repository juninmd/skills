---
name: generate-tests
description: "Generate comprehensive unit tests for selected code, covering happy paths, edge cases, error handling, and mocking. Triggers: generate tests, write unit tests, add test coverage, test this function."
argument-hint: "[file or function to test]"
---
# Generate Tests

When the user invokes `/generate-tests` $ARGUMENTS:

- If no target is provided, ask: "What file or function should I generate tests for?"
- Respond in the same language the user is using.

## Framework Detection

Auto-detect from project files — do not assume:

| Signal | Framework |
|---|---|
| `vitest.config.*`, `vite.config.*` | **Vitest** |
| `jest.config.*`, `jest` in `package.json` | **Jest** |
| `pytest.ini`, `pyproject.toml [tool.pytest]`, `conftest.py` | **pytest** |
| `go.mod` present | **Go testing** (`testing` package) |
| `Cargo.toml` present | **Rust** (`#[cfg(test)]`) |

If ambiguous, default to **Vitest** for JS/TS projects, **pytest** for Python.

## Coverage Requirements

Generate tests covering all of the following:

1. **Happy Path** — standard inputs producing expected outputs
2. **Edge Cases** — `null`, `undefined`, empty string/array, zero, negative numbers, max values, boundary conditions
3. **Error Handling** — invalid inputs, network failures, rejected promises, thrown exceptions
4. **Async Behavior** — promises, async/await, timeouts (use fake timers where applicable)
5. **Type Coercion** *(JS/TS only)* — unexpected types passed to untyped boundaries

## Structure & Naming

- Group with `describe` blocks matching the module/class/function name
- Test names must describe behavior: `it('should return null when user is not found')`
- One assertion focus per test — avoid testing multiple behaviors in a single `it`
- No shared mutable state between tests (`beforeEach` resets, not `before`)

## Mocking & Isolation

- Identify external dependencies: databases, HTTP clients, file system, timers, env vars
- Mock at the boundary — never mock the unit under test itself
- Vitest/Jest: `vi.mock` / `jest.mock` with typed return values
- pytest: `pytest-mock` (`mocker.patch`) or `unittest.mock`
- Restore all mocks after each test

## Test File Placement

- JS/TS: place alongside source as `<file>.test.ts` or in `__tests__/`
- Python: place in `tests/` mirroring the source structure, prefixed with `test_`
- Go: same package, `_test.go` suffix
- Rust: `#[cfg(test)]` module at the bottom of the file

## Output

Full, runnable test file — no pseudocode, no placeholders. Add a brief comment only for complex mock setups. End with the exact command to run the tests.
