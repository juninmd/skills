---
name: deploy-hml
description: Workflow para deploy automatizado e testes em ambiente de homologação (HML).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Workflow: Deploy HML (CI/CD)
# Id: deploy_hml

**GATILHO:** Quando solicitado "deploy Hml", "deploy Homologação", "Faça uma release" ou "Execute o CI/CD".

## Protocolo
1. **Pré-requisito**: Verificar se `$GITLAB_TOKEN` está definido.
2. **Commit & Push**:
    - Realizar `git add .`.
    - Criar commit convencional descritivo.
    - Realizar `git push` autenticado.
    - **CRÍTICO**: Capturar o **Commit SHA**.
3. **Monitoramento**:
    - Identificar o Pipeline no GitLab associado ao SHA.
    - Monitorar status até `Success` ou `Failed`.
4. **Auto-Correção (Self-Healing)**:
    - **Se SUCESSO**: Notificar o usuário.
    - **Se FALHA**:
      - Ler logs do job falho.
      - Corrigir código localmente.
      - Realizar novo commit (`fix: ...`) e push.
      - Reiniciar monitoramento (Máx 3 tentativas).
