---
name: observability-patterns
description: "Observability Patterns for Designing structured, Implementing distributed, Collecting business via configuring-ci-cd, managing-cloud-infrastructure."
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "Slight overage preserves telemetry and alerting acceptance criteria."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Observability Patterns

Professional guidance for building observable systems through structured logging, distributed tracing, and metrics collection.

**USE FOR:**
- Designing structured logging (JSON, correlation IDs, context propagation).
- Implementing distributed tracing (OpenTelemetry, Jaeger, Tempo).
- Collecting business and system metrics (Prometheus, StatsD).
- Building dashboards for operational visibility.
- Defining SLIs (Service Level Indicators) and SLOs (Service Level Objectives).
- Setting up alerts and alert routing (on-call).
- Debugging production issues using logs and traces.
- Capacity planning from historical metrics.

**DO NOT USE FOR:**
- Application debugging (use `diagnosing-bugs`).
- Infrastructure provisioning and config (use `managing-cloud-infrastructure`).
- Incident response and post-mortems.

**INVOKES:**
- `configuring-ci-cd` for log/metric shipping in pipelines.
- `managing-cloud-infrastructure` for cloud-native observability (CloudWatch, Datadog, etc.).
- `diagnosing-bugs` for production debugging using observability data.

## Observability Pillars

1. **Structured Logging**
   - Log as JSON, not free text: `{ timestamp, level, message, context }`.
   - Include correlation IDs (trace_id, span_id, request_id) for request tracing.
   - Log at appropriate level: ERROR only for actual errors, INFO for events.
   - Avoid logging secrets, PII, or large payloads.

2. **Distributed Tracing**
   - Track request across services: API → Service A → Service B → Database.
   - Record span duration, error status, and metadata.
   - Use OpenTelemetry standard: compatible with Jaeger, Tempo, Datadog, New Relic.

3. **Metrics (Time Series)**
   - Business metrics: requests/sec, error rate, latency (p50, p95, p99).
   - System metrics: CPU, memory, disk, network I/O.
   - Application metrics: cache hit ratio, DB connection pool, queue depth.
   - Use consistent naming and labels.

4. **Dashboards & Alerts**
   - Dashboard: high-level health (green/red indicators).
   - Alerts: fire only for actionable events; avoid alert fatigue.
   - SLI: objective measure (e.g., "99.9% requests <200ms").
   - SLO: target for SLI (e.g., "meet SLI 99% of the time").

## Implementation Pattern

```
Application Code
  ↓
Structured Logs (JSON)
Distributed Traces (OTel)
Metrics (Prometheus)
  ↓
Log Aggregator (Loki, CloudWatch, Splunk)
Trace Backend (Jaeger, Tempo)
Metrics DB (Prometheus, Thanos)
  ↓
Dashboards (Grafana, DataDog)
Alerts (AlertManager, PagerDuty)
  ↓
On-Call Response
```

## Practical Guidelines

### 1. Structured Logging (Example)
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: { service: 'checkout-api' },
});

// ✅ Structured with context
logger.info({ orderId, userId, amount, durationMs }, 'Order completed');
logger.error({ orderId, error: err.message, stack: err.stack }, 'Payment failed');
```
| Level | When |
|---|---|
| `trace` | Detailed debugging (local only) |
| `debug` | Development debugging |
| `info` | Normal operations |
| `warn` | Recoverable issues |
| `error` | Failed operations — always with context |
| `fatal` | Process crash |

### 2. OpenTelemetry Setup (Example)
```typescript
// instrumentation.ts — import BEFORE everything else in main.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME ?? 'my-service',
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-fs': { enabled: false },
  })],
});

sdk.start();
process.on('SIGTERM', () => sdk.shutdown());
```

### 3. Instrumentation Points
| Point | Attributes to Record |
|---|---|
| HTTP endpoints | route, method, status_code, duration_ms |
| Database queries | query_type, table, duration_ms, row_count |
| External API calls | service, endpoint, status_code, duration_ms |
| LLM calls | model, prompt_tokens, completion_tokens, duration_ms |
| Background jobs | job_name, status, duration_ms |

## Checklist

- [ ] Logs are structured (JSON); correlation IDs propagated across services.
- [ ] Distributed tracing enabled; traces visible in UI with latency breakdowns.
- [ ] Key metrics are collected: request rate, error rate, latency (p50, p95, p99).
- [ ] No secrets or PII in logs; sanitization rules enforced.
- [ ] Dashboards exist for operational health; on-call uses them daily.
- [ ] SLIs and SLOs defined for critical services; measured and tracked.
- [ ] Alerts are actionable (not spam); on-call response documented.
- [ ] Capacity trends visible from historical metrics (memory, disk, requests).
- [ ] Observability data retention policy defined (cost vs. forensics).
