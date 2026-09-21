# test-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `advanced-environments.md` | Open when a test needs browser globals (DOM, `window`, `fetch`) Node lacks, or choosing between `jsdom`, `happy-dom`, and `edge-runtime` test environments |
| `advanced-projects.md` | Open when running multiple test configurations (unit vs. integration, or per-package) in one Vitest process via the `projects` option in a monorepo |
| `advanced-type-testing.md` | Open when a type change needs its own test: verifying inferred parameter/return types with `expectTypeOf`/`assertType` in `.test-d.ts` files |
| `advanced-vi.md` | Open for the full `vi` utility surface beyond basic mocking: stubbing globals/env vars, `vi.hoisted`, mocked system time, and `vi.waitFor`/`waitUntil` polling |
| [`contract-testing.md`](contract-testing.md) | Open when a "Contract" level test is needed: consumer-driven contract workflow between a consumer and a provider service, as an alternative to a brittle full end-to-end chain |
| `core-cli.md` | Open when picking the exact `vitest` CLI invocation: watch vs. run mode, `vitest related` for lint-staged, or filtering by file:line from the command line |
| `core-config.md` | Open when setting up or merging `vitest.config.ts`/`vite.config.ts`, or a config option isn't taking effect |
| `core-describe.md` | Open when structuring nested `describe` suites or deciding whether shared setup belongs in a suite block |
| `core-expect.md` | Open when picking the right `expect` matcher (equality, truthiness, numeric, string, array) or unsure whether to use `toBe` vs. `toEqual` |
| `core-hooks.md` | Open when deciding between `beforeEach`/`afterEach` and `beforeAll`/`afterAll`, or wiring the cleanup-return pattern for setup that needs teardown |
| `core-test-api.md` | Open when defining a test with `test`/`it`, handling async tests, or checking test modifiers like `.skip`/`.only`/`.todo` |
| `e2e-recipes.md` | Open when a browser suite is slow or flaky from re-logging-in every test, or parallel E2E tests are racing on shared accounts/data |
| `features-concurrency.md` | Open when tests hang or race under parallel execution: configuring `fileParallelism`, worker count, pool type, or `test.concurrent` |
| `features-context.md` | Open when building a reusable custom fixture with `test.extend`, or using built-in context (`task`, `onTestFinished`, `onTestFailed`) instead of module-level hooks |
| `features-coverage.md` | Open when configuring code coverage: choosing the v8 vs. istanbul provider, reporters, or include/exclude globs |
| `features-filtering.md` | Open when narrowing which tests run — by file path, test name pattern, changed files, or tag — instead of running the whole suite |
| `features-mocking.md` | Open when writing a mock: mock functions and return values, `vi.spyOn` on object methods, `vi.mock` for module mocking with a `__mocks__` folder, or swapping in fake timers |
| `features-snapshots.md` | Open when deciding between file, inline, or external snapshots, or a snapshot test needs updating |
| `llm-gateway-testing.md` | Open when running a paid conformance sweep across an LLM gateway's model catalog: preflighting the gateway, filtering models before spending, and classifying tool-calling responses |
| `probe-contract.md` | Open for the per-model status/retry policy and JSON record schema behind an LLM gateway conformance sweep, the companion contract to `llm-gateway-testing.md` |
| `pytest-property-mutation.md` | Open for pytest fixtures/parametrize/monkeypatch, property-based testing with Hypothesis or fast-check, or mutation testing — the areas the JS-runner references don't cover |
| `quiet-checks.md` | Open before running a project's test/lint/build commands verbosely: the quiet-flag table per tool (npm, vitest, pytest, eslint, tsc, cargo, go, and more) to avoid dumping a full log |
| `real-world-cases.md` | Open first when deciding what to test and how much proof is enough: worked scenarios for bug fixes, API contracts, frontend interactions, flaky tests, and performance claims |
| `regression-gate.md` | Open when gating a candidate change against a baseline: classifying green-to-red regressions vs. pre-existing failures vs. new coverage using the project's own test/bench/snapshot commands |
| `tdd-methodology.md` | Open when starting a feature test-first: the red-green-refactor cycle, vertical slicing, the AAA pattern, and spotting anti-patterns like testing privates or wide mocks |
| [`test-doubles.md`](test-doubles.md) | Open when choosing a dummy/stub/spy/mock/fake, deciding whether mocking a collaborator is over-mocking, or spotting a mystery-guest/fragile-test smell in review |
| `vitest-core.md` | Open for a single-page cheat sheet spanning test/describe, expect assertions, and CLI flags — a quick refresher instead of opening core-test-api.md, core-describe.md, core-expect.md, and core-cli.md separately |
| `vitest-features.md` | Open for a single-page cheat sheet spanning vi mocking, lifecycle hooks, snapshots, type testing, environments, and concurrency — a quick refresher instead of opening each features-*.md file separately |
| `webapp-testing.md` | Open when writing or debugging Playwright/E2E browser tests: reusing an authenticated session across tests, per-worker parallel isolation, and avoiding a second E2E harness |
