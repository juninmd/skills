---
name: cloud-devops
description: "Comprehensive DevOps Engineering covering CI/CD, Infrastructure as Code, Containers, Serverless, and Observability."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "AWS, GCP, Kubernetes, Docker, GitHub Actions, GitLab CI"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Cloud & DevOps Engineering

Expert methodology for designing, deploying, and observing modern cloud infrastructure. This skill unifies CI/CD pipelines, Docker containerization, Kubernetes (Helm), Infrastructure as Code (Terraform), Serverless architectures, and structured observability.

**USE FOR:**
- Designing and optimizing CI/CD pipelines (GitHub Actions, GitLab CI).
- Authoring secure and reproducible Infrastructure as Code (Terraform, Pulumi).
- Designing high-availability cloud networks (VPC, multi-AZ).
- Optimizing Dockerfiles and managing container orchestration.
- Building and managing Kubernetes deployments via Helm charts.
- Designing Serverless (FaaS) and edge workloads.
- Implementing structured logging, distributed tracing, and metrics collection.

**DO NOT USE FOR:**
- Application feature development (use `backend-*` or `frontend-engineering`).
- Penetration testing (use `security-ops`).

**INVOKES:**
- `docker`, `terraform`, `helm`, CI pipeline configurations, observability SDKs.

## Core Principles
1. **Infrastructure as Code:** Everything must be version-controlled; no manual console changes.
2. **Fail Fast:** Sequence linting, security scans, and tests before builds in CI.
3. **Immutability:** Build artifacts once and promote them across environments.
4. **Observable Systems:** If it's not monitored, it doesn't work. Define SLIs/SLOs.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [CI/CD Pipelines](references/ci-cd-best-practices.md)
- [Infrastructure as Code (IaC)](references/iac-best-practices.md)
- [Containers & Docker](references/docker-best-practices.md)
- [Kubernetes & Helm](references/kubernetes-helm.md)
- [Serverless Architectures](references/serverless-best-practices.md)
- [Observability Patterns](references/observability-best-practices.md)

## Checklist
- [ ] Ensure CI/CD pipelines include automated security and linting gates.
- [ ] Verify IaC configurations with tools like `tfsec` or `checkov`.
- [ ] Optimize Dockerfiles for multi-stage builds and layer caching.
- [ ] Confirm observability is in place before routing traffic to new infrastructure.
