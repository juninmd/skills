---
name: managing-cicd
description: Management of GitLab CI pipelines, SonarQube integration, and automated deployments via ArgoCD.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# CI/CD & Deploy (GitLab CI)

This skill provides mandatory guidelines and automation for GitLab CI/CD pipelines, ensuring that every project includes dependency installation, build, testing, static analysis (Sonar), and security gates.

## Core Mandates for Every Project
Every repository must have a `.gitlab-ci.yml` file with the following mandatory stages:
1.  **`install`**: Dependency resolution and management.
2.  **`build`**: Artifact generation (if applicable).
3.  **`test`**: Automated unit and integration testing.
4.  **`sonar`**: Static code quality analysis.
5.  **`security_gate`**: Vulnerability and secret scanning.

## Instructions

### 1. Mandatory Stages
The standard pipeline structure should always follow this order:
```yaml
stages:
  - install
  - test
  - report  # Stage used for security and additional reports
  - deploy
```

### 2. Mandatory Quality & Security Jobs (Exact Snippets)

#### Security Gate (Atena/ci-knife)
This job is mandatory for scanning vulnerabilities and must run on all branches.
```yaml
security_gate:
  stage: report
  image: $CIKNIFE_IMAGE
  script:
    - ci-knife security-scanner
  only:
    - branches
  except:
    changes:
      - CHANGELOG.md
  allow_failure: true
```

#### SonarQube Analysis
This job is mandatory for quality metrics and must run on tags.
```yaml
sonar:
  stage: install
  image: $CIKNIFE_IMAGE
  script:
    - ci-knife sonar-scanner
  variables:
    SONAR_URL: $SONAR_URL
    SONAR_ANALYSIS_MODE: publish
    SONAR_TOKEN: $SONAR_TOKEN
  only:
    - tags
  except:
    changes:
      - CHANGELOG.md
```

### 3. Pipeline Optimization (Cache Strategy)
Using cache is mandatory to avoid redundant downloads and speed up the pipeline. Always use a key based on the project's lockfile.

#### Node.js (pnpm/npm) Example:
```yaml
cache:
  key:
    files:
      - pnpm-lock.yaml
  paths:
    - .pnpm-store/
    - node_modules/
  policy: pull-push
```

#### Python (uv) Example:
```yaml
cache:
  key:
    files:
      - uv.lock
  paths:
    - .venv/
    - .cache/uv
```

### 4. Step-by-Step for Non-Developers
- **Step 1:** Create a `.gitlab-ci.yml` file in the project root.
- **Step 2:** Define the stages: `install`, `test`, `report`, and `deploy`.
- **Step 3:** Implement the dependency installation with **cache** (copy the cache snippet above).
- **Step 4:** Copy and paste the `security_gate` and `sonar` snippets above.
- **Step 5:** Ensure tests are running and generating coverage reports.

## Testing Scenarios
- **Scenario: Missing .gitlab-ci.yml.**
  - **Action:** Alert the user immediately and offer to generate the base configuration.
- **Scenario: security_gate missing.**
  - **Action:** Warn that the project is non-compliant and insert the mandatory snippet.
- **Scenario: Pipeline fails in the `install` stage.**
  - **Action:** Check lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `requirements.txt`).
- **Scenario: Sonar fails due to missing token.**
  - **Action:** Guide the user to add `SONAR_TOKEN` to the GitLab CI/CD Variables.

## Capabilities
- **Mandatory Configuration**: Insertion of `security_gate` and `sonar` jobs.
- **CI/CD Lifecycle**: Full management from install to deploy.
- **Standards Compliance**: Verification of mandatory steps and image usage.
- **Troubleshooting**: Identifying failures in each stage of the pipeline.
