# Incident Playbook

## Severity matrix
| Sev | Definition | Response |
|---|---|---|
| 1 | Full outage, data loss risk, or security breach in progress | All hands, incident commander, comms every 30 min |
| 2 | Major feature broken or degraded for many users | On-call + owner team, comms hourly |
| 3 | Partial degradation, workaround exists | On-call handles in business hours |
| 4 | Cosmetic or single-user | Ticket, no incident process |

Escalate when in doubt; downgrading is cheap, late escalation is not.

## Mitigation decision tree
1. Did a deploy/config change land in the last few hours? → rollback/revert first (verify DB backward compatibility before rolling back over migrations).
2. Is one dependency failing? → fail over, circuit-break, or degrade gracefully (serve cached/stale).
3. Is it load-shaped? → rate-limit, shed non-critical traffic, scale out.
4. Is data being corrupted? → stop the write path (flag off) before anything else.
5. Nothing safe available? → contain blast radius (isolate tenant/region) and diagnose.

Before any action: state the expected effect, the verification signal, and the reversal path in the incident channel.

## Roles
- Incident commander: decides, delegates, owns the timeline. Does not debug.
- Investigators: parallel hypotheses, report facts to one channel.
- Comms: status page and stakeholder updates on the cadence above; never promise ETAs you can't verify.

## Evidence to preserve during the incident
- Deploy IDs and diff links for the correlation window.
- Log excerpts and metric snapshots (dashboards change; screenshot or export).
- Every action with timestamp and actor — the timeline is written live, not reconstructed.

## Closing criteria
- Detecting signal back to baseline for a full evaluation window.
- Follow-up alert armed for recurrence.
- Postmortem scheduled within 5 business days (see postmortem-standards.md).
