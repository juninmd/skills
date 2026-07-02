# Kubernetes Security Specialist Formulários 📋
## 1. Solicitação de Auditoria de Segurança Kubernetes (k8s_security_audit.md)

### Objetivo
Iniciar uma auditoria de segurança de cluster Kubernetes ou namespace específico.

### Campos
- **Contexto do Cluster:** [Nome do Context]
- **Namespace:** [Namespace específico / Todos]
- **Escopo da Auditoria:** [RBAC / NetworkPolicies / Node Security / Workload Security]
- **Padrão:** [CIS Benchmark / Custom Policy]

## 2. Solicitação de Política RBAC (rbac_policy_request.md)

### Objetivo
Solicitar permissões RBAC novas ou atualizadas.

### Campos
- **Tipo de Sujeito:** [User / Group / ServiceAccount]
- **Nome do Sujeito:** [Nome]
- **Namespace:** [Namespace]
- **Grupos de API:** [e.g., "", "apps", "batch"]
- **Recursos:** [e.g., "pods", "deployments", "jobs"]
- **Verbos:** [e.g., "get", "list", "watch", "create", "update", "patch", "delete"]
- **Justificativa:** [Motivo da solicitação]

## 3. Relatório de Achados de Segurança (k8s_security_report.md)

### Objetivo
Documentar riscos de segurança identificados e passos de remediação.

### Campos
- **Cluster/Namespace:** [Nome]
- **Data:** [Data]
- **Severidade:** [Critical / High / Medium / Low]
- **Achado:** [Descrição do problema]
- **Impacto:** [O que pode acontecer se explorado]
- **Remediação:** [Passos para corrigir]

