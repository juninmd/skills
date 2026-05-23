---
name: architecting-distributed-systems
description: |
  **ARCHITECTURE SKILL** - Design and optimize distributed systems and microservices.
  USE FOR: service boundaries, microservices, Kafka/RabbitMQ, Saga/Outbox patterns, circuit breakers, event-driven design.
  DO NOT USE FOR: diagnosing RabbitMQ queues (use diagnosing-rabbitmq), database administration (use administrating-databases), single-service API design.
  INVOKES: architecture design checklists, pattern selection guidance.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file]
---

# Distributed Systems Architecture

Expert guidance for the design, analysis, and optimization of scalable, resilient distributed systems and microservices.

**USE FOR:**
- Defining microservice boundaries and bounded contexts.
- Designing asynchronous communication strategies using Kafka or RabbitMQ.
- Implementing distributed consistency patterns like Saga and Transactional Outbox.
- Configuring fault tolerance mechanisms (circuit breakers, retries, DLQs).
- Designing observability for cross-service investigation.

**DO NOT USE FOR:**
- Low-level queue management or troubleshooting (use `diagnosing-rabbitmq`).
- Database index tuning or specific DBA tasks (use `administrating-databases`).
- Simple monolithic API development without distributed concerns.

**INVOKES:**
- Design patterns, stack recommendations, and architecture checklists.

## Architecture and Standards
Refer to [Distributed Architecture Flow and Stack](references/distributed-architecture.md) for detailed design steps and the 2026 recommended stack. Use [Architecture Forms](references/FORMS.md) for design templates and [Architecture Reference](references/REFERENCE.md) for pattern details.

## Best Practices
- **Low Coupling:** Changes in one service should not break others.
- **Eventual Consistency:** Use Saga/Outbox for distributed transactions.
- **Fail Fast:** Detect failures early and degrade with control.
- **Statelessness:** Prefer stateless services to simplify scaling and recovery.

## Checklist
- [ ] Identify service boundaries and failure domains before choosing infrastructure.
- [ ] Make data consistency and idempotency rules explicit for every cross-service flow.
- [ ] Validate design against latency, observability, and recovery requirements.
