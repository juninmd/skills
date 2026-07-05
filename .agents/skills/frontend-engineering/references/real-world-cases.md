# Frontend Real-World Cases

Use this first when the task is a practical UI build, bug, or review.

## Existing App Change
- Trace the real route, component owner, data source, styling layer, and test command before editing.
- Preserve the design system and component primitives already in use.
- Add states with the change: loading, empty, error, disabled, overflow, and slow network.
- Verify with focused tests, production build, browser console, keyboard navigation, and at least one narrow responsive check.

## React State Bug
- Check whether state should be controlled, local, URL-backed, server-backed, or reset by `key`.
- Avoid copying props into state unless the UI intentionally forks editable draft state.
- Prefer derived values during render; use effects only for external synchronization.

## Next.js Data Boundary
- Default to Server Components for data and secret access.
- Use Client Components for interactivity, browser APIs, and local UI state.
- Confirm caching behavior explicitly; do not assume `fetch` semantics across Next.js versions.
- Stream slow data where the user benefits from progressive rendering.

## Component or Form
- Start from the user workflow and validation contract, not the widget list.
- Use native labels, fieldsets, button semantics, and form submission where possible.
- Test keyboard order, focus recovery after errors, validation text, and double-submit protection.

## Performance or Hydration
- Reproduce the metric or warning first.
- Inspect bundle ownership before adding memoization or dynamic imports.
- Fix hydration mismatches by making server and client initial render deterministic.
- Prove improvement with before/after build output, profiler trace, or browser measurement.
