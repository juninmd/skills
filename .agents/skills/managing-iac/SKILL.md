---
name: managing-iac
description: |
  **DEVOPS SKILL** - Build and maintain secure, reproducible infrastructure as code.
  USE FOR: Terraform modules, Pulumi stacks, IaC testing (terratest), state management, security scanning (tfsec/checkov), policy as code (OPA).
  DO NOT USE FOR: manual cloud console edits, OS-level administration, application deployment (use configuring-ci-cd).
  INVOKES: terraform, tflint, checkov, terratest.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "AWS, GCP, Azure, Terraform, Pulumi"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Infrastructure as Code (IaC) Specialist

Expert methodology for building and maintaining modular, secure, and reproducible infrastructure through code, with a focus on testing and automated validation.

**USE FOR:**
- Designing and implementing reusable Terraform or Pulumi modules.
- Configuring remote state backends with locking and environment isolation.
- Setting up automated IaC quality gates (linting, validation, security).
- Implementing unit tests for infrastructure resources using Terratest.
- Enforcing compliance through Policy as Code (OPA).

**DO NOT USE FOR:**
- Ad-hoc infrastructure changes via cloud consoles.
- Designing high-level architecture without implementation (use managing-cloud-infrastructure).

**INVOKES:**
- `terraform`, `tflint`, `tfsec`, `checkov` CLI tools.

## Methodology and Guidelines
Implementation details for principles, state management, and operations are documented in:
1. [IaC Principles & Security](references/iac-principles.md)
2. [IaC Operations & Examples](references/iac-operations.md)

## Core Principles
1. **Modules First:** Every resource belongs in a versioned module with clear inputs/outputs.
2. **Immutable Strategy:** Prefer recreating resources over in-place modifications.
3. **Plan Before Apply:** Never apply changes without inspecting and saving a plan file.

## Checklist
- [ ] Identify the provider boundary and blast radius before implementation.
- [ ] Verify that all variables have explicit types and validation blocks.
- [ ] Ensure remote state locking is active and configured correctly.
- [ ] Pass all security and linting checks before proposing a merge.
