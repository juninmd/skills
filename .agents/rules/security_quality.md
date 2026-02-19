---
name: security-quality
description: Diretrizes estritas de segurança e qualidade de código.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Security & Quality Guidelines
# Id: security_quality

## Diretrizes
| Item | Regra Estrita |
| :--- | :--- |
| **Autenticação** | Todos os endpoints (exceto `/healthcheck`) exigem Basic Auth (DEV/HML) ou OAuth. |
| **Logs** | Padrão `logging` (Python). Nível `INFO`. **PROIBIDO logar PII (Dados Pessoais)**. |
| **Cobertura** | Mínimo **90%**. O PR falha se for menor. |
| **Docstrings** | Obrigatório em todas as funções/classes públicas (Google Style). |
| **Android** | Detectar ambiente local físico conectado (USB): Se detectar, instalar build via ADB automaticamente. |

## SonarQube
- Seguir as métricas de qualidade definidas no `sonar.properties`.
