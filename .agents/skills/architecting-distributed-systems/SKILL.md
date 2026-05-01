---
name: architecting-distributed-systems
description: "Design distributed systems with microservices and message queues. Triggers: distributed systems, microservices, message queue."
argument-hint: "[component/feature] [options]"
---

# Distributed Systems Architecture

## Description
This skill guides the design, analysis, and optimization of distributed systems, focusing on microservices and asynchronous communication via messaging. It covers system decomposition, service discovery, inter-service communication, data consistency, and fault tolerance.

## Flow

### 1. System Decomposition
- Analyze monolithic applications or requirements to identify bounded contexts.
- Establish clear service boundaries and API contracts (REST/gRPC).

### 2. Messaging Strategy
- Select appropriate patterns: Request-Response, Publish-Subscribe, or Event Streaming.
- Choose brokers according to the scenario (Kafka for throughput, RabbitMQ for complex routing).
- Define message schemas and versioning.

### 3. Reliability and Resilience
- Implement circuit breakers, retries with exponential backoff, and timeouts.
- Design with idempotency to handle duplicate messages.
- Configure DLQ for failed messages.

### 4. Observability and Monitoring
- Integrate distributed tracing (Jaeger/Zipkin/OpenTelemetry).
- Monitor queue depth, processing latency, and error rate.
- Centralize logs for cross-service investigation.

### 5. Deployment and Scalability
- Define scaling policies for services and messaging clusters.
- Manage service discovery and load balancing (Consul/Eureka/Istio).

## 🧱 Recommended Stack 2026
- Messaging: Kafka (high throughput) + schema registry; RabbitMQ for advanced routing.
- Contracts: gRPC for critical internal communication and REST for public edge.
- Consistency: Outbox + CDC (Debezium) for event-driven integration.
- Resilience: Resilience4j (JVM) or equivalent libraries per language.

## Best Practices
- **Low Coupling:** Changes in one service should not break others.
- **Eventual Consistency:** Use Saga/Outbox for distributed transactions.
- **Fail Fast:** Detect failures early and degrade with control.
- **Statelessness:** Prefer stateless services to simplify scaling and recovery.

## Checklist

- [ ] Identify service boundaries, contracts, and failure domains before choosing infrastructure.
- [ ] Make data consistency, retry, and idempotency rules explicit for every cross-service flow.
- [ ] Validate the design against latency, observability, and recovery requirements.

## References

- [C4 Model](https://c4model.com/)
- [gRPC Documentation](https://grpc.io/docs/)
- [Debezium Documentation](https://debezium.io/documentation/reference/stable/)

