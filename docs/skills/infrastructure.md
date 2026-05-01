# Infrastructure Skills

Skills for containerization, cloud, CI/CD, and infrastructure management.

## `mastering-docker`

**Invoke:** `/mastering-docker`

Production-ready Docker images.

**Best practices enforced:**
- Multi-stage builds (separate build and runtime stages)
- Minimal base images (Alpine, Distroless)
- Non-root user (`USER nonroot:nonroot`)
- Layer caching optimization (dependencies before source)
- Health checks (`HEALTHCHECK --interval=30s`)
- No `COPY . .` — copy only what's needed
- Security scanning with Trivy

**Example pattern:**
```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM gcr.io/distroless/nodejs24-debian12
WORKDIR /app
COPY --from=builder /app/dist ./dist
USER nonroot:nonroot
EXPOSE 3000
CMD ["dist/index.js"]
```

---

## `managing-helm-charts`

**Invoke:** `/managing-helm-charts`

Kubernetes Helm chart creation and optimization.

**Covers:** Chart.yaml structure, values.yaml templating, helper templates (`_helpers.tpl`), subcharts and dependencies, conditional resources, release upgrade safety, testing with `helm test`.

---

## `managing-iac`

**Invoke:** `/managing-iac`

Infrastructure as Code with Terraform, Pulumi, and Ansible.

**Terraform:** module structure, remote state (S3 + DynamoDB lock), workspace management, `for_each` patterns, data sources, provider pinning.

**Pulumi:** TypeScript stacks, stack references, secret management, resource transformations.

**Ansible:** playbook structure, roles, handlers, vault for secrets, idempotency checks.

---

## `managing-cloud-infrastructure`

**Invoke:** `/managing-cloud-infrastructure`

Resilient cloud architecture across AWS, GCP, and Azure.

**Principles:**
- Multi-AZ / multi-region for critical services
- Least-privilege IAM
- Network segmentation (VPC, subnets, security groups)
- Cost tagging and budget alerts
- Immutable infrastructure (no in-place mutation)

---

## `managing-serverless`

**Invoke:** `/managing-serverless`

Serverless deployment patterns.

| Platform | Use Case |
|---|---|
| AWS Lambda | Event-driven functions, scheduled jobs |
| Vercel | Next.js, Edge Functions |
| Cloudflare Workers | Global edge computing, low latency |

**Covers:** cold start optimization, bundle size reduction, environment variables, secrets management, function composition patterns.

---

## `configuring-ci-cd`

**Invoke:** `/configuring-ci-cd`

CI/CD pipeline setup with GitHub Actions and GitLab CI.

**Standard pipeline:**
```
lint → type-check → test → build → security-scan → deploy → notify
```

**Features:** matrix builds, dependency caching, OIDC authentication (no long-lived secrets), environment-based deployments, required approvals for production.

---

## `managing-vector-databases`

**Invoke:** `/managing-vector-databases`

Vector databases for similarity search and RAG applications.

**Covers:** embedding strategies, index selection (HNSW, IVF), similarity metrics (cosine, dot product, L2), chunking strategies for RAG, hybrid search (vector + keyword), pgvector, Pinecone, Weaviate, Qdrant.
