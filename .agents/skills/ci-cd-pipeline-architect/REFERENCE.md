# CI/CD Pipeline Architect Reference

## Tools

### 1. `GitHub Actions`
**Description:** CI/CD platform built into GitHub.
**Key Concepts:**
- `Workflows`: Configurable automated processes (`.yml` files).
- `Jobs`: A set of steps that execute on the same runner.
- `Steps`: Individual tasks (commands or actions).

### 2. `GitLab CI/CD`
**Description:** Tool built into GitLab for software development.
**Key Concepts:**
- `.gitlab-ci.yml`: The file where you configure your CI/CD.
- `Pipelines`: The top-level component of continuous integration, delivery, and deployment.
- `Runners`: The agents that run your jobs.

### 3. `Jenkins`
**Description:** Open source automation server.
**Key Concepts:**
- `Jenkinsfile`: Text file that contains the definition of a Jenkins Pipeline.
- `Stages`: Distinct parts of the pipeline (Build, Test, Deploy).
