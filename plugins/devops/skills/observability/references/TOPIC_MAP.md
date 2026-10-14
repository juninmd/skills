# observability Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `alerting-and-oncall.md` | Symptom vs cause-based alerting, SLO burn-rate math, golden signals, toil, on-call handoff checklist |
| `resilience-and-tracing.md` | Trace propagation across queues/jobs, log sampling at volume, clock skew in log correlation, retry storms and stability patterns, catching cardinality explosions in CI |
| `debugging-phases.md` | Full 6-phase debugging method — build a fast pass/fail feedback loop, reproduce, generate falsifiable hypotheses, fix root cause — when there's no repro yet and the bug isn't obvious |
| `diagnostics-real-world-cases.md` | Fast triage checklist for a known failure shape (UI/runtime bug, flaky test, timeout/perf regression, network/TLS) when you need the isolation steps, not the full methodology |
| `diagnostics.md` | General fault-triage workflow plus the layer-triage command table (DNS, route, port, TLS, HTTP, timing) and flaky-failure reproduction, when you don't yet know which layer is at fault |
| `incident-playbook.md` | Deciding severity and mitigation mid-incident — decision tree (rollback vs failover vs rate-limit vs flag-off), commander/investigator/comms roles, evidence to preserve, closing criteria |
| `incident-response.md` | The first five minutes of a live incident — preflight commands for what shipped, declare/commander/first-comms sequence, and the rollback-safety table for reverting over a migrated schema |
| `network-connectivity.md` | L3/L4 reachability checks (ping, dig, traceroute, ss, tcpdump) to tell apart connection refused, timeout, DNS failure, and intermittent packet loss |
| `network-http-ssl.md` | L7 HTTP/TLS checks (curl timing breakdown, certificate expiry/chain inspection, handshake failures) once L3/L4 connectivity is confirmed and the problem is in the request or handshake |
| `postmortem-standards.md` | Blameless postmortem template and standards (detection-gap analysis, owned corrective actions, executable verification) when writing up an incident after it's resolved |
| `real-world-cases.md` | Incident case studies (delayed-error deploy, unsafe rollback over a migration, destructive quick-fix, silent data corruption, a postmortem that fixed nothing) for pattern-matching a live incident |
| `product-analytics-and-experiments.md` | Instrumenting product events with a tracking plan, consent-aware analytics, and designing or reading an A/B test (power, sample ratio mismatch, no peeking, guardrails) |
