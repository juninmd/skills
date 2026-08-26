# Test Engineering Topic Map

Single entry point for the reference modules. Pick by trigger.

## Methodology and Cases
- [tdd-methodology.md](tdd-methodology.md) — red/green/refactor, deciding test level, what to assert.
- [real-world-cases.md](real-world-cases.md) — worked examples of test design on real defects.
- [pytest-property-mutation.md](pytest-property-mutation.md) — Python pytest fixtures and parametrize, property-based generators and shrinking, mutation scoring.

## Runner Overview
- [vitest-core.md](vitest-core.md) — first orientation to the runner.
- [vitest-features.md](vitest-features.md) — feature tour before drilling into a specific API.

## Core APIs
- [core-config.md](core-config.md) — config file, environments, setup files, aliases.
- [core-cli.md](core-cli.md) — flags, watch mode, filtering from the command line.
- [core-test-api.md](core-test-api.md) — `test`/`it`, modifiers, timeouts, retries.
- [core-describe.md](core-describe.md) — suites, nesting, suite-level modifiers.
- [core-expect.md](core-expect.md) — assertions, matchers, custom matchers, async expects.
- [core-hooks.md](core-hooks.md) — lifecycle hooks and cleanup ordering.

## Features
- [features-mocking.md](features-mocking.md) — module and function mocks, spies, fake timers, restoring state.
- [features-snapshots.md](features-snapshots.md) — snapshot and inline snapshot workflow, updating safely.
- [features-coverage.md](features-coverage.md) — providers, thresholds, reading blind spots.
- [features-context.md](features-context.md) — test context and typed fixtures.
- [features-concurrency.md](features-concurrency.md) — concurrent tests, sharding, isolation pitfalls.
- [features-filtering.md](features-filtering.md) — selecting tests by name, file, tag, or change.

## Advanced
- [advanced-vi.md](advanced-vi.md) — the `vi` utility surface in depth.
- [advanced-environments.md](advanced-environments.md) — jsdom versus node environments, per-file overrides.
- [advanced-type-testing.md](advanced-type-testing.md) — type-level assertions.
- [advanced-projects.md](advanced-projects.md) — multi-project workspaces and shared config.
