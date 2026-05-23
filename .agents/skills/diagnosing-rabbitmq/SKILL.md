---
name: diagnosing-rabbitmq
description: |
  **DIAGNOSTIC SKILL** - Diagnose RabbitMQ health, queue bottlenecks, and consumer lag.
  USE FOR: RabbitMQ inspection, queue status, DLQ analysis, consumer count, message unacknowledged, rabbitmqadmin commands.
  DO NOT USE FOR: managing RabbitMQ clusters (use managing-cloud-infrastructure), application business logic, general system monitoring.
  INVOKES: rabbitmqadmin CLI.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Linux, macOS, Windows"
allowed-tools: [run_shell_command, read_file]
---

# Diagnose RabbitMQ Health

Expert methodology for inspecting RabbitMQ queues to identify performance bottlenecks, consumer failures, and processing issues using the management CLI.

**USE FOR:**
- Getting real-time queue statistics (message count, status).
- Identifying queues with zero active consumers.
- Analyzing unacknowledged messages and consumer lag.
- Inspecting Dead Letter Queues (DLQ) for root cause analysis.
- Sampling messages from queues to debug processing logic.

**DO NOT USE FOR:**
- Provisioning or scaling RabbitMQ clusters.
- Fixing application-level bugs without queue evidence.

**INVOKES:**
- `rabbitmqadmin` CLI tool.

## Instructions
- **Metrics Collection:** Use `rabbitmqadmin` to gather queue and consumer metrics.
- **Critical Alerts:** Prioritize `consumer_count == 0` for stuck processing.
- **Slowness:** Investigate `messages_unacknowledged` for slow or failing consumers.

## Commands
```bash
rabbitmqadmin get queue=<name> stat.messages stat.consumer_count
```

## Checklist
- [ ] Identify the affected queue, exchange, and bindings before acting.
- [ ] Use concrete metrics to distinguish between publisher issues and consumer lag.
- [ ] Verify queue recovery after any remediation step.
