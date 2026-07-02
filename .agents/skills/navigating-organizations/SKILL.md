---
name: navigating-MyProjects
description: Navigation in MyProjectal structures and search in historical knowledge bases (Confluence, Service Map).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# MyProjectal & Legacy Knowledge

This skill assists in discovering service owners, navigating MyProjectal structures, and searching historical knowledge bases at MyProject.

## When to use this skill
- Discover who is the owner or team responsible for a service
- Find technical documentation and historical runbooks
- Navigate the MyProjectal structure (tribes, verticals, squads)
- Locate resources in GCP, Kubernetes, or legacy infrastructure
- Consult past architectural decisions and ADRs
- Find contacts for experts in specific technologies

## Instructions

### Discovering Service Owners

#### Service Map (Primary MyProjectal Tool)
Service Map is the official service catalog and MyProjectal mapper of MyProject.

**Access via Web**:
- URL: [https://service-map.internal.com](https://service-map.internal.com)
- Use this to discover the squad/tribe structure, Tech Leads, and service ownership.
- It also links to other critical tools like GitLab, ContainerRegistry, and Grafana for each service.

**Information available in Service Map**:
- Squad/Tribe responsible
- Tech Lead and Product Owner
- Links to: GitLab, Backstage (ContainerRegistry), Grafana, Kibana
- SLA and service criticality
- Technologies used
- Upstream/downstream dependencies

#### Backstage (ContainerRegistry)
Internal technical catalog based on Spotify Backstage.

**Access**:
- `/display/{TRIBO}/Home` - Home of each tribe (e.g., `/display/ABACKOFFICE/Home`)
- `/display/{TRIBO}/Runbooks` - Tribe runbooks
- `/display/{TRIBO}/ADRs` - Architectural Decision Records
- `catalog-info.yaml` files in the repository
- Owner Group ID (e.g., `group:62bcb2215ebf58b18f19c0d5`)
- Exposed APIs (OpenAPI/Swagger)
- TechDocs documentation
- Linked alerts and metrics

**Query example**:
```yaml
# Look for catalog-info.yaml or service-metadata.yaml in the repo root
metadata:
  name: code-quality
spec:
  owner: 'group:62bcb2215ebf58b18f19c0d5' # Aliança Backoffice
```

To discover the tribe name from the Group ID, use:
```bash
curl -s "https://backstage.example.com/api/catalog/entities?filter=kind=Group" | \
  jq '.[] | select(.metadata.uid=="62bcb2215ebf58b18f19c0d5")'
```

   - https://backstage.example.com/catalog/default/component/{service-name}/docs

#### MyProject Hierarchy
```text
├── Verticals (e.g., Operations, Commercial, Technology)
│   └── Tribes (e.g., Aliança Backoffice, Fulfillment)
│       └── Squads (e.g., Code Quality, Shipping)
│           └── Engineers and POs
```

- `/display/TECH/Tech+Home` - Technology structure
- `/display/{Tribe}/Home` - Home of each tribe (e.g., /display/ABACKOFFICE/Home)
- `/display/{Tribe}/Runbooks` - Tribe runbooks
- `/display/{Tribe}/ADRs` - Architectural Decision Records

**Confluence Search**:
- Use global search (magnifying glass icon)
- Useful filters:
  - `space:TECH` - only Technology space
  - `type:page` - only pages (not comments)

Go to: `/display/TECH/Especialistas` and search for:
- Kubernetes - [search in Confluence]

### Locating Infrastructure Resources

#### Google Cloud Platform (GCP)

**GCP projects by environment**:
```bash
# Typical HML project
example-code-quality-hml
# Cloud Run services
gcloud run services list --project=example-code-quality-prd

# GKE clusters
gcloud container clusters list --project=example-infra-k8s-prd

# Cloud SQL instances
gcloud sql instances list --project=example-data-prd

# Secrets
gcloud secrets list --project=example-code-quality-prd
```

**IAM and permissions**:
```bash
# Who has access to the project
gcloud projects get-iam-policy example-code-quality-prd

# Test if you have permission
gcloud projects get-iam-policy example-code-quality-prd \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$(gcloud config get-value account)"
```

#### Kubernetes (MKE - platform Kubernetes Engine)

**Clusters by environment**:
- `mke-hml-operacoes` - Operations Staging (HML)
- `mke-prd-operacoes` - Operations Production
- `mke-hml-comercial` - Commercial Staging (HML)
- `mke-prd-comercial` - Commercial Production

**List resources**:
```bash
# Configure context
kubectl config use-context mke-prd-operacoes

# List namespaces
kubectl get namespaces

# Search for a specific service
kubectl get all -A | grep code-quality

# See deployments in a namespace
kubectl get deployments -n default

# See logs of a pod
kubectl logs -n default <pod-name> --tail=100 -f
```

#### Magamundi (Legacy Infrastructure)

Magamundi is the portal for legacy resources (VMs, bare metal, on-prem services).

**Access**:
- URL: https://magamundi.example.com
- Requires VPN and specific permissions

**Typical resources**:
- Legacy VMs (CentOS, Ubuntu)
- Services not yet migrated to Cloud
- On-prem databases (old Oracle, PostgreSQL)
- Load balancers F5

**When to consult Magamundi**:
- Service not found in GCP or MKE
- "host not found" error for old internal domains (e.g., `*.example.internal`)
- Documentation mentions servers by hostname (e.g., `app-server-01.example.internal`)

**Search in Magamundi**:
- Search by hostname
- Search by internal IP
- Check the "Owner" section for contact

### Technical Documentation and Runbooks

#### Where to search (order of preference)

1. **README.md of the GitLab repository**
   - Always start here
   - Look for sections: "Deployment", "Troubleshooting", "Architecture"

2. **`/docs` folder in the repository**
   - ADRs (Architectural Decision Records)
   - Operation runbooks
   - Architecture diagrams

3. **Backstage TechDocs**
   - https://backstage.example.com/catalog/default/component/{service-name}/docs
   - Automatically generated documentation from the repo

4. **Tribe Confluence**
   - https://confluence.example.com/display/{Tribe}/Runbooks
   - Search for: "{service-name} runbook"

5. **Grafana Dashboards and Alerts**
   - https://grafana.example.com
   - Search for: "{service-name}"
   - Check "alert descriptions" for troubleshooting

#### Typical Runbooks

**What to look for in a runbook**:
- Problem symptoms
- Diagnostic commands
- Resolution procedure
- Escalation path (who to call if not resolved)

**Runbook search example**:
```bash
# In GitLab
gitlab --project example-org/code-quality tree --ref main --path docs/runbooks

# In Confluence
# Access: https://confluence.example.com
# Search: "code-quality runbook restart"
```

### ADRs (Architectural Decision Records)

ADRs document important architectural decisions.

**Where to find**:
- `/docs/adr/` in the repository
- Confluence: `/display/{Tribe}/ADRs`

**Typical format**:
```markdown
# ADR-001: Database Choice

## Status
Accepted

## Context
We needed to choose a database to store quality metrics.

## Decision
PostgreSQL 14 on Cloud SQL.

## Consequences
- Supports native JSON
- Managed service reduces operational overhead
- Cost: ~$200/month
```

## Troubleshooting
### I can't find the owner of a service
1. Check Service Map first: https://service-map.example.com
2. If it's not there, check Backstage: https://backstage.example.com
3. Look for `catalog-info.yaml` or `service-metadata.yaml` in the GitLab repo
4. Last option: ask on Slack in `#ask-architecture`

### Service is not in GCP or MKE
- Consult Magamundi: https://magamundi.example.com
- It might be an on-prem legacy service
- Check historical documentation in Confluence

### I don't have access to Confluence/Service Map/Backstage
- Request access via ServiceNow: https://example-org.service-now.com
- Category: "Access Request"
- Justification: "Development and troubleshooting"

### I need to speak with an expert in a technology
1. Confluence: `/display/TECH/Especialistas`
2. Slack: `#ask-{technology}` (e.g., `#ask-kubernetes`, `#ask-argocd`)
3. Service Map: see the "Tech Lead" field of the related service

### Runbook is outdated
- Create issue in the service's GitLab
- Mention in the responsible team's Slack
- If urgent, look for Grafana alerts (usually more up-to-date)

## Capabilities
- **Service Map**: Discovery of owners and service structure
- **Backstage (ContainerRegistry)**: Technical catalog and TechDocs
- **Confluence**: Runbooks, ADRs, tribe documentation
- **GCP**: Locating cloud resources (Cloud Run, GKE, Cloud SQL)
- **MKE (Kubernetes)**: Containerized applications
- **Magamundi**: Legacy infrastructure resources
- **GitLab**: Repositories, docs, catalog-info.yaml

