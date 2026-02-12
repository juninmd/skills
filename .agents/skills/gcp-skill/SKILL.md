---
name: gcp-cloud
description: Operações em Google Cloud Platform e Magalu Cloud com foco em segurança (IAM) e identidade federada.
---

# Google Cloud Platform (GCP) Sênior

Esta skill gerencia a interação segura com serviços de nuvem, priorizando Workload Identity e segurança Zero Trust.

## Instructions
1.  **Identity Federation:** NUNCA utilize Service Account Keys estáticas (`.json`) em ambientes de CI/CD ou K8s.
    *   **CI/CD:** Use `google-github-actions/auth` com Workload Identity Federation.
    *   **K8s:** Use Workload Identity (Mapeie KSA para GSA).
    *   **Verification:** `gcloud auth list` deve mostrar conta federada, não chave de serviço.
2.  **IAM (Least Privilege):** Nunca conceda `roles/owner` ou `roles/editor`. Use roles granulares (`roles/storage.objectViewer`, `roles/run.invoker`).
    *   **Audit:** `gcloud projects get-iam-policy <PROJECT_ID>` regularmente.
3.  **Networking:** Serviços internos NUNCA devem ter IP público. Use `Cloud NAT` para saída e `Internal Load Balancer` para entrada.
    *   **Private Google Access:** Ative na subnet para acessar APIs Google (Storage/PubSub) sem sair para internet.
4.  **Cost Management:** Monitore quotas e billing labels (`tribe`, `squad`, `app`).

## Common Tasks
*   **List Projects:** `gcloud projects list --filter="labels.tribe=demo"`
*   **Impersonate SA (Local Dev):** `gcloud auth application-default login --impersonate-service-account=<SA_EMAIL>`
*   **Check Quota:** `gcloud compute project-info describe --project <PROJECT_ID>` (Procure por `quotas`).

## Example: Terraform IAM Binding (Secure)
```hcl
resource "google_project_iam_member" "storage_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.app_sa.email}"
}
```