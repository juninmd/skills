
# UI State Design

## Contents
- Preflight, Workflow
- The State Set
- One Status, Not Three Booleans
- The Race Nobody Handles
- Duration Bands
- Microcopy and Touch Targets
- Stop, Rules, Checklist

## Preflight
```bash
rg -n 'isLoading|isError|isFetching' src/ | head    # booleans that can contradict
rg -n 'AbortController|cancelToken|signal' src/ | head
```

List the states before drawing any markup. The happy path will get built regardless; the others only exist if you plan them.

## Workflow
1. List the states **first**. The table below is a starting set; strike only what truly cannot occur.
2. For each state, decide what the user sees and what they can still do, including which controls remain enabled.
3. Model status as a single value with named cases, never as independent booleans.
4. Pick the loading treatment from the expected wait.
5. Make every error recoverable: say what failed, whether it retries on its own, and which action fixes it.
6. Write copy for every state using the microcopy rules below: the action's verb, its outcome, each error.
7. Before calling it done, open the screen in each state with real data, including slow and failing paths.

## The State Set

| State | Shows | Common failure |
|---|---|---|
| Idle | the content | none |
| Loading (first) | skeleton matching the final layout | spinner that shifts the layout when data lands |
| Loading (refresh) | current data plus a subtle indicator | clearing the screen during a background refresh |
| Empty, no data yet | what belongs here and the action that creates it | a blank panel |
| Empty, no results | what was filtered and how to clear it | looks the same as "no data yet" |
| Partial | what arrived and what failed | all-or-nothing failure |
| Error | cause, whether retry works, next action | "Something went wrong" |
| Forbidden | which kind of block, and the next action | shown as an error or as empty |
| Stale | data, its age, and a refresh | old data silently presented as current |
| Offline | queued or degraded, said explicitly | endless spinner |
| Success | confirmation, with undo where it fits | a toast that disappears before it can be read |

## One Status, Not Three Booleans

```ts
// Permits isLoading && isError && data, combinations that mean nothing
{ isLoading: boolean; isError: boolean; data?: T }

// Cannot contradict itself
type State<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; fetchedAt: number }
  | { status: 'empty'; reason: 'no-data' | 'no-results' }
  | { status: 'forbidden'; reason: 'no-permission' | 'plan' | 'disabled' }
  | { status: 'error'; error: AppError; retryable: boolean };
```

## The Race Nobody Handles
When filters, tabs, or routes change quickly, an **older** request can finish last and overwrite the current view. It shows up on slow connections and almost never on a developer machine, which makes it the most common real bug here.

```ts
const controller = new AbortController();
useEffect(() => () => controller.abort(), [key]);   // cancel the previous
// and ignore late responses whose key is no longer current
if (responseKey !== currentKey) return;
```

## Duration Bands

| Wait | Show |
|---|---|
| < 200ms | nothing; a flash of skeleton is worse than a short pause |
| 200ms - 1s | skeleton in the final layout |
| 1s - 5s | skeleton, kept visible long enough that it does not flicker if data arrives fast |
| > 5s | a message that acknowledges the wait, plus cancel |
| Unknown or long job | progress, or a way to leave and return later |

## Microcopy and Touch Targets
Text is part of the state's design. Name things after what the user manages, not after the implementation ("Notifications", not "Webhook config").

| Moment | Wrong | Right |
|---|---|---|
| CTA | "Submit", "OK" | the actual verb: "Save changes", "Publish post" |
| Result | "Success!" | same verb in past tense: "Saved", "Post published" |
| Error | "Sorry, something went wrong." | cause plus fix: "Couldn't save: you're offline. Your edits are kept; retry when connected." |
| Field error | red banner above the form | beside the field: "Use 8 or more characters." |
| Empty | "No data" | what belongs here plus the action: "No invoices yet. Create your first invoice." |

- One action, one name across the flow: the button, the pending label ("Saving..."), the toast, and the history entry share the verb.
- Errors do not apologize or blame. State the cause in the product's voice, preserve the user's input, and offer the fixing action.
- Sentence case, plain verbs, no filler; each string has one job.
- Put form feedback inline next to the offending field, on blur and on submit, and focus the first invalid field after a failed submit. Timing and focus details: [state-recipes.md](state-recipes.md).
- Touch targets measure at least 44x44 CSS px with 8px gaps so a thumb lands on one control. Extend the hit area with padding or a pseudo-element when the icon is smaller. 24x24 is only the WCAG 2.5.8 AA minimum; see [accessibility](accessibility.md).

## Stop
- State is built from independent booleans. Contradictory combinations can occur, so fix the model first.
- A late response can overwrite current data. Cancel the prior request and discard stale keys before shipping.
- An optimistic update has no defined rollback. A silent revert looks like data loss.
- An error says only "Something went wrong", or apologizes without naming cause and fix.

## Rules
- "Not allowed" is its own state, separate from error and empty. Missing permission, a disabled feature, and an insufficient plan each need their own wording and next step.
- An empty state is a first-run moment: say what belongs here and offer the action that creates it. Never ship a blank panel.
- Optimistic updates need a defined rollback **and** a visible failure. A silent revert reads as lost data, and users stop trusting the screen.
- Destructive actions need a confirmation naming the target, or an undo window. Prefer undo; people click through confirmations on reflex.
- Disable a control only when you can explain why; a disabled button with no reason is a dead end. Prefer enabled with feedback.
- Announce state changes to assistive technology as well as visually. [accessibility](accessibility.md) owns the semantics, [frontend-design](frontend-design.md) the visual treatment, and `frontend-engineering` the implementation.

## Reference Routing
- State union, races, permission copy, duration bands, announcements, form rules: [state-recipes.md](state-recipes.md)

## Checklist
- [ ] Each state in the set is designed or explicitly ruled out.
- [ ] Status is one value with named cases; contradictory combinations are unrepresentable.
- [ ] Late responses cannot overwrite current data.
- [ ] Empty separates "no data yet", "no results", and "failed".
- [ ] Errors give cause, retry-ability, and next action; optimistic updates roll back visibly.
- [ ] CTA verbs match their result messages; errors name cause and fix; field errors render inline.
- [ ] Touch targets are at least 44x44 CSS px.
- [ ] Every state exercised with real data, including slow and failing paths.
