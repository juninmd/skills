---
name: infrastructure-as-code-specialist
description: Provisionamento de infraestrutura como código (Terraform/Pulumi/Ansible) com foco em modularidade, testes e segurança.
---

# Infrastructure as Code (IaC) Specialist

Esta skill define os padrões para construção e manutenção de infraestrutura segura e reprodutível.

## Instructions
1.  **Modularity First:** Divida a infraestrutura em módulos reutilizáveis e versionados.
    *   **Reasoning:** Evita duplicação (DRY), facilita rollbacks e permite testes unitários isolados.
    *   **Structure:** `modules/vpc`, `modules/rds`, `modules/eks`. Cada módulo deve ter `README.md`, `variables.tf`, `outputs.tf`.
2.  **Automated Testing:** Teste a infraestrutura como código de software.
    *   **Validation:** Use `terraform validate` e `tflint` em PRs.
    *   **Unit Tests:** Use `terratest` (Go) ou `pytest-terraform` para validar criação de recursos em ambiente efêmero.
    *   **Security:** Integre `tfsec`, `checkov` ou `bridgecrew` no pipeline.
3.  **State Management:** Use backends remotos (S3 + DynamoDB Locking, GCS, Terraform Cloud).
    *   **Locking:** Nunca permita concorrência de escrita no estado.
    *   **Isolation:** Separe estados por ambiente (`prod`, `staging`, `dev`) usando workspaces ou diretórios distintos.
4.  **Immutable Infrastructure:** Prefira recriar recursos (Immutable) a modificá-los in-place (Mutable), especialmente servidores.

## Common Tasks
*   **Create Module:** Crie `main.tf` (recursos), `variables.tf` (inputs tipados) e `outputs.tf` (retorno de valores).
*   **Run Linter:** `tflint --init && tflint` (valida boas práticas e erros de provider).
*   **Run Security Scan:** `checkov -d .` (valida conformidade CIS/AWS/GCP).
*   **Apply Plan:** `terraform plan -out=tfplan && terraform apply tfplan` (nunca aplique sem plano salvo).

## Examples
### Valid Terraform Module Interface
```hcl
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "Must be a valid IPv4 CIDR block."
  }
}

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}
```

### Invalid (Hardcoded/Unsafe)
```hcl
resource "aws_security_group" "allow_all" {
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # SECURITY RISK
  }
}
```

## Resources
- **Terraform Best Practices:** Use `modules`, `remote state`, `variable validation`.
- **Policy as Code:** Considere usar OPA (Open Policy Agent) para regras de conformidade complexas.
