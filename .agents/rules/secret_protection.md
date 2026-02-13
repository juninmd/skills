---
name: secret-protection
description: Proteção de segredos e prevenção de vazamento de credenciais no código.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Secret Leak Prevention
# Id: secret_protection
# Priority: CRITICAL

## Description
Protocolo obrigatório para garantir que nenhum segredo seja enviado ao repositório.

## Requirements
1.  **Gitignore Audit**: Antes de qualquer `git add` ou `git commit`, verifique se `.env`, `.key`, `.json` (service accounts) e `.pem` estão listados no `.gitignore`.
2.  **Explicit Exclusion**: Se arquivos de ambiente não estiverem ignorados, adicione-os imediatamente: `echo ".env*" >> .gitignore`.
3.  **Pre-Commit Check**: Verifique arquivos cacheados (`git diff --cached --name-only`) para garantir que nenhum segredo foi adicionado acidentalmente.
4.  **No Hardcoded Secrets**: Bloqueie qualquer sugestão de código que contenha chaves de API, senhas ou tokens em texto puro.

## Response Protocol
- Se detectar um arquivo `.env` sendo adicionado: **BLOQUEIE** a execução, alerte o usuário e sugira `git reset HEAD <file>`.
