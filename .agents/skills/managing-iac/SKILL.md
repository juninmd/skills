---
name: managing-iac
description: "IaC provisioning with Terraform/Pulumi/Ansible. Triggers: terraform, iac."

argument-hint: "[resource/project] [options]"
disable-model-invocation: true
---

# Infrastructure as Code (IaC) Specialist

This skill defines the standards for building and maintaining secure and reproducible infrastructure.

## Instructions
1.  **Modularity First:** Divide the infrastructure into reusable and versioned modules.
    *   **Rationale:** Avoids duplication (DRY), facilitates rollbacks, and allows for isolated unit testing.
    *   **Structure:** `modules/vpc`, `modules/rds`, `modules/eks`. Each module must have `README.md`, `variables.tf`, and `outputs.tf`.
2.  **Automated Testing:** Test infrastructure as software code.
    *   **Validation:** Use `terraform validate` and `tflint` in PRs.
    *   **Unit Tests:** Use `terratest` (Go) or `pytest-terraform` to validate resource creation in an ephemeral environment.
    *   **Security:** Integrate `tfsec`, `checkov`, or `bridgecrew` into the pipeline.
3.  **State Management:** Use remote backends (S3 + DynamoDB Locking, GCS, Terraform Cloud).
  *   **Locking:** Never allow concurrent write access to the state.
  *   **Isolation:** Separate states by environment (`prod`, `staging`, `dev`) using distinct workspaces or directories.
4.  **Immutable Infrastructure:** Prefer recreating resources (Immutable) over modifying them in-place (Mutable), especially for servers.

## Common Tasks
*   **Create Module:** Create `main.tf` (resources), `variables.tf` (typed inputs), and `outputs.tf` (returned values).
*   **Run Linter:** `tflint --init && tflint` (validates best practices and provider errors).
*   **Run Security Scan:** `checkov -d .` (validates CIS/AWS/GCP compliance).
*   **Apply Plan:** `terraform plan -out=tfplan && terraform apply tfplan` (never apply without a saved plan).

## Examples
### Valid Terraform Module Interface Example
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

### Invalid Example (Hardcoded/Unsafe)
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
- **Terraform Best Practices:** Use `modules`, `remote state`, and `variable validation`.
- **Policy as Code:** Consider using OPA (Open Policy Agent) for complex compliance rules.

## Checklist

- [ ] Identify the desired state, provider boundaries, and blast radius before editing IaC.
- [ ] Prefer reusable modules and validated inputs over copy-pasted resources.
- [ ] Review the plan output and policy checks before applying changes.

## References

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Open Policy Agent Documentation](https://www.openpolicyagent.org/docs/latest/)

