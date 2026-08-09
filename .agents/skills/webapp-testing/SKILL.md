---
name: webapp-testing
description: |
  Test web applications end to end in a real browser. Use for Playwright and browser automation, E2E flows, form submission, authentication flows, responsive checks, and visual regression.
---

# Webapp Testing

## Workflow
1. Identify the framework test commands, dev server, and existing E2E setup.
2. Define user journeys that cross real boundaries: navigation, forms, auth, and state persistence.
3. Test through the UI against a real or controllable backend; stub only third-party services.
4. Use robust selectors: `data-testid` or roles over CSS; wait on user-visible state, not fixed timeouts.
5. Run headless by default; capture traces and screenshots on failure.
6. Verify responsive breakpoints and keyboard-only flows for critical journeys.

## Rules
- Never run E2E suites against production without explicit approval.
- No fixed sleeps; rely on auto-waiting and explicit expectations.
- Isolate test data with per-test setup and cleanup.
- Keep E2E suites narrow; push logic assertions down to unit level.

## Checklist
- [ ] Critical journeys cross real boundaries.
- [ ] Selectors and waits are robust; traces on failure.
- [ ] Responsive and keyboard flows verified.
