# IaC Specialist Formulários 📋
## 1. Infrastructure Design Form (infra_design.md)

### Goal
Define the architecture and resource specifications for a project.

### Fields
- **Project Name:** [Name of the project]
- **Cloud Provider:** [AWS, Azure, GCP, etc.]
- **IaC Tool:** [Terraform, Pulumi]
- **Resource List:**
    - [Resource Name]: [Type, Specs, Count]
    - ...
- **Architecture Diagram Description:**
    [Describe how resources connect]
- **Variables/Parameters:**
    - [Variable Name]: [Description, Default Value]
    - ...

## 2. Deployment Log Form (deployment_log.md)

### Goal
Record the results of an IaC execution.

### Fields
- **Deployment ID:** [Unique ID]
- **Date/Time:** [Timestamp]
- **Operation:** [Apply, Destroy, Refresh]
- **Status:** [Success, Failed, Partial]
- **Changes Summary:**
    - Added: [Count]
    - Changed: [Count]
    - Destroyed: [Count]
- **Outputs:**
    - [Output Name]: [Value]
    - ...
- **Errors (if any):**
    [Error message and stack trace]

