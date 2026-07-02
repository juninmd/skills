---
name: engineering-reliability
description: Ensure system reliability, scalability, and observability through monitoring, alerting, and incident response.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Site Reliability Engineering

## Description
This skill enables the agent to ensure system reliability, scalability, and observability. It includes configuring monitoring, logging, tracing, alerting, and incident response.

## Flow

### 1. Observability Configuration
- **Logging:** Configure centralized logging (e.g., ELK Stack, Splunk, CloudWatch).
- **Monitoring:** Configure metrics collection (e.g., Prometheus, Grafana).
- **Tracing:** Implement distributed tracing (e.g., Jaeger, OpenTelemetry).

### 2. SLO Definition
- Identify SLIs (e.g., latency, error rate).
- Define SLOs (e.g., 99.9% availability).
- Calculate error budgets.

### 3. Alerting and Response
- Configure alerting rules based on SLOs and critical metrics.
- Define notification channels (e.g., PagerDuty, Slack).
- Maintain runbooks for recurring incidents.

### 4. Reliability Engineering
- Execute Chaos Engineering experiments to validate resilience.
- Conduct Post-Incident Reviews (PIRs) / Post-Mortems for continuous learning.
- Automate repetitive tasks (toil) to reduce manual operations.

## Best Practices
- **Golden Signals:** Monitor Latency, Traffic, Errors, and Saturation.
- **Alert Fatigue:** Avoid alert floods; keep alerts actionable.
- **Blameless Culture:** Focus on systemic causes, not individual blame.

