---
name: configuring-sonarqube
description: Configuration and standardization of the sonar-project.properties file to ensure compliance with Enterprise quality metrics.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[config/tool] [options]"
---

# Configuring SonarQube

This skill provides the template and guidelines for configuring `sonar-project.properties` in MyProject repositories.

## Concept
SonarQube is the official tool at Enterprise for static code analysis and quality metrics (test coverage, code smells, vulnerabilities). Every repository must have the `sonar-project.properties` file correctly configured at the root.

## Instructions
1.  **Template:** Use the official template located at `assets/sonar-project.properties`.
2.  **Variables:**
    *   Replace `{APPNAME}` with the project name in GitLab (e.g., `api-my-service`).
    *   Adjust `sonar.sources` and `sonar.tests` according to the project structure.
3.  **Language and Coverage:**
    *   For Python projects, ensure the line `sonar.python.coverage.reportPaths=coverage.xml`.
    *   For Node.js/TS projects, ensure the line `sonar.javascript.lcov.reportPaths=coverage/lcov.info`.
4.  **Exclusions:** Always ignore dependency folders (node_modules, venv) and build/dist files.

## Validation
- Ensure that the project's test coverage meets MyProject limits (usually >= 90%).
- The pipeline will run the `ci-knife sonar-scanner` command based on these properties.

