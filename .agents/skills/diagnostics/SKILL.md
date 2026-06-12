---
name: diagnostics
description: |
  Reproduce and isolate software, test, performance, and network failures with evidence-driven experiments. Use for bugs, regressions, flaky tests, crashes, timeouts, DNS, ports, HTTP, TLS, and root-cause analysis.
---

# Diagnostics

## Workflow
1. Capture the exact symptom, environment, timing, expected behavior, and smallest reproduction.
2. Establish the last known good state and compare code, config, data, dependency, and infrastructure changes.
3. Trace the failing path and split the system at observable boundaries.
4. State one falsifiable hypothesis; run the cheapest experiment that distinguishes it from alternatives.
5. Fix the root cause, add a regression test, and rerun the original reproduction plus adjacent failure paths.

## Reference Routing
- Full debugging sequence: [debugging-phases.md](references/debugging-phases.md)
- Compact evidence workflow: [debugging-workflow.md](references/debugging-workflow.md)
- DNS and connectivity: [network-connectivity.md](references/network-connectivity.md)
- HTTP and TLS: [network-http-ssl.md](references/network-http-ssl.md)
- Traffic and latency: [network-performance.md](references/network-performance.md)
- Network triage: [network-troubleshooting.md](references/network-troubleshooting.md)

## Rules
- Preserve raw evidence, but summarize it in chat and redact secrets.
- Change one variable per experiment.
- Check L3/L4 reachability before L7 behavior.
- Do not call correlation a root cause until the reproduction changes predictably.

## Checklist
- [ ] Failure and expected behavior are captured.
- [ ] Hypothesis is tested with controlled evidence.
- [ ] Regression proof covers the original symptom.
