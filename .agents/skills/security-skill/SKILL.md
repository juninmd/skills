---
name: security-skill
description: This skill enables the agent to perform security-related tasks, such as vulnerability scanning, security audits, and implementing security best practices. Use this when conducting security reviews, scanning for vulnerabilities, or implementing secure coding practices.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Security

## When to Use
- When performing security audits or vulnerability scans
- When reviewing code for security issues
- When implementing security controls or best practices
- When ensuring compliance with security standards

## Instructions
1.  **Dependency Scanning (SCA):** Verifique vulnerabilidades em bibliotecas.
    *   **Node.js:** `npm audit` ou `pnpm audit`.
    *   **Python:** `uv pip audit` ou `pip-audit`.
    *   **Containers:** `trivy image <image>`.
2.  **Static Analysis (SAST):** Encontre bugs de segurança no código fonte.
    *   **Tool:** Use `semgrep` ou `sonar-scanner` para buscar padrões inseguros (SQL Injection, XSS).
    *   **Command:** `semgrep --config=p/security-audit .`
3.  **Secret Detection:** Nunca commite credenciais.
    *   **Pre-commit:** Use `gitleaks detect` ou `git-secrets` antes de enviar código.
    *   **Remediation:** Se vazar, rotacione a credencial imediatamente.
4.  **Container Security:** Valide Dockerfiles e imagens.
    *   **Linting:** `hadolint Dockerfile`.
    *   **Scanning:** `trivy fs .` (sistema de arquivos) ou `trivy image` (final).

## Examples
- "Run `trivy image my-app:latest` to check for CVEs."
- "Audit dependencies with `npm audit --audit-level=high`."
- "Scan codebase for secrets using `gitleaks detect -v`."
- "Review Python code for security flaws with `bandit -r .`."

## Resources
- **OWASP Top 10:** Referência para riscos web comuns.
- **Principle of Least Privilege:** Garanta que containers e processos rodem com permissões mínimas.
- **Regular Updates:** Mantenha dependências atualizadas para corrigir CVEs conhecidos.