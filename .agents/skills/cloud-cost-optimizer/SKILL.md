---
name: cloud-cost-optimizer
description: Otimização de custos de nuvem (FinOps) usando Infracost, AWS Cost Explorer e GCP Billing.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Cloud Cost Optimizer (FinOps)

Esta skill foca na redução de desperdícios e previsão de custos de infraestrutura.

## Instructions
1.  **Shift-Left Cost:** Estime custos antes do deploy.
    *   **Tool:** Use `infracost` em Pull Requests de Terraform.
    *   **Command:** `infracost breakdown --path .`
2.  **Tagging Strategy:** Recursos sem tags são invisíveis para o financeiro.
    *   **Mandatory Tags:** `CostCenter`, `Environment` (prod/dev), `Owner` (squad).
3.  **Rightsizing:** Identifique recursos ociosos.
    *   **Compute:** CPU < 10% por 1 semana = Candidato a downgrade.
    *   **Storage:** Volumes EBS/PD desconectados devem ser deletados ou snapshotados.
4.  **Spot Instances:** Use Spot para workloads tolerantes a falhas (ex: Batch jobs, CI runners).

## Common Tasks
### AWS
*   **Check Monthly Cost:** `aws ce get-cost-and-usage --time-period Start=2023-10-01,End=2023-11-01 --granularity MONTHLY --metrics "BlendedCost"`
*   **List Unused IPs:** `aws ec2 describe-addresses --filters "Name=association-id,Values=null"`

### GCP
*   **Check Billing:** `gcloud beta billing accounts list`
*   **Estimate Resource:** Use a Calculadora de Preços do GCP para estimativas manuais complexas.

### Kubernetes
*   **OpenCost:** Instale o OpenCost para visibilidade de custos por Pod/Namespace.
*   **Query:** `kubectl cost namespace --show-all-resources`

## Best Practices
- **Budgets:** Configure alertas de orçamento (AWS Budgets / GCP Budgets) em 50%, 80% e 100%.
- **Lifecycle Policies:** Configure S3 Lifecycle para mover objetos antigos para Glacier.
- **Cleanup:** Scripts automáticos para deletar ambientes de dev às 20h (Cloud Scheduler).
