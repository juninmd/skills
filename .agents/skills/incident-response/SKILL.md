---
name: incident-response
description: |
  Stabilize production incidents, mitigate impact fast, and drive blameless postmortems. Use for outages, error spikes, failed deploys, rollback decisions, data-integrity incidents, on-call triage, severity assessment, and corrective-action follow-up.
---

# Incident Response

## Preflight
Before any investigation, three answers — in this order.

```bash
kubectl rollout history deploy/<name> | tail -5     # what shipped, and when
gh run list --limit 5 --json conclusion,createdAt   # did a pipeline just land
date -u                                             # timestamp everything from here
```

Who is affected · what changed · is it spreading. Then declare, name the commander, and communicate — before opening a dashboard.

## First Five Minutes
In order. Do not skip ahead to the interesting part.

1. **Assess and declare.** User impact, blast radius, data risk, spreading or contained. Timestamp it.
2. **Name the commander.** One person decides; everyone else investigates.
3. **Post update one** before opening any dashboard: what broke, who is affected, next action, time of next update. Then hold that cadence.
4. **Mitigate.** Fastest safe reversal wins — rollback, flag off, scale out, fail over, rate-limit.
5. **Verify with the detecting signal**, not a proxy that looks better.

## Severity

| Sev | Shape | Response |
|---|---|---|
| 1 | Total outage, data loss or corruption, security breach | Page now, commander, continuous comms |
| 2 | Major feature down, or degraded for many users | Page, hourly updates |
| 3 | Partial or workaround-able, single tenant | Business hours, ticket |
| 4 | Cosmetic or internal-only | Backlog |

Spreading beats static: a Sev-3 growing 10%/hour is handled as a Sev-2.

## Before You Roll Back
Reverting the binary does **not** revert a dropped column, a rewritten row, or a consumed message. Old code on changed data corrupts more, faster.

| Release contained | Rollback safe? |
|---|---|
| Code only | Yes — roll back |
| Additive migration (new nullable column) | Yes — old code ignores it |
| Destructive migration (drop, rename, retype) | **No** — forward fix or restore |
| Backfill that rewrote rows | **No** — needs a data plan |
| Queue schema change already consumed | **No** — consumers are ahead |

## No Deploy Correlates?
Then the cause has been building. Check, in this order: saturation trending for days (disk, connections, memory), an expired certificate or token, a third-party quota or rate limit, a cron/retention boundary that just fired, a traffic shift or a new client.

```bash
kubectl get events --sort-by=.lastTimestamp | tail -30
kubectl rollout history deploy/<name>
openssl s_client -connect <host>:443 -servername <host> 2>/dev/null | openssl x509 -noout -dates
df -h && free -m
```

## Reference Routing
- Practical cases: [real-world-cases.md](references/real-world-cases.md)
- Severity matrix, comms cadence, mitigation decision tree: [incident-playbook.md](references/incident-playbook.md)
- Postmortem template and standards: [postmortem-standards.md](references/postmortem-standards.md)

## Stop
- The release contained a destructive migration or a backfill. **Do not roll back** — the binary reverts, the data does not.
- This looks like a security incident. Stop; a fast rollback destroys the evidence. Preserve state and route to `security-ops`.
- The detecting signal is not healthy yet. Do not declare resolved, however good the graphs look.

## Rules
- Mitigation outranks root cause. Never debug on fire when a rollback exists.
- One commander. Parallel investigation, single decision channel.
- No destructive recovery — data mutation, forced failover, cache purge — without stating the reversal path out loud first.
- Timeline entries are facts with timestamps, not interpretations. "Deploy 3f2a at 14:02" not "the deploy probably broke it".
- Declare resolved only after the detecting signal stays healthy for a stated window — 30 minutes, or a full traffic cycle — never at the first green point.
- A suspected security incident inverts this order: preserve state, rotate credentials, contain access. A fast rollback destroys the evidence. Delegate to `security-ops`.
- Hand root-cause analysis to `diagnostics` after stabilization, then come back for the postmortem. The signals you are reading are designed by `observability`.
- Blameless means the writeup names systems and gaps, never people. A postmortem that produces no corrective action with an owner and a verification is not closed.

## Checklist
- [ ] Severity declared and timestamped; commander named.
- [ ] First communication published before investigation, and the cadence held.
- [ ] Rollback safety checked against migrations and backfills before reverting.
- [ ] Impact mitigated and the detecting signal healthy for the stated window.
- [ ] Timeline and evidence preserved for the postmortem.
- [ ] Corrective actions owned, dated, and verifiable.
