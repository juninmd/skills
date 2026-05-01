---
name: managing-cloud-infrastructure
description: "Multi-AZ, VPC, EKS clusters, RDS. Triggers: vpc, eks, rds."
argument-hint: "[resource/project] [options]"
---
---

# Cloud Architecture

This skill focuses on the **design** of core cloud infrastructure solutions (VPCs, VM clusters, Container Orchestration, Storage, and Databases), prioritizing High Availability (HA) and Disaster Recovery (DR) patterns.

*Note: For Serverless architectures (e.g. AWS Lambda, Vercel, Edge), refer to the `managing-serverless` skill instead.*

## Instructions
1.  **High Availability (HA):** Design for failure.
    *   **Multi-AZ:** Distribute workloads across at least 2 Availability Zones.
    *   **Stateless:** Applications should not store local state; use Redis/S3.
2.  **Managed Services First:** Prefer PaaS/SaaS over IaaS.
    *   **Example:** Use RDS/Cloud SQL instead of installing Postgres on a VM. Use EKS/GKE for containers instead of self-managed EC2.
    *   **Rationale:** Lower operational overhead (patching, backups).
3.  **Scalability:**
    *   **Horizontal:** Add more nodes (Auto Scaling Groups/Node Groups) instead of increasing the machine size (Vertical).
    *   **Load Balancing:** Always place an Application Load Balancer (ALB) or Network Load Balancer (NLB) in front of scalable clusters.

## Common Architecture Patterns
*   **Three-Tier Architecture:** Separate Presentation (Public Subnet), Application (Private Subnet), and Data (Isolated Subnet).
*   **Circuit Breaker:** Protect calling services from cascading failures in microservice architectures.
*   **Strangler Fig:** Migrate legacy monoliths by gradually extracting microservices and routing traffic via API Gateways.

## Tools and Artifacts
*   **Diagrams as Code:** Use Mermaid or PlantUML to document architectures.
    *   Example: `flowchart LR; User-->LB; LB-->App1; LB-->App2; App1-->DB;`
*   **Cost Estimation:** Use the provider's official calculator before approving the design.

## Best Practices
- **Networking:** Place databases in isolated subnets with no direct internet access. Use NAT Gateways for private instances needing outbound access.
- **Security Groups:** Principle of least privilege (allow-list, not deny-list).
- **Encryption:** Data in transit (TLS) and at rest (KMS) must be encrypted by default.
- **Backup Strategy:** Define RPO (Recovery Point Objective) and RTO (Recovery Time Objective).

## Checklist

- [ ] Define workload boundaries, failure domains, and compliance constraints before choosing services.
- [ ] Make networking, identity, encryption, and backup assumptions explicit.
- [ ] Validate the design against cost, resilience, and operational ownership before approval.

## References

- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
- [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/)

