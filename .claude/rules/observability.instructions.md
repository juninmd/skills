---
name: observability
description: "Use when adding logs, metrics, traces, correlation IDs, or SLO-driven observability. Triggers: observability, OpenTelemetry, structured logging, metrics, tracing, SLO."
applyTo: '**/*.{ts,tsx,js,jsx}'
paths:
  - "**/*.{ts,tsx,js,jsx}"
trigger: glob
globs: "**/*.{ts,tsx,js,jsx}"
---

# Rule: Observability

> **Mission:** Every request traced. Every error captured. Every metric exported.

## Structured Logging (MANDATORY — no console.log in production)

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: { service: 'checkout-api' },
});

// ✅ Structured with context
logger.info({ orderId, userId, amount, durationMs }, 'Order completed');
logger.error({ orderId, error: err.message, stack: err.stack }, 'Payment failed');

// ❌ VIOLATION
console.log('Order completed', orderId);
```

## Log Levels

| Level | When |
|---|---|
| `trace` | Detailed debugging (local only) |
| `debug` | Development debugging |
| `info` | Normal operations |
| `warn` | Recoverable issues |
| `error` | Failed operations — always with context |
| `fatal` | Process crash |

## OpenTelemetry Setup

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

## Manual Spans

```typescript
const tracer = trace.getTracer('checkout-service');

async function processOrder(id: string) {
  return tracer.startActiveSpan('process-order', async (span) => {
    span.setAttribute('order.id', id);
    try {
      const order = await db.orders.findUnique({ where: { id } });
      span.setStatus({ code: SpanStatusCode.OK });
      return order;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) });
      throw err;
    } finally {
      span.end();
    }
  });
}
```

## Instrumentation Points

| Point | Attributes to Record |
|---|---|
| HTTP endpoints | route, method, status_code, duration_ms |
| Database queries | query_type, table, duration_ms, row_count |
| External API calls | service, endpoint, status_code, duration_ms |
| LLM calls | model, prompt_tokens, completion_tokens, duration_ms |
| Background jobs | job_name, status, duration_ms |

## SLO Definitions

```markdown
## Service SLOs
| SLO | Target | Alert |
|-----|--------|-------|
| Availability | 99.9% | < 99.5% |
| Latency p50 | < 100ms | > 200ms |
| Latency p99 | < 500ms | > 1000ms |
| Error Rate | < 0.1% | > 1% |
```

## Checklist

- [ ] `instrumentation.ts` imported before all other code
- [ ] No `console.log` in production code
- [ ] All async operations have OTEL spans
- [ ] Errors include `cause` with original exception
- [ ] SLOs defined in `docs/slo.md`
- [ ] `/health` endpoint returns 200 OK
