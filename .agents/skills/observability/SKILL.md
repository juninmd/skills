---
name: observability
description: |
  Design logging, metrics, tracing, and alerting so production behavior is provable. Use for structured logging, SLO/SLI definition, dashboard design, alert thresholds, tracing, log retention, and incident signal quality.
---

# Observability

## Workflow
1. Define the user-visible outcomes and the SLIs that measure them: availability, latency, error rate, throughput.
2. Set SLO targets with an explicit error budget; leave room for change and incident recovery.
3. Log structured events (JSON) with correlation IDs, durations, and outcomes; never secrets or PII.
4. Add RED metrics (rate, errors, duration) at service boundaries; add tracing wherever latency spans services.
5. Alert on SLO burn rate, not on every threshold crossing; page only when a user-visible SLO is at risk.
6. Verify signal quality: dashboards and alerts must show the same numbers the incidents are judged by.

## Rules
- Correlation IDs must cross log, metric, and trace contexts.
- An alert without an owner and a runbook is noise; write both before enabling it.
- Log levels: debug for diagnosis, info for lifecycle events, warn for recoverable anomalies, error for user-visible failure.
- Define retention and sampling policy before data grows unbounded.
- Test alert firing with synthetic failures; never tune thresholds to silence pages.

## Checklist
- [ ] SLIs and SLO targets are explicit.
- [ ] Logs, metrics, and traces share correlation IDs.
- [ ] Alerts page on real SLO risk with owners and runbooks.
