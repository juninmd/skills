---
name: managing-cloud-infrastructure
description: |
  **ARCHITECTURE SKILL** - Design high-availability cloud infrastructure solutions.
  USE FOR: VPC design, multi-AZ clusters, EKS/GKE orchestration, RDS/Cloud SQL architecture, networking subnets, security groups, disaster recovery (DR).
  DO NOT USE FOR: serverless design (use managing-serverless), infrastructure as code implementation (use managing-iac), OS-level administration.
  INVOKES: managing-iac, managing-serverless, observability-patterns, zero-trust-architecture.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "AWS, GCP, Azure"
allowed-tools: [read_file, write_file]
---

# Cloud Architecture

Expert methodology for designing core cloud infrastructure with a focus on High Availability (HA), security isolation, and operational scalability using managed services.

**USE FOR:**
- Designing complex VPC layouts with public, private, and isolated subnets.
- Architecting container clusters using EKS, GKE, or AKS.
- Implementing database strategies with managed services (RDS, Cloud SQL).
- Configuring security perimeters using Security Groups and IAM roles.
- Designing disaster recovery plans with defined RPO and RTO.
- Planning observability integration (distributed tracing, metrics, dashboards, SLOs).

**DO NOT USE FOR:**
- Implementing the design via Terraform or Pulumi (use `managing-iac`).
- Building Event-Driven or Serverless functions (use `managing-serverless`).

**INVOKES:**
- Mermaid for architectural diagrams and infrastructure design checklists.

## Methodology and Guidelines
Implementation details for HA patterns, networking, and security are documented in:
- [Cloud Architecture Patterns and Best Practices](references/cloud-patterns.md)

## Core Principles
1. **Managed First:** Prioritize PaaS/SaaS to minimize patching and backup overhead.
2. **Failure by Design:** Assume every component will fail; use Multi-AZ and health checks.
3. **Defense in Depth:** Layered security through networking, encryption, and IAM.

## Checklist
- [ ] Define failure domains and compliance constraints before service selection.
- [ ] Explicitly map data flows between public and private subnets.
- [ ] Validate the design against cost, resilience, and operational ownership.
- [ ] Ensure all sensitive data at rest is encrypted via KMS or equivalent.
- [ ] Plan observability strategy: tracing, metrics, logs, dashboards, and SLO definitions.
- [ ] Design zero-trust boundaries: mTLS, workload identity, secrets rotation, audit trails.
