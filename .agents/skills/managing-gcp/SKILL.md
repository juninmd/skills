---
name: managing-gcp
description: Operations on Google Cloud Platform and Magalu Cloud focusing on security (IAM), federated identity, and Serverless (Cloud Run).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
disable-model-invocation: true
---

# Google Cloud Platform (GCP) Senior

This skill manages secure interaction with cloud services, prioritizing Workload Identity, Zero Trust, and Serverless.

## Instructions
1.  **Identity Federation:** NEVER use static Service Account Keys (`.json`).
    *   **CI/CD:** Use `google-github-actions/auth` with Workload Identity Federation.
    *   **K8s:** Use Workload Identity (Map KSA to GSA).
2.  **Serverless First (Cloud Run):** Prefer Cloud Run for stateless applications (API, Web).
    *   **Scale to Zero:** Configure `min-instances=0` to save in dev/hml.
    *   **Concurrency:** Adjust `concurrency` (default 80) to optimize CPU usage.
3.  **IAM (Least Privilege):** Use granular roles (`roles/storage.objectViewer`, `roles/run.invoker`).
    *   **Audit:** `gcloud projects get-iam-policy <PROJECT_ID>`.
4.  **Networking:**
    *   **Internal Only:** Internal services should use `ingress=internal` and an `Internal Load Balancer`.
    *   **Private Google Access:** Enable to access APIs (Storage/PubSub) without going out to the internet.

## Common Tasks### General
*   **List Projects:** `gcloud projects list --filter="labels.tribe=demo"`
*   **Impersonate SA:** `gcloud auth application-default login --impersonate-service-account=<SA_EMAIL>`

### Cloud Run
*   **List Services:** `gcloud run services list`
*   **Describe Config:** `gcloud run services describe <SERVICE_NAME> --format=yaml`
*   **Update Traffic:** `gcloud run services update-traffic <SERVICE> --to-latest`

## Example: Terraform Cloud Run (Secure)
```hcl
resource "google_cloud_run_service_iam_member" "invoker" {
  location = google_cloud_run_service.api.location
  project  = google_cloud_run_service.api.project
  service  = google_cloud_run_service.api.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.frontend_sa.email}"
}
```
