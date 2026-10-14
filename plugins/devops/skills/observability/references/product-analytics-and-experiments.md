# Product Analytics and Experiments

Open when instrumenting product events, building a tracking plan, or running an A/B test to decide whether a change helped users. System health telemetry (logs, metrics, traces) stays in the main workflow; this file covers behavior and outcome data.

## Contents

- Tracking plan
- Event design
- Consent and privacy
- Experiment design
- Reading results
- Stop conditions

## Tracking plan

Write the plan before the code, one row per event, and keep it in the repository beside the code that emits it.

| Event | Trigger | Properties (type) | Owner | Question it answers |
|---|---|---|---|---|
| `checkout_completed` | Order confirmed server-side | `order_id` (string), `value_cents` (int), `currency` (string) | payments | Conversion rate of the checkout |

- An event nobody can name a question for is noise; drop it.
- Emit business outcomes (payments, sign-ups, cancellations) from the server, where ad blockers and retries cannot distort them. Client events are for interaction only.
- Name events `object_action` in past tense and snake_case; never rename a live event, add a new one and retire the old.

## Event design

- A schema per event, validated in CI or at the collector; reject unknown properties instead of silently storing them.
- Include `event_id` for deduplication, a client timestamp and a server receive timestamp, `schema_version`, and the experiment assignments active at the time.
- Money as integer minor units plus currency; never floats.
- Identity: an anonymous ID before login, merged into the user ID at login, once. Merging on every page view corrupts funnels.

## Consent and privacy

- Optional analytics runs only after consent where the legal basis is consent; server-side outcome events usually rest on contract or legitimate interest. Record which basis applies per event (`privacy-lgpd-gdpr.md` in `security-ops`).
- No personal data in event names or free-text properties: no emails, names, CPF, or full URLs with query strings.
- Set retention on the analytics store like any other store.

## Experiment design

Decide these before launch and write them in the experiment brief:

| Item | Rule |
|---|---|
| Hypothesis | "Changing X will move metric Y because Z" |
| Primary metric | Exactly one, tied to the user outcome, fixed before launch |
| Guardrail metrics | Errors, latency, refunds, unsubscribes: things that must not get worse |
| Unit of randomization | Usually the user; the session only when users cannot be identified |
| Minimum detectable effect and sample size | From a power calculation (commonly 80% power, 5% significance); gives the run length |
| Duration | Whole weeks, to cover weekday and weekend behavior |

- Assign deterministically (hash of experiment key plus user ID) behind a feature flag, so a user keeps the same variant across sessions and devices.
- Log the exposure when the user actually sees the variant, not at assignment.

## Reading results

- **Sample ratio mismatch first:** if a 50/50 split arrived as 52/48 at scale, assignment or logging is broken; discard the result and fix the pipeline.
- **No peeking:** with a fixed-horizon test, read the result once at the planned sample size. If you must monitor continuously, use a sequential method designed for it.
- Report the effect size with its confidence interval, not only the p-value.
- Segment slicing after the fact is hypothesis generation, not proof; many slices will "win" by chance.
- A neutral result is a result: ship the simpler variant or keep the control.
- Remove the losing branch and the flag after the decision (`progressive-rollout.md` in `cloud-devops`).

## Stop conditions

- No primary metric or sample size agreed before launch: do not start the test.
- Guardrail metric degrades beyond its threshold: stop the experiment, whatever the primary metric says.
- The tracking plan requires personal data without a documented legal basis: stop and route to `security-ops`.
