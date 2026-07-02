---
name: optimizing-cloud-costs
description: Cloud cost optimization (FinOps) using Infracost, AWS Cost Explorer, and GCP Billing.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Cloud Cost Optimizer (FinOps)

This skill focuses on waste reduction and infrastructure cost forecasting.

## Instructions
1.  **Shift-Left Cost:** Estimate costs before deployment.
    *   **Tool:** Use `infracost` in Terraform Pull Requests.
    *   **Command:** `infracost breakdown --path .`
2.  **Tagging Strategy:** Resources without tags are invisible to finance.
    *   **Mandatory Tags:** `CostCenter`, `Environment` (prod/dev), `Owner` (squad).
3.  **Rightsizing:** Identify idle resources.
    *   **Compute:** CPU < 10% for 1 week = Candidate for downgrade.
    *   **Storage:** Disconnected EBS/PD volumes should be deleted or snapshotted.
4.  **Spot Instances:** Use Spot for fault-tolerant workloads (e.g., Batch jobs, CI runners).

## Common Tasks

### AWS
*   **Check Monthly Cost:** `aws ce get-cost-and-usage --time-period Start=2023-10-01,End=2023-11-01 --granularity MONTHLY --metrics "BlendedCost"`
*   **List Unused IPs:** `aws ec2 describe-addresses --filters "Name=association-id,Values=null"`

### GCP
*   **Check Billing:** `gcloud beta billing accounts list`
*   **Estimate Resource:** Use the GCP Pricing Calculator for complex manual estimates.

### Kubernetes
*   **OpenCost:** Install OpenCost for cost visibility per Pod/Namespace.
*   **Query:** `kubectl cost namespace --show-all-resources`

## Best Practices
- **Budgets:** Configure budget alerts (AWS Budgets / GCP Budgets) at 50%, 80%, and 100%.
- **Lifecycle Policies:** Configure S3 Lifecycle to move old objects to Glacier.
- **Cleanup:** Automatic scripts to delete dev environments at 8 PM (Cloud Scheduler).

