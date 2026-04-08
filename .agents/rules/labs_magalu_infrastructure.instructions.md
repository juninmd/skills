---
name: labs-magalu-infrastructure
description: Infrastructure, deployment, and dependency standards for Luizalabs (Magalu).
applyTo: '**/dependency.yaml, **/hangar-info.yaml, **/values.yaml, **/Dockerfile'
---

# Rule: Magalu Infrastructure

## Deployment and Infrastructure Examples
- **Deployment**: ArgoCD. Endpoint: `https://argocd-mke-operacoes-hml.ipet.sh`.
- **Repository**: GitLab. Endpoint: `https://gitlab.luizalabs.com`.
- **Environment Variables**: Google Secret Manager references in `values.yaml`.
  ```yaml
  - name: MYSQL_PASSWORD
    value: gcp:secretmanager:projects/{project_id}/secrets/{secret_name}/versions/{version}
  ```
- **GCP Access**: request via Papagali (Magalu Desenvolvedor).
- **Android APK**: local build.

## Application Assumptions
- The app must be containerized and include a Dockerfile.
  - Dockerfile must install `make` as a system dependency when Makefile targets are required.
  - Example:
    ```dockerfile
    RUN apt-get update && \
        apt-get install -y --no-install-recommends make && \
        rm -rf /var/lib/apt/lists/*
    ```

## DNS
- When assigning a `.mgc-hml.mglu.io` host in `values.yaml`, DNS entries are automatically created pointing to the Ingress Controller.

## Preferred Technologies
- **SQL Databases**: Postgres, MySQL.
- **Cache**: Valkey.
- **Queues and Streaming**: PubSub, RabbitMQ, Kafka.
- **NoSQL**: MongoDB, Elastic. Avoid ScyllaDB unless explicitly justified.
- **Runtime**: local Docker and Kubernetes on Magalu Cloud.
- **CDN**: Azion, Akamai.
- **API Gateway**: Kong API.

## Hangar Info (Backstage Catalog)
- `hangar-info.yaml` is mandatory at repository root.
- It must contain metadata and security annotations.

Template:
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: {APPNAME}
  description: {DESCRIPTION}
  links: []
  annotations:
    security/business-risk: Low
    security/public: Internal
    security/accessibility: 'Yes'
    security/waf: 'No'
    security/qradar: 'No'
    security/authentication: Google OAuth
    security/administration: Self-portal
    project/service.tier: OTHERS
    backstage.io/techdocs-ref: dir:./
  tags:
    - Python
spec:
  type: service
  lifecycle: production
  owner: group:{TRIBE}-{SQUAD}
  system: {SYSTEM}
```

## Dependency.yaml
- `dependency.yaml` is mandatory at repository root.
- `owner`, `tribe`, and `vertical` must be lowercase and ASCII-only (for example: `ops_automacao`).

Template:
```yaml
owner: {SQUAD}
tribe: {TRIBE}
vertical: {VERTICAL}
application:
  description: {DESCRIPTION}
  name: {APP_NAME}
  languages: {Python, Java}
  fortify_id: {APPNAME}
security:
  url_homolog: {DNS}
  url_prod: {DNS}
  businessRisk: Low
  public: Internal
  accessibility: 'Yes'
  waf: 'No'
  qradar: 'No'
  authentication: {AUTH_METHOD}
  administration: {ADMIN_METHOD}
```

## Deployment Constraints

1. **Feature Freeze**: strictly respect freeze periods (for example, Black Friday, major campaigns). Deploys are prohibited without C-level approval.
2. **Friday Deploys**: avoid Friday deployments to reduce weekend incident risk.
3. **Hybrid Cloud Distinction**: clearly differentiate `GCP` and `MGC` (Magalu Cloud). Tooling, namespaces, and limitations are different.
