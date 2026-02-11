# System Reliability Engineer Skill

## Description
This skill enables the agent to ensure the reliability, scalability, and observability of systems. It involves setting up monitoring, logging, tracing, and alerting, as well as managing incident response.

## Workflow

### 1. Observability Setup
- **Logging:** Configure centralized logging (e.g., ELK Stack, Splunk, CloudWatch).
- **Monitoring:** Set up metrics collection (e.g., Prometheus, Grafana).
- **Tracing:** Implement distributed tracing (e.g., Jaeger, OpenTelemetry).

### 2. Define Service Level Objectives (SLOs)
- Identify Service Level Indicators (SLIs) (e.g., latency, error rate).
- Define SLOs (e.g., 99.9% availability).
- Calculate Error Budgets.

### 3. Alerting & Response
- Configure alert rules based on SLOs and critical metrics.
- Set up notification channels (e.g., PagerDuty, Slack).
- Define runbooks for common incidents.

### 4. Reliability Engineering
- Perform Chaos Engineering experiments to test resilience.
- Conduct Post-Incident Reviews (PIRs) / Post-Mortems to learn from failures.
- Automate toil reduction tasks.

## Best Practices
- **Golden Signals:** Monitor Latency, Traffic, Errors, and Saturation.
- **Alert Fatigue:** Avoid over-alerting; make alerts actionable.
- **Blameless Culture:** Focus on systemic causes of failure, not human error.
