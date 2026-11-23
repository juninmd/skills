---
name: vitals-and-cost
description: |
  Fix real-user web speed and cut cloud or LLM token spend. Use for Core Web Vitals (LCP, INP, CLS) at p75, Lighthouse, RUM and field data, TTFB, spend attribution per tenant or job, idle-resource sweeps, rightsizing, prompt caching. Trigger on 'improve LCP', 'the cloud bill is too high', 'cut token spend'. Not CPU, memory or benchmark profiling (performance-engineering).
---

# Vitals and Cost

Two field-facing metrics with one rule: the verdict comes from production numbers (p75 vitals, cost per unit), never from a lab score or an absolute bill.

**Not this skill:** profiling code, memory leaks, N+1, benchmarks or load tests (`performance-engineering`), component work (`frontend-engineering`), alerting (`observability`).

## Preflight
```bash
curl -sS -o /dev/null -w 'ttfb %{time_starttransfer} total %{time_total}\n' https://example.com   # server ruled out?
npx lighthouse https://example.com --preset=perf --form-factor=mobile --quiet                     # lab, iteration only
aws ce get-cost-and-usage --granularity MONTHLY --metrics UnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE --time-period Start=...,End=...                           # spend by service
```
Pick the mode and write the target: one failing vital at p75, or one cost unit (request, tenant, job) with today's number.

## Workflow
1. **Mode:** web speed → [web-performance](references/web-performance.md); spend → [cost-engineering](references/cost-engineering.md).
2. **Baseline** from field data (own RUM, then the public 28-day dataset) or from attributed cost per unit; never a single lab run or the raw bill.
3. **Name one cause:** the one failing vital, or the top line item ranked by cost × growth.
4. **One change**, aimed at that cause. Server first for LCP; idle resources first for spend.
5. **Re-measure** the same field metric or unit, with its traffic level. A lab-only win did not happen.
6. **Guard:** a CI budget for bundle size and vitals, or a spend limit that stops, not one that reports.

## Decision table
| Symptom | Mode | Open |
|---|---|---|
| LCP/INP/CLS failing at p75 | web | [web-performance](references/web-performance.md), then [vitals-and-field-data](references/vitals-and-field-data.md) |
| Lab score good, users still slow | web | [vitals-and-field-data](references/vitals-and-field-data.md) |
| Bill grew, cause unknown | cost | [cost-engineering](references/cost-engineering.md) attribution table |
| LLM or token spend too high | cost | [cost-engineering](references/cost-engineering.md) LLM Cost |
| TTFB high, front end fine | handoff | `performance-engineering` or `backend-systems` |

## Stop
- The verdict is a lab score or an absolute monthly bill: take field data or a per-unit number first.
- The server was not ruled out (TTFB) before front-end work.
- The fix shrinks cost by raising latency risk and the trade is unnamed.

## Rules
- Fix one vital at a time; two at once proves neither.
- Report before and after in milliseconds at p75, or cost per unit with traffic.
- Rightsizing is two-sided: name over- versus under-provisioning before resizing.
- Sweep idle and untagged resources before touching code.
- Profiling, load tests and benchmark noise go to `performance-engineering`.

## Checklist
- [ ] Target written: failing vital at p75, or cost unit and today's number.
- [ ] Baseline from field data or attributed cost, not a lab run or raw bill.
- [ ] Server response ruled out before any front-end change.
- [ ] One change per cycle; re-measured on the same metric.
- [ ] A guardrail exists: CI vitals budget or a spend limit.

## Reference Routing
- Core Web Vitals workflow, thresholds, cause routing and fixes: [web-performance.md](references/web-performance.md)
- Field data sources (RUM vs public dataset vs lab) and per-metric root causes: [vitals-and-field-data.md](references/vitals-and-field-data.md)
- Cost attribution, idle sweeps, rightsizing, Kubernetes throttling, LLM cost: [cost-engineering.md](references/cost-engineering.md)
- Everything else: [Reference Map](references/TOPIC_MAP.md)
