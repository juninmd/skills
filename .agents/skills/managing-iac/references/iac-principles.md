# Infrastructure as Code Principles

Core standards for building secure and reproducible infrastructure.

## 1. Modularity
- **Divided Responsibility:** Split infrastructure into reusable, versioned modules (e.g., `modules/vpc`, `modules/eks`).
- **Standard Layout:** Every module requires a `README.md`, `variables.tf`, and `outputs.tf`.
- **DRY:** Avoid duplication by parameterizing common resource patterns.

## 2. State Management
- **Remote Backends:** Mandatory use of remote stores (S3, GCS, Terraform Cloud) with state locking (DynamoDB).
- **Environment Isolation:** Separate states using distinct directories or workspaces for `dev`, `staging`, and `prod`.
- **Locking:** Never allow concurrent state writes.

## 3. Automated Testing and Security
- **Validation:** Use `terraform validate` and `tflint`.
- **Unit Tests:** Utilize `terratest` (Go) for ephemeral resource validation.
- **Security Scans:** Integrate `tfsec` or `checkov` into CI/CD pipelines to catch misconfigurations early.
- **Immutability:** Recreate resources instead of modifying them in-place where possible.
