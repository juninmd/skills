---
name: labs-navigating-organizations
description: Navigation in organizational structures and search in historical knowledge bases (Confluence, Mapa Labs).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Organizational & Legacy Knowledge

This skill assists in discovering service owners, navigating organizational structures, and searching historical knowledge bases at Luizalabs.

## When to use this skill
- Discover who is the owner or team responsible for a service
- Find technical documentation and historical runbooks
- Navigate the organizational structure (tribes, verticals, squads)
- Locate resources in GCP, Kubernetes, or legacy infrastructure
- Consult past architectural decisions and ADRs
- Find contacts for experts in specific technologies

## Instructions

### Discovering Service Owners

#### Mapa Labs (Primary Organizational Tool)
Mapa Labs is the official service catalog and organizational mapper of Luizalabs.

**Access via Web**:
- URL: [https://mapa-labs.web.app](https://mapa-labs.web.app)
- Use this to discover the squad/tribe structure, Tech Leads, and service ownership.
- It also links to other critical tools like GitLab, Hangar, and Grafana for each service.

**Information available in Mapa Labs**:
- Squad/Tribe responsible
- Tech Lead and Product Owner
- Links to: GitLab, Backstage (Hangar), Grafana, Kibana
- SLA and service criticality
- Technologies used
- Upstream/downstream dependencies

#### Backstage (Hangar)
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
# Look for catalog-info.yaml or hangar-info.yaml in the repo root
metadata:
  name: code-quality
spec:
  owner: 'group:62bcb2215ebf58b18f19c0d5' # Aliança Backoffice
```

To discover the tribe name from the Group ID, use:
```bash
curl -s "https://backstage.luizalabs.com/api/catalog/entities?filter=kind=Group" | \
  jq '.[] | select(.metadata.uid=="62bcb2215ebf58b18f19c0d5")'
```

   - https://backstage.luizalabs.com/catalog/default/component/{service-name}/docs

#### Luizalabs Hierarchy
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
luizalabs-code-quality-hml
# Cloud Run services
gcloud run services list --project=luizalabs-code-quality-prd

# GKE clusters
gcloud container clusters list --project=luizalabs-infra-k8s-prd

# Cloud SQL instances
gcloud sql instances list --project=luizalabs-data-prd

# Secrets
gcloud secrets list --project=luizalabs-code-quality-prd
```

**IAM and permissions**:
```bash
# Who has access to the project
gcloud projects get-iam-policy luizalabs-code-quality-prd

# Test if you have permission
gcloud projects get-iam-policy luizalabs-code-quality-prd \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$(gcloud config get-value account)"
```

#### Kubernetes (MKE - Magalu Kubernetes Engine)

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
- URL: https://magamundi.luizalabs.com
- Requires VPN and specific permissions

**Typical resources**:
- Legacy VMs (CentOS, Ubuntu)
- Services not yet migrated to Cloud
- On-prem databases (old Oracle, PostgreSQL)
- Load balancers F5

**When to consult Magamundi**:
- Service not found in GCP or MKE
- "host not found" error for old internal domains (e.g., `*.luizalabs.intra`)
- Documentation mentions servers by hostname (e.g., `app-server-01.luizalabs.intra`)

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
   - https://backstage.luizalabs.com/catalog/default/component/{service-name}/docs
   - Automatically generated documentation from the repo

4. **Tribe Confluence**
   - https://confluence.luizalabs.com/display/{Tribe}/Runbooks
   - Search for: "{service-name} runbook"

5. **Grafana Dashboards and Alerts**
   - https://grafana.luizalabs.com
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
gitlab --project luizalabs/code-quality tree --ref main --path docs/runbooks

# In Confluence
# Access: https://confluence.luizalabs.com
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
1. Check Mapa Labs first: https://mapa-labs.luizalabs.com
2. If it's not there, check Backstage: https://backstage.luizalabs.com
3. Look for `catalog-info.yaml` or `hangar-info.yaml` in the GitLab repo
4. Last option: ask on Slack in `#ask-architecture`

### Service is not in GCP or MKE
- Consult Magamundi: https://magamundi.luizalabs.com
- It might be an on-prem legacy service
- Check historical documentation in Confluence

### I don't have access to Confluence/Mapa Labs/Backstage
- Request access via ServiceNow: https://luizalabs.service-now.com
- Category: "Access Request"
- Justification: "Development and troubleshooting"

### I need to speak with an expert in a technology
1. Confluence: `/display/TECH/Especialistas`
2. Slack: `#ask-{technology}` (e.g., `#ask-kubernetes`, `#ask-argocd`)
3. Mapa Labs: see the "Tech Lead" field of the related service

### Runbook is outdated
- Create issue in the service's GitLab
- Mention in the responsible team's Slack
- If urgent, look for Grafana alerts (usually more up-to-date)

## Capabilities
- **Mapa Labs**: Discovery of owners and service structure
- **Backstage (Hangar)**: Technical catalog and TechDocs
- **Confluence**: Runbooks, ADRs, tribe documentation
- **GCP**: Locating cloud resources (Cloud Run, GKE, Cloud SQL)
- **MKE (Kubernetes)**: Containerized applications
- **Magamundi**: Legacy infrastructure resources
- **GitLab**: Repositories, docs, catalog-info.yaml
