---
name: observability
description: |
  Design logging, metrics, tracing, and alerting so production behavior is provable. Use for structured logging, SLO/SLI definition, dashboard design, alert thresholds, tracing, log retention, and incident signal quality.
---

# Observability

## Preflight
```bash
rg -n 'OTEL_|opentelemetry|prom_client|micrometer' src/ | head
curl -sS localhost:9090/api/v1/status/tsdb | jq '.data.seriesCountByMetricName[:5]'  # cardinality today
rg -n 'labels?\(|withTags' src/ | head        # what is already being labelled
```

Name the user-visible outcome before naming a metric. An SLI nobody can tie to a user is a graph.

## Workflow
1. Name the user-visible outcomes, then the SLIs that measure them: availability, latency, error rate, throughput. An SLI nobody can tie to a user is a graph, not a signal.
2. Set SLO targets with an explicit error budget, leaving room for change and for incident recovery. 100% is not a target; it is a refusal to ship.
3. Instrument with OpenTelemetry rather than a handmade scheme: one SDK for logs, metrics and traces, trace context propagated across every hop, semantic conventions for span and attribute names.
4. Emit structured events (JSON) carrying trace and span ids, duration, and outcome — never secrets or PII.
5. Add RED metrics (rate, errors, duration) at every service boundary; add tracing wherever latency crosses a service.
6. Choose sampling deliberately, and keep 100% of errors either way.
7. Alert on SLO burn rate, not on every threshold crossing.
8. Verify signal quality: the dashboard, the alert, and the incident review must show the same number.

## Cardinality Is the Outage
Each label value multiplies stored series. One `user_id` label on a modest service is millions of series, and the first symptom is the metrics backend falling over during the incident you needed it for.

| Never a label | Use instead |
|---|---|
| user id, request id, session id | put it in the log/span, join by trace id |
| raw URL path (`/order/8123`) | the route template (`/order/:id`) |
| error message string | a bounded error code |
| customer name, email | a bounded tier or region |

Check the series count before shipping a new label — not after.

## Alert Routing

| Condition | Route | Why |
|---|---|---|
| User-visible SLO burning fast | **Page** | Someone must act now |
| Slow budget burn, toil, rising debt | **Ticket** | Real, not urgent |
| Saturation predicting an outage — disk filling, pool exhaustion, cert expiry | **Page** | Burn rate only turns positive after users are hurt |
| Everything else | **Dashboard** | Not every number deserves a human |

Multi-window burn rate beats a static threshold: a fast window (5m) catches the outage, a slow window (1h) suppresses the blip.

## Sampling

| Strategy | Keeps | Costs |
|---|---|---|
| Head (decide at ingress) | Cheap, simple | Blind — drops the slow trace you needed |
| Tail (decide after completion) | Slow and failed traces | Needs a buffering collector, more memory |
| Always-on for errors | Every failure | Nothing worth arguing about |

## Stop
- A proposed label is unbounded — user id, request id, raw path, error string. Stop; that is the outage, not the metric.
- An alert has no owner and no runbook. Do not enable it; it is noise with a pager attached.
- A threshold is being widened to silence a page. Either the signal is wrong or the system is — fix one of them.

## Rules
- An alert without an owner and a runbook is noise. Write both **before** enabling it.
- Never tune a threshold to silence a page. Either the signal is wrong or the system is; both need a fix, not a wider bound.
- Test alert firing with a synthetic failure. An alert nobody has ever seen fire is an untested code path.
- Log levels mean things: debug for diagnosis, info for lifecycle events, warn for recoverable anomalies, error for user-visible failure. Everything at `error` is the same as nothing at `error`.
- Define retention and cost limits before the data grows; observability spend is the line item that surprises people, and `cost-engineering` owns the tradeoff.
- Trace context must survive every hop — queues and background jobs included. A trace that stops at the async boundary hides exactly the latency you are hunting.
- Live outage triage and postmortems belong to `incident-response`; design the signals they will read here.

## Checklist
- [ ] SLIs tie to user-visible outcomes; SLO targets and error budget explicit.
- [ ] Trace context propagates across services, queues, and jobs, and appears in logs.
- [ ] Every metric label is bounded; series count checked before shipping.
- [ ] Alerts classified page/ticket/dashboard, each with an owner and a runbook.
- [ ] Alert firing exercised with a synthetic failure.
- [ ] Retention and cost limits set.
