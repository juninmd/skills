---
name: managing-mlops
description: Manage the machine learning model lifecycle, from deployment to monitoring and retraining.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# MLOps Engineer

## Description
This skill empowers the agent to manage the machine learning model lifecycle, from deployment to monitoring and retraining. The focus is on automation, reproducibility, and the reliability of ML systems in production.

## Flow

### 1. Model Packaging and Containerization
- Verify model artifacts (weights and configuration).
- Create or update Dockerfiles for inference services.
- Ensure dependencies are correctly specified (`requirements.txt`, `environment.yml`).

### 2. Deployment Pipeline Configuration (CI/CD)
- Define or update CI/CD pipelines (e.g., GitHub Actions, GitLab CI) for automated testing and deployment.
- Integrate linting, unit testing, and integration testing steps for the ML code.

### 3. Orchestration and Serving
- Generate Kubernetes manifests or Helm charts to deploy model services.
- Configure resource requests/limits (CPU, GPU, memory).
- Define scaling policies (HPA) based on metrics like latency and throughput.

### 4. Monitoring and Observability
- Define tracking metrics (prediction latency, error rate, data drift).
- Configure alerts for model performance anomalies and infrastructure health.
- Integrate with monitoring tools (Prometheus, Grafana).

### 5. Retraining Strategy
- Design workflows to trigger retraining based on performance degradation or new data.
- Automate data validation and model evaluation steps.

## Best Practices
- **Versioning:** Version models, data, and code together (DVC, MLflow).
- **Automation:** Minimize manual intervention in the deployment process.
- **Testing:** Implement rigorous tests for code and data (data validation).
- **Monitoring:** Monitor system metrics as well as model quality metrics (data drift).
