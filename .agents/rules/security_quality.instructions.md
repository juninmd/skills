---
name: security-quality
description: Strict security and code quality guidelines.
applyTo: '**/*.{py,js,ts,tsx,go,java,kt}'
---

# Rule: Security & Quality Guidelines

## Guidelines
| Item | Strict Rule |
| :--- | :--- |
| **Authentication** | All endpoints (except `/healthcheck`) require Basic Auth (DEV/HML) or OAuth. |
| **Logs** | Use standard `logging` (Python). Minimum `ERROR` level. **PII logging is forbidden**. |
| **Coverage** | Minimum **90%**. PR must fail below threshold. |
| **Docstrings** | Mandatory for all public functions/classes (Google Style). |
| **OWASP Prevention** | Validate user input (SQLi, XSS, CSRF), use prepared statements, and apply proper HTML escaping. |

## SonarQube
- Follow quality metrics defined in `sonar-project.properties`.
- **Never** change `sonar.projectKey` without explicit Tech Lead approval.

## Android Deployment
- APK builds must be performed **LOCALLY**.
- **USB Detection**: if a USB device is connected, installation via `adb` may be automated when explicitly requested.
- **Self-Healing**: monitor ADB logs and address runtime failures systematically.

## Anti-Patterns (Forbidden)
- **Never** reduce test coverage just to pass pipeline checks.
- **Never** use hardcoded IPs; use environment variables or internal DNS.
- **Never** log PII (for example CPF, email, phone, address) at any log level.

