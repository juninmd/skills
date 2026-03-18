---
name: env-secrets
description: Protocolo para gerenciamento de variáveis de ambiente e proteção de informações sensíveis.
applyTo: ['**/*', '**/.*env*', '**/.gitignore']
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Environment & Secrets
# Identificador: env_secrets

## Descrição
Protocolo para gerenciamento de variáveis de ambiente e proteção de informações sensíveis.

## Práticas Detectadas
- Uso de arquivos `.env` para configurações locais.
- Referência a segredos do GCP/GitLab CI.

## Regras
1. **No Secrets in Code**: NUNCA commite arquivos `.env`, chaves `.json` de service accounts ou tokens. Estes arquivos DEVEM estar no `.gitignore`.
2. **Environment Templates**: Sempre mantenha um arquivo `.env.example` atualizado com as chaves necessárias (mas com valores vazios ou fakes).
3. **Loading Protocol**: Ao iniciar um script ou serviço, verifique se as variáveis obrigatórias estão presentes e emita um erro claro caso faltem.
4. **Secret Retrieval**: Prefira buscar segredos em runtime (ex: GCP Secret Manager) em vez de armazená-los em arquivos de texto no servidor.

## Protocolo de Segurança
1. **Gitignore Audit**: Antes de qualquer `git add` ou `git commit`, verifique se `.env`, `.key`, `.json` (service accounts) e `.pem` estão listados no `.gitignore`.
2. **Explicit Exclusion**: Se arquivos de ambiente não estiverem ignorados, adicione-os imediatamente ao `.gitignore`.
3. **Pre-Commit Check**: Verifique arquivos cacheados (`git diff --cached --name-only`) para garantir que nenhum segredo foi adicionado acidentalmente.
4. **Alerta de Variável**: Se a IA sugerir um comando `export TOKEN=...`, ela deve avisar imediatamente: "⚠️ Lembre-se de não salvar este comando no seu histórico de shell se o token for sensível".
5. **Prevenção de Commit**: Se detectar um arquivo `.env` sendo adicionado: **BLOQUEIE** a execução, alerte o usuário e sugira `git reset HEAD <file>`.
