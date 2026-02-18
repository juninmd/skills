---
name: env-security-skill
description: Proteção de segredos e gestão rigorosa de arquivos .env e .gitignore para evitar vazamentos.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Environment Security

Esta skill foca na proteção de credenciais e segredos no repositório.

## Instructions
- Audite o `.gitignore` antes de cada commit.
- Use o script `scripts/audit_secrets.sh` para verificar o repositório.

## Resources
- Ver `assets/FORMS.md` para checklist de segurança de PR.