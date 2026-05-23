# IaC Operations and Examples

Detailed procedures and code standards for Terraform and Open Policy Agent.

## 1. Common Tasks
- **Create Module:** Implement `main.tf`, `variables.tf` (with validation), and `outputs.tf`.
- **Linting:** `tflint --init && tflint`.
- **Security Check:** `checkov -d .`.
- **Deployment Flow:** `terraform plan -out=tfplan && terraform apply tfplan`.

## 2. Example: Valid Module Interface
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

## 3. Policy as Code
Use **Open Policy Agent (OPA)** for complex compliance rules that go beyond standard linter checks.

## References
- [Terraform Docs](https://developer.hashicorp.com/terraform/docs)
- [OPA Documentation](https://www.openpolicyagent.org/docs/latest/)
