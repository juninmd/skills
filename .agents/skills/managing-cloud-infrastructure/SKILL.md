---
name: managing-cloud-infrastructure
description: Design resilient, scalable, and secure cloud architectures (AWS/GCP/Azure). Focus on HA/DR patterns and diagrams.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Cloud Architecture

This skill focuses on the **design** of cloud solutions, prioritizing High Availability (HA) and Disaster Recovery (DR) patterns.

## Instructions
1.  **High Availability (HA):** Design for failure.
    *   **Multi-AZ:** Distribute workloads across at least 2 Availability Zones.
    *   **Stateless:** Applications should not store local state; use Redis/S3.
2.  **Managed Services First:** Prefer PaaS/SaaS over IaaS.
    *   **Example:** Use RDS/Cloud SQL instead of installing Postgres on a VM.
    *   **Rationale:** Lower operational overhead (patching, backups).
3.  **Scalability:**
    *   **Horizontal:** Add more nodes (Auto Scaling Groups) instead of increasing the machine size (Vertical).
    *   **Event-Driven:** Use queues (SQS/PubSub) to decouple components and absorb peaks.

## Common Architecture Patterns
*   **Circuit Breaker:** Protect calling services from cascading failures.
*   **Strangler Fig:** Migrate legacy monoliths by gradually extracting microservices.
*   **Fan-out:** Distribute messages to multiple consumers via SNS/PubSub.

## Tools and Artifacts
*   **Diagrams as Code:** Use Mermaid or PlantUML to document architectures.
    *   Example: `flowchart LR; User-->LB; LB-->App1; LB-->App2; App1-->DB;`
*   **Cost Estimation:** Use the provider's official calculator before approving the design.

## Best Practices
- **Security Groups:** Principle of least privilege (allow-list, not deny-list).
- **Encryption:** Data in transit (TLS) and at rest (KMS) must be encrypted by default.
- **Backup Strategy:** Define RPO (Recovery Point Objective) and RTO (Recovery Time Objective).
