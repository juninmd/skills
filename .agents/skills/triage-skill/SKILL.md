---
name: triage-recon
description: Investigação de incidentes, triagem de alertas e mapeamento de recursos cloud com rigor forense (DNS/Logs/Impact).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Triage & Reconnaissance (Incident Response)

Esta skill estabelece o protocolo de "Primeira Resposta" para qualquer anomalia.

## Protocolo Obrigatório (The 5 Steps)
1.  **Check Status Pages:** Antes de culpar o código, verifique dependências externas.
    *   **External:** Google Cloud Status, GitHub Status, Payments Gateway.
    *   **Internal:** Status Page da Plataforma Luizalabs.
2.  **DNS Investigation (DNS First):** O problema é conectividade ou aplicação?
    *   **Command:** `dig +short <hostname>` (Resolve IP?).
    *   **Command:** `nc -zv <host> <port>` (Porta aberta?).
3.  **Asset Identification:** Onde está rodando? (K8s, VM, Cloud Function).
    *   **Verification:** `kubectl get pods -l app=<name>`
4.  **Impact Assessment:** Defina severidade (P1=Crítico, P2=Alto, P3=Médio).
    *   **Criteria:** Afeta checkout? (P1). Afeta relatório interno? (P3).
5.  **Log Analysis (Deep Dive):** Procure por padrões de erro.
    *   **Search:** `ERROR`, `FATAL`, `EXCEPTION`, `TIMEOUT`.
    *   **Trace ID:** Copie o Trace ID do erro e busque em todos os serviços relacionados.

## Troubleshooting Commands
*   **Network Path:** `mtr -r -c 10 <target_ip>` (Perda de pacote?).
*   **Kubernetes Events:** `kubectl get events --sort-by=.lastTimestamp` (Ocorreu OOMKill? Eviction?).
*   **Log Grep:** `kubectl logs -l app=my-app --tail=200 | grep -i "error"`

## Example: Incident Report Template
```markdown
### Incident Summary
- **Severity:** P2
- **Service:** Order API
- **Impact:** 5% failed orders
- **Root Cause (Hypothesis):** Database connection pool exhaustion
- **Action:** Restarting pods and increasing pool size
```