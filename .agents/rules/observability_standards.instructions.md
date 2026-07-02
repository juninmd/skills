---
name: observability-standards
description: Observability baseline for logs, metrics, traces, and operational diagnostics.
applyTo: '**/*.{py,ts,tsx,js,jsx,go,java,kt}, **/Dockerfile, **/.gitlab-ci.yml'
---

# Rule: Observability Standards

## Logging
- Use structured logs (JSON when possible).
- Include timestamp, severity, service name, and correlation/request ID.
- Never log secrets or personal data.

## Metrics
- Track at least request rate, error rate, and latency.
- Define SLI/SLO for critical user journeys.

## Tracing
- Propagate trace context between services.
- Instrument external calls and database operations.

## Operations
- Provide healthcheck endpoint for liveness/readiness.
- Alert on sustained error spikes and latency regressions.

