# GitHub Actions Docs Strategy

Methodology for classifying and searching official documentation.

## 1. Request Classification
Choose the closest bucket before searching:
- **Authoring:** YAML syntax, triggers, events, expressions, variables.
- **Infrastructure:** Runners (hosted/self-hosted), Actions Runner Controller.
- **Standardization:** Reusable workflows, templates, custom actions.
- **Security:** Secrets, OIDC, GITHUB_TOKEN, attestations.
- **Ops:** Monitoring, troubleshooting, deployments.
- **Migration:** From Jenkins, GitLab, Azure Pipelines, etc.

## 2. Search Execution
- Source: Always `docs.github.com/en/actions`.
- Precision: Search using exact terms + category (e.g., `OIDC workflow syntax`).
- Verification: Compare 2-3 pages; read the specific section before answering.
- Conflict: If docs conflict with local conventions, flag the discrepancy.
