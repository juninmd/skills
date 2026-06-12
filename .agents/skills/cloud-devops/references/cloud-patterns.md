# Cloud Architecture Patterns and Best Practices

Detailed guidelines for designing resilient and scalable cloud infrastructure.

## 1. High Availability (HA) and Scalability
- **Multi-AZ:** Distribute workloads across ≥ 2 Availability Zones to survive datacenter failures.
- **Statelessness:** Decouple application state using external stores (Redis, S3) to allow horizontal scaling.
- **Managed Services:** Prefer RDS, GKE, and ElastiCache over self-managed VMs to reduce operational overhead.
- **Load Balancing:** Use ALB/NLB to distribute traffic and perform health checks.

## 2. Common Patterns
- **Three-Tier:** Segregate Presentation (Public), Application (Private), and Data (Isolated) subnets.
- **Strangler Fig:** For incremental monolith-to-microservice migration.
- **Circuit Breaker:** Prevent cascading failures across service boundaries.

## 3. Security and Networking
- **Isolation:** Keep databases in subnets with no public IGW route; use NAT Gateways for outbound-only flows.
- **Least Privilege:** Use IAM roles and restrictive Security Groups (allow-list only).
- **Encryption:** Mandatory TLS for transit and KMS/AES-256 for data at rest.
- **DR Planning:** Define explicit RPO and RTO for every critical workload.

## 4. Documentation
- Use **Diagrams as Code** (Mermaid/PlantUML) for architectural reviews.
- Always perform **Cost Estimation** using official provider calculators.
