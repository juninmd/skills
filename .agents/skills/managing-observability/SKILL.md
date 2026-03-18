---
name: managing-observability
description: Análise de performance e saúde sistêmica baseada em RED (Rate, Error, Duration) e USE Method (Utilization, Saturation).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Observability & Monitoring

Esta skill garante que os serviços da Luizalabs sejam "caixas de vidro", não "caixas pretas".

## Instructions
1.  **Metric Strategy (RED Method):** Para cada serviço (API HTTP/gRPC), exponha:
    *   **Rate:** Quantidade de requests por segundo (rps).
    *   **Errors:** Percentual de falhas (status 5xx).
    *   **Duration:** Latência (Histograma, p95 e p99).
2.  **Infrastructure Strategy (USE Method):** Para recursos (Node, CPU, Disco, DB):
    *   **Utilization:** O quanto está sendo usado (tempo ocupado).
    *   **Saturation:** Fila de espera (threads bloqueadas, I/O wait).
    *   **Errors:** Falhas de hardware ou SO (OOMKill).
3.  **Distributed Tracing (OpenTelemetry):**
    *   **Propagation:** Sempre passe o header `traceparent` ou `b3` entre serviços.
    *   **Context:** Adicione `trace_id` nos logs estruturados para correlacionar.

## Verification
*   **Check Metrics Endpoint:** `curl localhost:9090/metrics` (Deve retornar texto Prometheus).
*   **Query Rate (PromQL):** `rate(http_requests_total[5m])`
*   **Query Error Rate:** `rate(http_requests_total{status=~"5.*"}[5m]) / rate(http_requests_total[5m])`
*   **Check Latency (p95):** `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`

## Example: Prometheus Histogram (Go/Python)
```python
REQUEST_TIME = Histogram('request_processing_seconds', 'Time spent processing request', buckets=[0.1, 0.5, 1.0, 2.5, 5.0])

@REQUEST_TIME.time()
def process_request():
    pass
```