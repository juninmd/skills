---
name: diagnostics
description: |
  Reproduce and isolate software, test, performance, and network failures with evidence-driven experiments. Use for bugs, regressions, flaky tests, crashes, a service refusing connections, timeouts, DNS, ports, HTTP, TLS, and root-cause analysis.
---

# Diagnostics

## Preflight
```bash
# Capture the symptom before touching anything — it changes once you start
cmd 2>&1 | tail -40 > /tmp/symptom.log
git log --oneline -10 && git log --since='2 days ago' --oneline | wc -l
```

Write down: exact symptom, environment, first occurrence, and the smallest reproduction. A symptom you cannot restate precisely is one you cannot test.

## Workflow
1. Capture the exact symptom, environment, timing, expected behavior, and smallest reproduction. A symptom you cannot restate precisely is a symptom you cannot test.
2. Establish the last known good state and diff against it — code, config, data, dependency, infrastructure. `git log --since` and the deploy timeline usually name the window.
3. Trace the failing path and split the system at observable boundaries. Each split should halve the suspect surface.
4. State one falsifiable hypothesis, then run the cheapest experiment that distinguishes it from the alternatives. Change one variable per experiment.
5. Fix the root cause, add a regression test that fails without the fix, and rerun the original reproduction plus adjacent failure paths.

## Layer Triage
Work bottom-up. An L7 symptom with an L3 cause wastes every minute spent in the application.

| Layer | Question | Command |
|---|---|---|
| Name | Does the name resolve, and to what? | `dig +short <host>` · `nslookup <host>` |
| Route | Is the host reachable at all? | `ping -c 3 <host>` · `traceroute <host>` |
| Port | Is anything listening, and is it reachable? | `ss -tlnp` (local) · `nc -vz <host> <port>` (remote) |
| TLS | Is the chain valid and not expired? | `openssl s_client -connect <host>:443 -servername <host>` |
| HTTP | What does the server actually answer? | `curl -sS -D- -o /dev/null <url>` |
| Timing | Which phase is slow? | `curl -w '@curl-format.txt' -o /dev/null -sS <url>` |

`connection refused` means reachable but nothing listening — wrong port, service down, or bound to loopback. `connection timed out` means a firewall or route is swallowing it. They are different bugs; never treat them as one.

## Flaky Failures
The deterministic method above does not work on flake; raise the reproduction rate first.
1. Repeat the test with a pinned seed when statistical evidence is needed; choose the count from the suspected flake rate and risk.
2. Run it alone, then in suite order, then reversed or shuffled, to expose ordering coupling.
3. Attribute the remaining nondeterminism to exactly one source: time and timezone, concurrency and async ordering, or shared state (database rows, temp files, module singletons, ports).

## Reference Routing
- Practical failure casebook: [real-world-cases.md](references/real-world-cases.md)
- Full debugging sequence: [debugging-phases.md](references/debugging-phases.md)
- Connectivity, DNS, routing, sockets: [network-connectivity.md](references/network-connectivity.md)
- HTTP and TLS: [network-http-ssl.md](references/network-http-ssl.md)

## Stop
- Experiments stop reducing uncertainty. Rebuild the system model from observed behavior, or escalate with what has been eliminated.
- The symptom disappeared and you cannot say why. That is a coincidence, not a fix; it will return.
- This is production and users are affected. Mitigate through `incident-response` first, then resume here.

## Rules
- Preserve raw evidence, but summarize it in chat and redact secrets. Never paste a full log into context.
- Change one variable per experiment, and write down what the result eliminated.
- Do not call correlation a root cause until the reproduction changes predictably when you change the suspected cause.
- Stopping rule: after three refuted hypotheses, stop generating more. The system model is wrong. Rebuild it from observed behavior, or escalate with the explicit list of what has been eliminated.
- A fix you cannot explain is a coincidence you have not caught yet. If the symptom disappeared and you do not know why, it will come back.
- In production, mitigate first and diagnose second: run the outage through the `incident-response` skill, then resume diagnosis against the evidence it captured.
- A profile-shaped problem — slow but correct — belongs to `performance-engineering`; browser-side slowness to `web-performance`.

## Checklist
- [ ] Symptom, environment, and smallest reproduction captured.
- [ ] Reachability checked below the layer the symptom appeared in.
- [ ] Hypothesis tested with one variable changed and the result written down.
- [ ] Root cause explains the symptom; regression test fails without the fix.
