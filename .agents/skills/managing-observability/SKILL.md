---
name: managing-observability
description: Performance and systemic health analysis based on RED (Rate, Error, Duration) and USE Method (Utilization, Saturation).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Observability and Monitoring

This skill ensures that Luizalabs services are transparent and healthy. It covers metrics, logs, and dashboards.

## Quick Links for Monitoring
- **GCP Logs:** [https://console.cloud.google.com/logs/query?project={project-id}](https://console.cloud.google.com/logs/query?project={project-id})
  - Use to search for specific errors or application behavior in real-time.
- **Grafana Official:** [https://grafana.luizalabs.com](https://grafana.luizalabs.com)
  - Use to view dashboards with Rate, Errors, and Duration (RED) metrics.
- **Prometheus (GMP):** [https://prometheus-ui-gmp.luizalabs.com/](https://prometheus-ui-gmp.luizalabs.com/)
  - Use for raw metric queries and exploring available Prometheus data.

## Instructions
1.  **Logs Search (GCP):** When a user reports an error, go to the GCP Logs link, replace `{project-id}` with the application's project name, and filter by `severity >= ERROR`.
2.  **Dashboard Review (Grafana):** Search for the service name in Grafana to check the health status. Look for spikes in the "Error Rate" graph.
3.  **Metrics Exploration (GMP):** Use this to validate if new metrics are being correctly collected before creating a dashboard.

## Metrics Strategy (RED Method)
For each service, we track:
- **Rate:** How many requests are happening.
- **Errors:** How many requests are failing.
- **Duration:** How long each request takes.

## Validation
*   **Check Metrics Endpoint:** `curl localhost:9090/metrics` (Should return Prometheus text).
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