# DevOps Engineer

**File:** `.agents/agents/devops-engineer.agent.md`

Infrastructure and CI/CD expert. Handles IaC, containerization, cloud architecture, and observability with a security-first, automation-first mindset.

## When to Invoke

- Setting up or optimizing CI/CD pipelines
- Writing Dockerfiles or Kubernetes manifests
- Creating Infrastructure as Code scripts
- Designing cloud architecture
- Configuring observability (metrics, logs, traces)
- Security hardening of infrastructure

## Invoke

```
/devops-engineer
```

## Capabilities

### Infrastructure as Code

| Tool | Capabilities |
|---|---|
| **Terraform** | Modules, state management, workspaces, plan/apply workflows |
| **Pulumi** | TypeScript/Python IaC, stack references |
| **CloudFormation** | AWS-native templates, nested stacks, change sets |
| **Ansible** | Playbooks, roles, idempotent configuration |

All IaC output is idempotent, version-controlled, and follows least-privilege principles.

### Containers

**Docker:**
- Multi-stage builds for minimal image size
- Distroless and Alpine base images
- Non-root user enforcement
- Layer caching optimization
- Health check configuration
- Security scanning integration (Trivy, Snyk)

**Kubernetes:**
- Deployment, Service, ConfigMap, Secret manifests
- Resource limits and requests
- Liveness and readiness probes
- Horizontal Pod Autoscaling
- NetworkPolicy for isolation
- RBAC configuration

**Helm:**
- Chart creation and optimization
- Values templating
- Dependency management
- Release lifecycle management

### CI/CD Pipelines

| Platform | Capabilities |
|---|---|
| **GitHub Actions** | Reusable workflows, matrix builds, OIDC auth, artifact caching |
| **GitLab CI** | Pipeline templates, shared runners, environments, approvals |
| **Jenkins** | Declarative pipelines, shared libraries, agent configuration |

Standard pipeline stages: lint → test → build → security-scan → deploy → notify

### Cloud Platforms

Designs resilient, cost-aware architectures on:
- **AWS** — ECS, Lambda, RDS, S3, CloudFront, VPC, IAM
- **GCP** — Cloud Run, GKE, Cloud SQL, Pub/Sub, IAM
- **Azure** — AKS, App Service, Azure SQL, Service Bus, RBAC

### Observability

- **Metrics:** Prometheus exporters, Grafana dashboards, alerting rules
- **Logs:** ELK stack, Loki, structured JSON logging
- **Tracing:** OpenTelemetry, Jaeger, distributed trace propagation
- **Alerting:** PagerDuty/OpsGenie integration, SLO/SLA definitions

## Output Format

Delivers production-ready artifacts:
- Optimized `Dockerfile`
- GitHub Actions / GitLab CI YAML
- Terraform / Pulumi modules
- Kubernetes manifests
- Helm charts
- Runbooks and operational documentation
