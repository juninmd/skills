---
name: quality-android-safety
description: Padrões de qualidade de código e deploy automatizado para Android.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Quality & Android Safety
# Id: quality_android_safety

## Quality Standards
1.  **Coverage**: Mínimo de **90%** em testes unitários. O PR deve falhar se abaixo.
2.  **Docstrings**: Obrigatório Google Style para todas as funções públicas.
3.  **Logs**: Proibido logar PII (Dados Pessoais). Nível padrão: `INFO`.
4.  **Files**: Use `view_file`, NUNCA `cat`.

## Android Deployment
- O build do APK deve ser realizado **LOCALMENTE**.
- **USB Detection**: Se detectar dispositivo USB conectado, instale o build via `adb` automaticamente.
- **Self-Healing**: Monitorar logs via ADB e corrigir falhas de runtime automaticamente.
