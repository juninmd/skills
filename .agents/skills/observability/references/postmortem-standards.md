# Postmortem Standards

Blameless: name systems and gaps, not people. "The deploy pipeline allowed X" — never "engineer Y forgot".

## Template
```markdown
# PM-YYYY-MM-DD: <title>
Severity: SevN | Duration: detect HH:MM → mitigate HH:MM → resolve HH:MM
Impact: <users/requests/data affected, quantified>

## Timeline (UTC, facts only)
- HH:MM event/action — evidence link

## Root cause and contributing factors
<the trigger, plus each condition that let it become an incident>

## What went well / what hurt
<detection speed, mitigation friction, tooling gaps>

## Corrective actions
| Action | Type | Owner | Due | Verification |
|---|---|---|---|---|
| ... | prevent/detect/mitigate | @name | date | alert fires in test / regression test fails without fix |
```

## Standards
- Detection gap is always analyzed: why did the signal (not a customer) not find it first?
- Every root cause gets at least one *prevent* or *detect* action; process-only actions ("add review step") need justification.
- Verification is executable: a test, an alert drill, a chaos experiment, or a runbook rehearsal — not "done" by assertion.
- Actions unowned or overdue for 30 days are escalated, not silently dropped.
- Re-read the last postmortem for the same service before closing; repeated contributing factors are a Sev-level finding on their own.
