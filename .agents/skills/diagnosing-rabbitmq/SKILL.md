---
name: diagnosing-rabbitmq
description: "Queues, consumers, DLQ. Triggers: rabbitmqadmin."
argument-hint: "[incident/alert] [options]"
---
---

# Diagnose RabbitMQ Health

This skill inspects queues to identify bottlenecks and processing failures.

## Instructions
- Use `rabbitmqadmin` to collect metrics.
- Analyze `consumer_count == 0` (Critical) and `messages_unacknowledged` (Slowness).

## Capabilities
- **Queue Stats**: Get message count and status.
- **DLQ Inspection**: Sample dead messages for RCA (Root Cause Analysis).

## Commands
- `rabbitmqadmin get queue=<name> stat.messages stat.consumer_count`

## Checklist

- [ ] Identify the affected queue, exchange, bindings, and consumer group before proposing changes.
- [ ] Distinguish publisher issues, broker pressure, and consumer lag with concrete queue metrics.
- [ ] Re-check queue depth and consumer recovery after each remediation step.

## References

- [RabbitMQ Documentation](https://www.rabbitmq.com/docs)
- [rabbitmqadmin Documentation](https://www.rabbitmq.com/docs/management-cli)

