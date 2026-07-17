---
name: incident-response
description: |
  Stabilize production incidents, mitigate impact fast, and drive blameless postmortems. Use for outages, error spikes, failed deploys, rollback decisions, data-integrity incidents, on-call triage, severity assessment, and corrective-action follow-up.
---

# Incident Response

## Workflow
1. Assess severity: user impact, blast radius, data risk, and whether it is spreading. Declare and timestamp.
2. Mitigate before diagnosing: rollback, feature-flag off, scale, failover, or rate-limit — the fastest safe reversal wins.
3. Verify mitigation with the same signal that detected the incident, not a proxy metric.
4. Preserve evidence during mitigation: logs, metrics snapshots, deploy IDs, and a timestamped action timeline.
5. Find root cause only after stability; correlate deploys, config changes, dependencies, and traffic shifts.
6. Write a blameless postmortem with contributing factors and verifiable corrective actions, each with an owner and a check.

## Reference Routing
- Practical incident cases: [real-world-cases.md](references/real-world-cases.md)
- Severity matrix, comms cadence, and mitigation decision tree: [incident-playbook.md](references/incident-playbook.md)
- Postmortem template and corrective-action standards: [postmortem-standards.md](references/postmortem-standards.md)

## Rules
- Mitigation outranks root cause; never debug on fire when a rollback exists.
- One incident commander; parallel investigation, single decision channel.
- No destructive recovery action (data mutation, forced failover, cache purge) without stating the reversal path first.
- Timeline entries are facts with timestamps, not interpretations.
- A postmortem without verified corrective actions is not closed.

## Checklist
- [ ] Impact is mitigated and verified by the detecting signal.
- [ ] Timeline and evidence are preserved.
- [ ] Postmortem actions are owned and verifiable.
