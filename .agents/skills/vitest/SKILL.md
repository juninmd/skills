---
name: vitest
description: |
  **TESTING SKILL** - Fast testing using Vitest (Vite-native).
  USE FOR: unit/integration tests, React/Vue components, mocking (vi), snapshots, type-testing, Vitest config.
  DO NOT USE FOR: end-to-end (use Playwright), non-Vite JS projects.
  INVOKES: vitest cli, coverage.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Vite, Node.js, Browser"
allowed-tools: [run_shell_command, read_file, write_file, replace]
---

# Vitest - Blazing Fast Testing

Expert guide for authoring and executing efficient test suites using Vitest.

**USE FOR:**
- Writing unit and integration tests.
- Implementing mocks, spies, and fake timers via `vi`.
- Verifying UI components in jsdom/happy-dom.
- Generating code coverage reports.
- Performing type-level testing.

**INVOKES:**
- `vitest`, `vitest run`.

## Methodology
Implementation details are in:
1. [Core & Features](references/vitest-core.md) | [Mocking](references/vitest-features.md)
2. [Complete Topic Map](references/TOPIC_MAP.md)

## Core Principles
1. **Isolation:** Restore mocks in `afterEach`.
2. **Deterministic:** Avoid unstable I/O.
3. **Behavioral:** Test what the system does.

## Checklist
- [ ] Ensure mocks are restored in `afterEach`.
- [ ] Verify test correctness by making it fail first.
- [ ] Validate coverage targets (> 80%).
