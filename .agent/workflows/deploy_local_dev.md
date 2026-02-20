---
name: deploy-local-dev
description: Workflow para deploy e testes em ambiente local de desenvolvimento.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Workflow: Deploy Local (DEV)
# Id: deploy_local_dev

**GATILHO:** Quando solicitado "deploy local", "testar Dev", "Rode local" ou "run local".

## Protocolo
1. **Commit & Push**:
    - Realizar `git add .`.
    - Criar commit convencional descritivo.
2. **Deploy**:
    - Atualizar ambiente local Docker e subir a nova versão.
    - Se houver alteração no código Android, gerar novo APK na raiz.
    - Se houver Android conectado via USB, instalar o APK.
3. **Monitoramento**:
    - Avaliar logs do backend e frontend.
    - Corrigir erros imediatamente.
4. **Auto-Correção (Self-Healing)**:
    - **Se SUCESSO**: Notificar o usuário.
    - **Se FALHA**:
      - Ler logs.
      - Corrigir código localmente.
      - Realizar novo commit (`fix: ...`) e push.
      - Reiniciar monitoramento (Máx 3 tentativas).
