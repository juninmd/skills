# Infrastructure as Code (IaC) Specialist Skill

## Description
This skill enables the agent to design, implement, and manage cloud infrastructure using code. It focuses on using tools like Terraform and Pulumi to provision, update, and version control infrastructure across various cloud providers.

## Workflow

### 1. Analyze Requirements
- Review the desired infrastructure state (e.g., VPC, EC2 instances, S3 buckets, RDS databases).
- Identify the target cloud provider (AWS, Azure, GCP).
- Determine the appropriate IaC tool (Terraform, Pulumi).

### 2. Design & Plan
- Define the resource hierarchy and modular structure.
- Select appropriate providers and versions.
- Plan for state management (remote backends, locking).

### 3. Implementation (Terraform/Pulumi)
- Write the IaC configuration files (`.tf` for Terraform, or language-specific files for Pulumi).
- Utilize modules for reusability and maintainability.
- Configure variables and outputs for dynamic behavior.

### 4. Validation & Execution
- Run `terraform validate` or `pulumi preview` to check for syntax and logical errors.
- Execute `terraform plan` or `pulumi preview` to inspect the proposed changes.
- Apply the changes using `terraform apply` or `pulumi up` after confirmation.

### 5. Management & Maintenance
- Perform regular state reconciliations.
- Manage resource drift by comparing code with actual infrastructure.
- Execute clean-up ( `terraform destroy` or `pulumi destroy`) when resources are no longer needed.

## Best Practices
- **Version Control:** Always store IaC code in Git.
- **State Security:** Use remote backends with encryption and access control for state files.
- **Modularity:** Break down large configurations into small, reusable modules.
- **Immutability:** Treat infrastructure as immutable; favor replacing over patching.
- **Testing:** Use tools like `terratest` or `pulumi-policy` to verify infrastructure logic.
