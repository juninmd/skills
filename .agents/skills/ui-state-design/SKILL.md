---
name: ui-state-design
description: |
  Design every state a screen can be in, not just the happy one. Use for loading skeletons, empty and forbidden states, error and retry, stale data, response races, offline behavior, optimistic updates, and undo.
---

# UI State Design

## Preflight
```bash
rg -n 'isLoading|isError|isFetching' src/ | head    # booleans that can contradict
rg -n 'AbortController|cancelToken|signal' src/ | head
```

Enumerate the states before writing markup. The happy path is the one state that will definitely get built anyway.

## Workflow
1. Enumerate the states **before** writing markup. The list below is the starting set; delete what genuinely cannot happen.
2. Decide what the user sees and what they can still do in each — including which controls stay enabled.
3. Model state as one value with named cases, never as independent booleans.
4. Choose the loading treatment by expected wait.
5. Make every error recoverable: what failed, whether it retries itself, and the action that fixes it.
6. Walk the screen once per state with real data, slow and failing paths included, before calling it done.

## The State Set

| State | Shows | Common failure |
|---|---|---|
| Idle | the thing | — |
| Loading (first) | skeleton matching the final layout | spinner that shifts layout on arrival |
| Loading (refresh) | existing data + subtle indicator | blanking the screen on a background refresh |
| Empty — no data yet | what goes here + the action that creates it | a blank panel |
| Empty — no results | what was filtered + how to clear it | indistinguishable from "no data yet" |
| Partial | what arrived + what failed | all-or-nothing failure |
| Error | cause, retry-ability, next action | "Something went wrong" |
| Forbidden | which kind, and the next action | rendered as an error, or as empty |
| Stale | data + its age + refresh | silently showing old data as current |
| Offline | queued or degraded, explicitly | infinite spinner |
| Success | confirmation, and undo where it applies | a toast that vanishes before it is read |

## One Status, Not Three Booleans

```ts
// Allows isLoading && isError && data — three states that make no sense
{ isLoading: boolean; isError: boolean; data?: T }

// Cannot lie
type State<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; fetchedAt: number }
  | { status: 'empty'; reason: 'no-data' | 'no-results' }
  | { status: 'forbidden'; reason: 'no-permission' | 'plan' | 'disabled' }
  | { status: 'error'; error: AppError; retryable: boolean };
```

## The Race Nobody Handles
Fast filter, tab, or route switching lets an **earlier** request resolve last and overwrite the current view. It reproduces on a slow connection and never on the developer's machine — the single most common real bug in this area.

```ts
const controller = new AbortController();
useEffect(() => () => controller.abort(), [key]);   // cancel the previous
// and drop late responses whose key is no longer current
if (responseKey !== currentKey) return;
```

## Duration Bands

| Wait | Show |
|---|---|
| < 200ms | nothing — a flashed skeleton is worse than a pause |
| 200ms – 1s | skeleton in the final layout |
| 1s – 5s | skeleton, held long enough not to flash if it resolves fast |
| > 5s | a message that admits the wait, plus cancel |
| Unknown / long job | progress, or a way to leave and come back |

## Stop
- State is modelled as independent booleans. Contradictory combinations are representable — fix the model first.
- A late response can overwrite current data. Cancel the previous request and drop stale keys before shipping.
- An optimistic update has no defined rollback. Silent reversion reads to the user as data loss.

## Rules
- "Not allowed" is its own state, neither error nor empty. No permission, feature disabled, and plan insufficient each need their own words and their own next action.
- An empty state is a first-run experience: say what goes here and give the action that creates it. Never ship a blank panel.
- Optimistic updates need a defined rollback **and** a visible failure. A silent reversion reads to the user as data loss, and they will not trust the screen again.
- Destructive actions get a confirmation that names the target, or an undo window. Prefer undo — confirmations are clicked through reflexively.
- Disable a control only when you can say why; a disabled button with no explanation is a dead end. Prefer enabled-with-feedback.
- Announce state changes to assistive technology, not only visually — `accessibility` owns the semantics; the visual treatment belongs to `frontend-design`; the implementation to `frontend-engineering`.

## Reference Routing
- State union, races, permission copy, duration bands, announcements, form rules: [state-recipes.md](references/state-recipes.md)

## Checklist
- [ ] Every state in the set is either designed or explicitly ruled out.
- [ ] Status is one value with named cases; contradictory combinations are unrepresentable.
- [ ] Late responses cannot overwrite current data.
- [ ] Empty distinguishes "no data yet" from "no results" from "failed".
- [ ] Errors state cause, retry-ability, and next action; optimistic updates roll back visibly.
- [ ] Every state walked with real data, including the slow and failing paths.
