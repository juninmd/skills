# Distributed Systems Architect Reference

## Messaging & Streaming

### 1. Apache Kafka
**Description:** Distributed event streaming platform for high-performance data pipelines and streaming analytics.
**Key Concepts:** Topics, Partitions, Producers, Consumers, Consumer Groups.
**Common Use Cases:** Log aggregation, stream processing, event sourcing.

### 2. RabbitMQ
**Description:** Widely used open-source message broker that supports multiple messaging protocols.
**Key Concepts:** Exchanges (Direct, Fanout, Topic, Headers), Queues, Bindings.
**Common Use Cases:** Task queues, decoupling long-running processes, complex routing.

## Resilience & Service Mesh

### 1. Resilience4j
**Description:** Lightweight fault tolerance library inspired by Netflix Hystrix but designed for Java 8 and functional programming.
**Features:** Circuit Breaker, Rate Limiter, Retry, Bulkhead.

### 2. Istio
**Description:** Open-source service mesh that provides a uniform way to connect, manage, and secure microservices.
**Features:** Traffic management (canary deployments), security (mTLS), observability.

## Patterns & Strategies

### 1. Saga Pattern
- Manages distributed transactions by using a sequence of local transactions.
- Types: Choreography (event-based) and Orchestration (centralized controller).

### 2. Outbox Pattern
- Ensures reliable message delivery by saving messages in an "outbox" table within the same transaction as the business data change.

### 3. Circuit Breaker
- Prevents a service from making requests to another service that is likely to fail, allowing the failing service time to recover.
