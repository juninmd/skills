---
name: operating-infrastructure
description: Operações avançadas de infraestrutura (RDP fix, K8s clean, DNS, Traffic Shifting).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[resource/cluster] [options]"
disable-model-invocation: true
---

# Infrastructure Operations

Conjunto de procedimentos para manutenção e correção de infraestrutura cloud e on-premise.

## Capabilities

### 1. Fix Windows RDP NLA
**Gatilho:** "erro de NLA", "falha RDP".
- **Ação:** Desabilitar NLA via registro remoto.
- **Comando:** `reg add "HKLM\...\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 0 /f`.

### 2. Kubernetes Bulk Deprovision
**Gatilho:** "limpar cluster", "excluir apps".
- **Ação:** Remover Application no ArgoCD ou recursos diretos.
- **Comando:** `kubectl delete application <app> -n argocd --cascade=foreground`.

### 3. Traffic Weight Shift
**Gatilho:** "virar a carga", "canary".
- **Ação:** Ajustar pesos no Ingress/GLB (0 vs 100).
- **Validação:** Checar P95 de latência antes de virar.

### 4. Decommission DNS FQDN
**Gatilho:** "remover dns", "decomissionar".
- **Ação:** Remover entrada no Route53 e Edge (Azion).
- **Comando:** `aws route53 change-resource-record-sets ...`.
