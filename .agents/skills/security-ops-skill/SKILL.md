---
name: security-ops
description: Operações de segurança ofensiva e defensiva (WAF, Rotação de Credenciais).
---

# Security Operations

Procedimentos para garantir a postura de segurança e conformidade.

## Capabilities

### 1. Configure WAF Posture
**Gatilho:** "bloquear waf", "modo learning".
- **Ação:** Testar exposição pública e alterar para `BLOCK`.
- **Validação:** `curl -I` no endpoint público.

### 2. Rotate Legacy Credentials
**Gatilho:** "rotacionar senha", "vazamento".
- **Ação:** Atualizar secret no PaaS (Teresa) e criptografar no Ansible Vault.
- **Comando:** `ansible-vault encrypt_string`.
