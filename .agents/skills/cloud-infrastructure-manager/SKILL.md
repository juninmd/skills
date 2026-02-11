# Cloud Infrastructure Manager Skill

## Description
This skill enables the agent to provision, configure, and manage cloud resources across major providers (AWS, Google Cloud, Azure). It involves infrastructure-as-code (IaC), deployment automation, and resource monitoring.

## Workflow

### 1. Plan & Design
- Analyze the infrastructure requirements (compute, storage, networking).
- Choose the appropriate cloud services and architecture.
- Define resource specifications (instance types, regions, etc.).

### 2. Infrastructure as Code (IaC)
- Write Terraform or CloudFormation templates to define the infrastructure.
- Version control the IaC code.
- Validate the templates for syntax errors and best practices.

### 3. Provision & Deploy
- Use CLI tools (e.g., `aws`, `gcloud`, `terraform`) to apply changes.
- Review execution plans before applying.
- Monitor the deployment process for errors.

### 4. Configure & Secure
- Apply configuration management (Ansible, Chef, Puppet) if needed.
- Implement security best practices (IAM roles, security groups, encryption).
- Ensure compliance with organizational policies.

### 5. Monitor & Maintain
- Set up monitoring and alerting (CloudWatch, Stackdriver).
- Perform routine maintenance (updates, backups).
- Optimize costs by identifying underutilized resources.

## Best Practices
- **Idempotency:** Ensure that applying the same configuration multiple times results in the same state.
- **Least Privilege:** Grant only necessary permissions to resources and users.
- **Infrastructure as Code:** Treat infrastructure definitions as code (versioning, review, testing).
