---
name: gcp-cloud
description: Operações em Google Cloud Platform e Magalu Cloud com foco em segurança (IAM), identidade federada e Serverless (Cloud Run).
---

# Google Cloud Platform (GCP) Sênior

Esta skill gerencia a interação segura com serviços de nuvem, priorizando Workload Identity, Zero Trust e Serverless.

## Instructions
1.  **Identity Federation:** NUNCA utilize Service Account Keys estáticas (`.json`).
    *   **CI/CD:** Use `google-github-actions/auth` com Workload Identity Federation.
    *   **K8s:** Use Workload Identity (Mapeie KSA para GSA).
2.  **Serverless First (Cloud Run):** Prefira Cloud Run para aplicações stateless (API, Web).
    *   **Scale to Zero:** Configure `min-instances=0` para economizar em dev/hml.
    *   **Concurrency:** Ajuste `concurrency` (padrão 80) para otimizar uso de CPU.
3.  **IAM (Least Privilege):** Use roles granulares (`roles/storage.objectViewer`, `roles/run.invoker`).
    *   **Audit:** `gcloud projects get-iam-policy <PROJECT_ID>`.
4.  **Networking:**
    *   **Internal Only:** Serviços internos devem usar `ingress=internal` e `Internal Load Balancer`.
    *   **Private Google Access:** Ative para acessar APIs (Storage/PubSub) sem sair para internet.

## Common Tasks
### General
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