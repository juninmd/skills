# Alerting, SLOs, and On-Call

Deeper treatment of the alerting philosophy named in `SKILL.md`. Source: Google's
*Site Reliability Engineering* and *The Site Reliability Workbook* (sre.google).

## Symptom-Based vs Cause-Based Alerting

> "Your monitoring system should address two questions: what's broken, and why?
> The 'what's broken' indicates the symptom; the 'why' indicates a (possibly
> intermediate) cause." — [Google SRE, monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)

A symptom-based alert fires because a user is affected. A cause-based alert
fires because some internal state crossed a line — and that line crosses
constantly in a healthy system (a GC pause, a failover, a retry). Paging on
causes trains on-call to silence the pager, which is the outcome that kills
the next real page.

| Alert | Kind | Verdict |
|---|---|---|
| p99 latency > SLO threshold for 5m | Symptom | Page |
| 5xx rate > 1% of requests | Symptom | Page |
| One pod restarted | Cause | Never page alone |
| CPU on one replica > 80% | Cause | Dashboard only — the fleet absorbs it |
| Disk projected to fill in 4h | Cause, but imminent | Page — it will become a symptom before a human notices otherwise |
| Certificate expires in 3 days | Cause, but imminent | Ticket now, page inside the last day |
| Connection pool at 95% and rising | Cause, but imminent | Page — see retry storms below for why this one escalates fast |

Rule of thumb from the same chapter: spend most alerting effort on symptoms;
reserve cause-based pages for causes that are "very definite, very imminent" —
saturation about to become an outage, not noise about to become nothing.

## SLO Burn-Rate Alerting

A static threshold ("error rate > 1%") cannot tell a five-minute blip from a
slow bleed that will exhaust the quarter's error budget by Thursday.
Multiwindow, multi-burn-rate alerting fixes both failure modes at once: a
short window catches and clears fast, a long window confirms the budget is
actually draining ([Google SRE Workbook, alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)).

| Severity | Long window | Short window | Burn rate | Budget consumed |
|---|---|---|---|---|
| Page | 1 hour | 5 minutes | 14.4x | 2% |
| Page | 6 hours | 30 minutes | 6x | 5% |
| Ticket | 3 days | 6 hours | 1x | 10% |

Both windows must breach before the alert fires. The short window makes the
page clear within minutes of the problem actually stopping, instead of
lingering for the full long-window duration — the failure mode of a
single-window burn-rate alert.

```promql
# 1h/5m fast-burn page condition (Prometheus-style)
(
  sum(rate(http_requests_total{code=~"5.."}[1h])) / sum(rate(http_requests_total[1h])) > 14.4 * (1 - 0.999)
) and (
  sum(rate(http_requests_total{code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 14.4 * (1 - 0.999)
)
```

## Golden Signals as the Instrumentation Baseline

Before adding a bespoke metric, check it is not already one of the four
([Google SRE, monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)):

| Signal | Question | Typical instrument |
|---|---|---|
| Latency | How long did it take, split success from failure | histogram per route, success and error latency reported separately |
| Traffic | How much demand is hitting the system | request rate, queue depth, concurrent sessions |
| Errors | What fraction failed, explicit and implicit | error rate by class (4xx vs 5xx vs timeout) |
| Saturation | How full is the most constrained resource | pool/queue occupancy, disk %, memory headroom, thread pool depth |

A dashboard that cannot answer all four for a service is missing a signal,
not missing a chart.

## Toil and Its Budget

Toil is "manual, repetitive, automatable, tactical, devoid of enduring value,
and scales linearly with the service" ([Google SRE, eliminating toil](https://sre.google/sre-book/eliminating-toil/)).
A runbook step run by hand for the third time in a month is not a process —
it is unautomated toil. Track on-call toil hours per rotation; a rotation
that spends the majority of its time on repeat manual tasks has no capacity
left to fix the causes, and the toil compounds next rotation.

## On-Call Handoff Checklist

Run this at every rotation boundary — a Slack message is not a handoff.

- [ ] Open incidents and their current mitigation state, with owners.
- [ ] Silenced or snoozed alerts, and the exact time each silence expires.
- [ ] Known-degraded systems and the workaround in effect.
- [ ] Deploys, migrations, or feature flags scheduled during the shift.
- [ ] Freeze windows (holiday, launch, compliance) and their end date.
- [ ] Runbook gaps found last rotation — fixed, or still open with an owner.
- [ ] Escalation path and paging contacts confirmed reachable.
- [ ] Error budget remaining for the period, so the incoming on-call knows how much risk is left to spend.
