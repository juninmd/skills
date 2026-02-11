---
name: ci-cd-pipeline-architect
description: This skill enables the agent to design, implement, and maintain Continuous Integration (CI) and Continuous Deployment (CD) pipelines.
---

# CI/CD Pipeline Architect

## Instructions
- Define stages (e.g., Build, Test, Scan, Deploy).
- Identify triggers (e.g., Push to main, Pull Request, Release Tag).
- Determine environments (e.g., Dev, Staging, Prod).
- Automate code checkout.
- Run linters and unit tests.
- Build artifacts (e.g., Docker images, binaries).
- Publish artifacts to registries.
- Deploy artifacts to target environments.
- Implement deployment strategies (e.g., Blue/Green, Canary, Rolling).
- Run integration and smoke tests after deployment.
- Minimize build times (caching dependencies).
- Ensure pipeline reliability and security (secrets management).
- Monitor pipeline execution and failure rates.

## Resources
- **Fail Fast:** Detect errors as early as possible in the pipeline.
- **Infrastructure as Code:** Define pipelines in code (e.g., `.github/workflows`, `.gitlab-ci.yml`).
- **Immutable Artifacts:** Build once, deploy everywhere.
