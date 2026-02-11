---
name: triage-recon
description: Investigação inicial de alertas e mapeamento de recursos cloud através do protocolo DNS First.
---

# Triage & Reconnaissance

Esta skill define o protocolo de triagem profunda para incidentes.

## Protocolo Obrigatório
1.  **DNS First**: Converta Hostnames para IPs via `nslookup` ou `dig`.
2.  **Asset Inventory**: Identifique o recurso (GCE, SQL, GKE).
3.  **Confirmação**: Valide `Project ID` e `Resource Name`.