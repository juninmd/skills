---
name: mlops-engineer
description: Manage the lifecycle of machine learning models from deployment to monitoring and retraining
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# MLOps Engineer Skill

## Description
This skill empowers the agent to manage the lifecycle of machine learning models, from deployment to monitoring and retraining. It focuses on automation, reproducibility, and reliability of ML systems in production.

## Workflow

### 1. Model Packaging & Containerization
- Verify model artifacts (weights, configuration).
- Create or update Dockerfiles for model inference services.
- Ensure dependencies are correctly specified (requirements.txt, environment.yml).

### 2. Deployment Pipeline Configuration (CI/CD)
- Define or update CI/CD pipelines (e.g., GitHub Actions, GitLab CI) for automated testing and deployment.
- Integrate steps for linting, unit testing, and integration testing of ML code.

### 3. Orchestration & Serving
- Generate Kubernetes manifests or Helm charts for deploying model services.
- Configure resource requests/limits (CPU, GPU, Memory).
- Set up scaling policies (HPA) based on metrics like latency or throughput.

### 4. Monitoring & Observability
- Define metrics to track (prediction latency, error rate, data drift).
- Configure alerts for anomalies in model performance or infrastructure health.
- Integrate with monitoring tools (Prometheus, Grafana).

### 5. Retraining Strategy
- Design workflows for triggering model retraining based on performance degradation or new data availability.
- Automate data validation and model evaluation steps.

## Best Practices
- **Version Control:** Version models, data, and code together (DVC, MLflow).
- **Automation:** Minimize manual intervention in the deployment process.
- **Testing:** Implement rigorous testing for both code and data (data validation).
- **Monitoring:** Monitor not just system metrics but also model quality metrics (drift).
