# E2E Recipes

## Reuse an authenticated session

Logging in through the form in every test is the single biggest cost in a browser suite: a page load, a network round trip, and a redirect per test, multiplied by every test.

Pattern:

1. In a setup project (or a global setup step that runs once), drive the real login form once.
2. Save the resulting browser storage — cookies plus local storage — to a file.
3. Point every other test at that saved state so it starts already authenticated.

```ts
// auth.setup.ts
await page.goto("/login");
await page.getByLabel("Email").fill(user.email);
await page.getByLabel("Password").fill(user.password);
await page.getByRole("button", { name: "Sign in" }).click();
await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
await page.context().storageState({ path: ".auth/user.json" });

// config: use: { storageState: ".auth/user.json" }, dependencies: ["setup"]
```

Rules that keep it honest:

- Keep exactly one test that exercises the real login form, including the failure path. Reusing state everywhere else must not mean login is untested.
- Store one state file per role (admin, member, viewer, logged-out) rather than switching roles mid-test.
- Treat the file as a cache: regenerate it when the token expires or the fixture user changes, and never commit it.
- Tokens stored server-side in a session table still need the seeded user to exist; regenerate state whenever the database is reset.
- If auth depends on a third-party identity provider, stub the provider or use a test-only token issuer rather than automating someone else's login page.

## Parallelism and isolation

Browser suites parallelize well and break in exactly one way: shared mutable state.

- **Browser context per test.** A context is an isolated cookie jar, storage, and cache. Give each test its own; sharing one context across parallel tests means one test's logout kills another's session.
- **Account per worker.** Two tests logged in as the same user will race on the same rows, and a "delete my account" test will detonate its neighbors. Seed users as `user-{workerIndex}@example.test` and derive all data from the worker index.
- **Data per worker.** Options in descending order of fidelity: a database per worker, a schema per worker, a tenant/organization per worker, or namespaced record prefixes. Whatever the level, create it in a per-worker fixture and tear it down after.
- **Serialize what cannot be split.** Tests touching genuinely global state — feature flags, system settings, a shared queue — go in a serial group, not in the parallel pool.
- Avoid cross-test ordering assumptions entirely; the runner will shard differently on the next run.

## Visual regression

- **Baselines are per platform and browser.** Font rasterization differs between operating systems, so a baseline generated on a laptop will never match CI. Generate and update baselines inside the same container image CI uses, and store one set per platform/browser/viewport combination.
- **Allow a small threshold.** Compare with a maximum different-pixel count or ratio, plus a per-pixel color tolerance, so antialiasing noise does not fail the run. Zero tolerance produces a suite nobody trusts.
- **Mask the volatile.** Timestamps, relative dates, avatars, random ids, ads, carousels, and live counters are masked or stubbed before capture.
- **Freeze motion.** Disable CSS animations, transitions, and the caret; pin the clock; and wait for fonts and images to finish before capturing.
- Prefer component-level snapshots over full-page ones: they fail for one reason and are far easier to review.
- Review diffs as artifacts. A visual failure needs the expected, actual, and diff images published by the CI job.

## Passes locally, fails in CI

Usual causes, in the order worth checking:

1. **Machine speed.** CI is slower and more contended: an animation or fetch that had finished locally has not. Fix by waiting on the observable condition, not by raising timeouts.
2. **Environment differences.** Viewport size, device scale factor, timezone, locale, and color scheme all differ from the developer's machine. Pin all of them explicitly in config.
3. **Missing or different seed data.** The local database has leftovers from manual testing that the test silently relied on.
4. **Concurrency.** CI runs full parallelism; locally the developer ran one file. Re-run locally with the same worker count.
5. **Headless versus headed rendering** and missing system fonts in the container.

Diagnose from artifacts, not guesses: capture trace, video, screenshot, console logs, and network log on failure, and open the trace first. Reproduce by running the suite locally in the CI container image before changing any test code.
