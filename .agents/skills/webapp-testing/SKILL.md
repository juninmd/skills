---
name: webapp-testing
description: |
  Test web applications end to end in a real browser. Use for Playwright and browser automation, E2E flows, reusing authenticated sessions, parallel isolation, responsive checks, visual regression, and CI-only failures.
---

# Webapp Testing

## Preflight
```bash
npx playwright --version && cat playwright.config.* | rg -n 'workers|storageState|baseURL'
rg -n 'waitForTimeout' e2e/ tests/ | head        # existing flake, already written down
```

Find the existing E2E setup before adding a second one. Two harnesses is a permanent tax.

## Workflow
1. Find the framework's test commands, dev server, and any existing E2E setup before adding a second one.
2. Define journeys that cross real boundaries — navigation, forms, auth, state persistence. An E2E test that could have been a unit test is pure cost.
3. Test through the UI against a real or controllable backend. Stub only third-party services.
4. Use robust selectors and wait on user-visible state, never a fixed timeout.
5. Run headless by default; capture trace, screenshot, and video on failure.
6. Verify responsive breakpoints and keyboard-only flows for the critical journeys.

## Auth Once, Not Per Test
Driving the login form in every test is the difference between a two-minute suite and a twenty-minute one.

```ts
// setup project — runs once
await page.goto('/login');
await page.getByLabel('Email').fill(process.env.E2E_USER!);
await page.getByLabel('Password').fill(process.env.E2E_PASS!);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.context().storageState({ path: 'auth/user.json' });

// playwright.config.ts
use: { storageState: 'auth/user.json' }
```

Keep exactly one test on the real login form — otherwise the day it breaks, every test still passes.

## Parallel Isolation
Shared state is the whole reason E2E suites are considered flaky.

| Shared | Symptom | Fix |
|---|---|---|
| One user account | Tests log each other out | account per worker: `user-{workerIndex}@example.test` |
| One browser context | Cookies bleed across tests | context per test (Playwright default — do not defeat it) |
| One database | Rows race, deletes detonate neighbors | schema, database, or tenant per worker |
| One port or fixture file | Intermittent EADDRINUSE | derive from `workerIndex`, or mark serial |

## Selectors, Best to Worst

| Selector | Why |
|---|---|
| `getByRole('button', { name: 'Save' })` | asserts accessibility while it tests |
| `getByLabel('Email')` | breaks if the label breaks — which is a real bug |
| `getByTestId('cart-total')` | stable, but tests nothing about the user |
| `.css > .chain .selector` | breaks on any restyle, tests nothing |
| `nth-child(3)` | breaks when anything is inserted |

## Passes Locally, Fails in CI
Read the trace first. It is almost never a timeout that needs raising.

| Cause | Fix |
|---|---|
| Machine speed | await the condition, not a duration |
| Viewport differs | pin it in config |
| Timezone / locale | pin `TZ` and `locale` |
| Missing seed data | seed in a fixture, not by hand |
| Animation had finished locally | disable animations for the run |

```bash
npx playwright test --trace on --reporter=line
npx playwright show-trace test-results/<name>/trace.zip
```

## Reference Routing
- Saved-session setup, per-worker isolation, visual baselines, CI-only failure triage: [e2e-recipes.md](references/e2e-recipes.md)

## Stop
- A `waitForTimeout` is about to be added. It is a flake with a delay attached — await the condition instead.
- Workers share an account, a context, or a database. They will race; isolate before running in parallel.
- The suite is about to run against production without explicit approval. These tests write data.

## Rules
- No fixed sleeps. Rely on auto-waiting and explicit expectations; a `waitForTimeout` is a flake with a delay attached.
- Visual baselines are per platform and browser — font rendering differs. Generate them in the image CI uses, allow a small pixel threshold, mask timestamps, avatars, and ads, and disable animations before capturing.
- Never run an E2E suite against production without explicit approval; these tests write data.
- Keep the suite narrow. Push logic assertions down to `test-engineering`; every journey you add here you pay for on every run, forever.
- Screenshots as evidence for a human, outside a test run, belong to `screenshot-capture`.

## Checklist
- [ ] Auth state saved once and reused; one test still exercises the real login.
- [ ] Each worker has its own context, account, and data namespace.
- [ ] Selectors role- or label-based; no fixed sleeps anywhere.
- [ ] Trace, screenshot, and video captured on failure.
- [ ] Visual baselines generated in the CI image, volatile regions masked.
- [ ] Responsive and keyboard-only checks cover the critical journeys.
