---
name: quality-android-safety
description: Padrões de qualidade de código e deploy automatizado para Android.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Quality & Android Safety

## Android Deployment
- O build do APK deve ser realizado **LOCALMENTE**.
- **USB Detection**: Se detectar dispositivo USB conectado, instale o build via `adb` automaticamente.
- **Self-Healing**: Monitorar logs via ADB e corrigir falhas de runtime automaticamente.
