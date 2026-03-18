---
name: architecting-distributed-systems
description: Design, analyze, and optimize distributed systems with microservices architecture and message queue communication
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[component/feature] [options]"
---

# Distributed Systems Architect Skill

## Description
This skill empowers the agent to design, analyze, and optimize distributed systems, focusing on microservices architecture and asynchronous communication via message queues. It covers system decomposition, service discovery, inter-service communication, data consistency, and fault tolerance strategies.

## Workflow

### 1. System Decomposition
- Analyze monolithic applications or requirements to identify bounded contexts.
- Define microservices based on business capabilities or sub-domains (Domain-Driven Design).
- Establish clear service boundaries and APIs (REST, gRPC).

### 2. Messaging Strategy
- Select appropriate messaging patterns: Request-Response, Publish-Subscribe, or Event Streaming.
- Choose message brokers (e.g., Kafka for high throughput, RabbitMQ for complex routing).
- Define message schemas and versioning strategies.

### 3. Reliability & Resilience
- Implement circuit breakers, retries with exponential backoff, and timeouts.
- Design for idempotency to handle duplicate messages.
- Configure Dead Letter Queues (DLQ) for failed message handling.

### 4. Observability & Monitoring
- Integrate distributed tracing (e.g., Jaeger, Zipkin) to track requests across services.
- Monitor queue depths, message processing latency, and error rates.
- Set up centralized logging for cross-service troubleshooting.

### 5. Deployment & Scaling
- Define scaling policies for individual microservices and message broker clusters.
- Manage service discovery and load balancing (e.g., Consul, Eureka, Istio).

## Best Practices
- **Loose Coupling:** Services should be independent; changes in one should not necessitate changes in others.
- **Eventual Consistency:** Accept that data might not be immediate across all services; use Sagas or Outbox patterns for distributed transactions.
- **Fail Fast:** Systems should detect failures quickly and gracefully degrade functionality.
- **Statelessness:** Design services to be stateless whenever possible to simplify scaling and recovery.
