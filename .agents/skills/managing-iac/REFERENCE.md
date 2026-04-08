# IaC Specialist Referência 📚
## Ferramentas e Comandos Comuns
### 1. Terraform
**Description:** Infrastructure as Code tool by HashiCorp using HCL (HashiCorp Configuration Language).

**Comandos Comuns:**
- `terraform init`: Initialize a new or existing Terraform working directory.
- `terraform plan`: Generate and show an execution plan.
- `terraform apply`: Builds or changes infrastructure.
- `terraform destroy`: Infrastructure-managed surroundings destruction.
- `terraform validate`: Check whether the configuration is valid.
- `terraform state list`: List resources in the state file.

### 2. Pulumi
**Description:** Infrastructure as Code tool using general-purpose programming languages (Python, TypeScript, Go, etc.).

**Comandos Comuns:**
- `pulumi new`: Create a new Pulumi project.
- `pulumi stack init`: Create a new stack.
- `pulumi preview`: Show a preview of updates.
- `pulumi up`: Create or update resources.
- `pulumi destroy`: Destroy existing resources.
- `pulumi stack output`: Show stack outputs.

## Provider Specifics

### AWS (Amazon Web Services)
- **Key Resources:** `aws_instance`, `aws_vpc`, `aws_s3_bucket`, `aws_rds_cluster`.
- **Authentication:** Use IAM roles, environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`), or profile configuration.

### Azure
- **Key Resources:** `azurerm_resource_group`, `azurerm_virtual_network`, `azurerm_linux_virtual_machine`.
- **Authentication:** Use Service Principals, Managed Identities, or Azure CLI login.

### Google Cloud (GCP)
- **Key Resources:** `google_compute_instance`, `google_storage_bucket`, `google_container_cluster`.
- **Authentication:** Use Service Account keys or Application Default Credentials (ADC).
