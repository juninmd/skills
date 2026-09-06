# Incident Cases

Real incident shapes and the decisions that resolved them.

## Case: deploy looks fine, errors spike 20 minutes later
- Symptom: 5xx rate climbs gradually, not at deploy time.
- Trap: team ruled out the deploy because the spike wasn't immediate; it was connection-pool exhaustion from a slow leak in the new release.
- Action: rollback anyway — the deploy is the prime suspect until proven innocent. Errors stopped.
- Lesson: correlation window for a deploy is hours, not minutes.

## Case: rollback made it worse
- Symptom: rollback restored old code against a migrated database schema.
- Action: roll forward with a hotfix; the schema change was expand-phase-only afterward.
- Lesson: rollback is only safe when the data layer is backward compatible. Check migration state before reverting.

## Case: "quick fix" during the incident created a second incident
- Symptom: engineer flushed a cache to "reset state"; thundering herd took down the database.
- Lesson: every mitigation states its reversal path and blast radius first. Cache purges under load are destructive actions.

## Case: silent data corruption found 3 days late
- Symptom: no alerts; support tickets reported wrong balances.
- Action: freeze the write path first (feature flag), snapshot before repair, replay from event log with a dry-run diff.
- Lesson: for data-integrity incidents, stopping the bleed outranks availability. Never repair in place without a snapshot.

## Case: the postmortem that fixed nothing
- Symptom: same outage 6 weeks later.
- Trap: corrective actions were "be more careful" and an unowned ticket.
- Lesson: each action needs an owner, a deadline, and a verifiable check (alert exists, test fails without fix, runbook tested in drill).
