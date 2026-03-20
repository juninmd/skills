---
name: security-quality
description: Diretrizes estritas de segurança e qualidade de código.
applyTo: '**/*.{py,js,ts,tsx}'
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Security & Quality Guidelines

## Diretrizes
| Item | Regra Estrita |
| :--- | :--- |
| **Autenticação** | Todos os endpoints (exceto `/healthcheck`) exigem Basic Auth (DEV/HML) ou OAuth. |
| **Logs** | Padrão `logging` (Python). Nível `ERROR`. **PROIBIDO logar PII (Dados Pessoais)**. |
| **Cobertura** | Mínimo **90%**. O PR falha se for menor. |
| **Docstrings** | Obrigatório em todas as funções/classes públicas (Google Style). |
| **Prevenção OWASP** | Tratar inputs de usuário (SQLi, XSS, CSRF), usar prepared statements e escapes de HTML. |

## SonarQube
- Seguir as métricas de qualidade definidas no `sonar.properties`.
- **Nunca** alterar o `sonar.projectKey` sem autorização explícita do TechLead.

## Android Deployment
- O build do APK deve ser realizado **LOCALMENTE**.
- **USB Detection**: Se detectar dispositivo USB conectado, instale o build via `adb` automaticamente.
- **Self-Healing**: Monitorar logs via ADB e corrigir falhas de runtime automaticamente.

## Anti-Patterns (Proibições)
- **Nunca** reduzir a cobertura de testes para passar no pipeline.
- **Nunca** usar IPs hardcoded; use sempre variáveis de ambiente ou DNS interno.
- **Nunca** logar PII (CPF, e-mail, telefone, endereço) em nenhum nível de log.
