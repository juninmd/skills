---
name: diagnosing-rabbitmq
description: Diagnose health of RabbitMQ queues, consumers, and Dead Letter Queues (DLQ).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[incident/alert] [options]"
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
