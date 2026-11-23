# vitals-and-cost Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `web-performance.md` | Step-by-step Core Web Vitals workflow: pick the one failing vital at p75, rule out the server via TTFB, then route to that vital's cause. For a perf regression or Lighthouse audit |
| `vitals-and-field-data.md` | Vitals thresholds at p75, where field data comes from (own RUM vs public 28-day dataset vs lab), and root causes per metric. For judging real-user performance, not one lab run |
| `cost-engineering.md` | Attributing and cutting cloud and token spend per unit (request, tenant, job): ranking by cost x growth, tag attribution, idle-resource sweeps, rightsizing, Kubernetes throttling, LLM cost |
