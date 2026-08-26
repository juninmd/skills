# State Recipes

Detail behind the SKILL.md rules.

## Modeling states as one value

Independent booleans allow impossible combinations (`isLoading` true while `isError` true and `data` present). Use a single discriminated union so the compiler and the renderer only ever see a legal case:

```ts
type ViewState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }
  | { status: "partial"; data: T; missing: string[] }
  | { status: "stale"; data: T; fetchedAt: number }
  | { status: "forbidden"; reason: "no-permission" | "feature-off" | "plan" }
  | { status: "error"; error: Error; retryable: boolean }
  | { status: "success"; data: T };
```

Render with an exhaustive switch. A new case then fails to compile instead of falling through to a blank panel.

## Out-of-order responses

Symptom: the user switches filter A to B quickly, B resolves first, then A's slower response lands and paints the wrong list. It reproduces only under variable latency, so it survives review.

Fix, in order of preference:

1. Cancel the previous request (`AbortController`, or the query library's cancellation) when a new one starts.
2. Tag each request with the key that produced it (`filter`, `route`, `id`) and discard any response whose key is not the currently requested one.
3. As a fallback, keep a monotonically increasing request sequence number and ignore any response older than the latest applied.

Keying is required even with cancellation, because a cancelled request may already be in flight past the point of return.

## Permission and availability states

Distinguish these; they need different copy and different actions:

- No permission for this object — offer the request-access path or name who can grant it.
- Feature disabled for this workspace — link the setting, or say who can enable it.
- Plan insufficient — state what the plan includes and the upgrade action.
- Authenticated session expired — re-authenticate in place, preserving the user's unsaved input.

None of these are errors (nothing failed) and none are empty (there is data, it is withheld). Rendering them as either one produces a support ticket.

## Loading duration bands

- Under ~200ms: show nothing. A flash of skeleton reads as a glitch.
- 200ms to ~1s: skeleton matching the final layout, sized to prevent shift.
- Once a skeleton is shown, keep it for a floor of roughly 300-500ms even if data arrives sooner, so it does not flicker.
- Past ~5-10s: the skeleton is now a lie. Replace it with a message that acknowledges the wait, a cancel action, and progress if it can be estimated.

## In-place feedback rules

- A spinner that replaces the whole page throws away context. Keep the layout, mark only the region that is updating, and leave surrounding controls usable where the data behind them is still valid.
- Disable a submit control while its request is in flight and keep its width stable so the layout does not jump; swap the label rather than the element.
- Validate on blur and on submit, not on every keystroke — per-keystroke validation flags an entry as invalid while the user is still typing it. Show each message next to the field that caused it, and on submit failure focus the first invalid field.
- Re-validate on the server regardless of what the client checked.

## Announcing changes

Visual-only state changes are invisible to screen readers. Route status text through a polite live region, move focus to the error summary on a failed submit, and mark in-flight controls as busy. The `accessibility` skill owns the exact roles, focus order, and live-region semantics.
