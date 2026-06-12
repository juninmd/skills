---
name: diagnostics
description: "Comprehensive Diagnostics for Debugging bugs and Networking issues."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Diagnostics & Troubleshooting

Expert methodology for diagnosing software defects, performance regressions, and network connectivity issues. This skill unifies evidence-driven bug investigation and network protocol debugging.

**USE FOR:**
- Investigating failing tests, flaky behavior, and production errors.
- Performing root cause analysis using the 6-phase diagnosis loop.
- Debugging network connectivity, HTTP headers, SSL/TLS certificates, and DNS.
- Tracing data flow across distributed system boundaries.

**DO NOT USE FOR:**
- Implementing the fix (use the relevant language/framework skill).
- Monitoring infrastructure (use `cloud-devops`).

**INVOKES:**
- `curl`, `dig`, `ping`, `openssl`, diagnostic test suites.

## Core Principles
1. **Evidence First:** Never guess; gather logs, traces, and reproduction cases first.
2. **Reproduce Before Fix:** A bug is only understood when it can be triggered reliably.
3. **Isolate the Fault:** Use the method of halves to narrow down the failing component.
4. **Network as a Service:** Verify basic connectivity (L3/L4) before debugging application logic (L7).

## Checklist
- [ ] Record the exact steps to reproduce the failure.
- [ ] Check logs and traces for specific error messages or timeouts.
- [ ] Verify network connectivity and port availability between components.
- [ ] State a hypothesis and the experiment needed to validate it.
