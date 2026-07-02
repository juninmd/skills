---
name: managing-security
description: Ability to perform security-related tasks such as vulnerability scanning, security audits, and implementation of best practices. Use when conducting security reviews, hunting for vulnerabilities, or implementing secure coding practices.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Security

## When to Use
- When executing security audits or vulnerability scanning.
- When reviewing code for security flaws.
- When implementing controls and security best practices.
- When ensuring compliance with security standards.

## Instructions
1.  **Dependency Scanning (SCA):** Check for vulnerabilities in libraries.
    *   **Node.js:** `npm audit` or `pnpm audit`.
    *   **Python:** `uv pip audit` or `pip-audit`.
    *   **Containers:** `trivy image <image>`.
2.  **Static Analysis (SAST):** Find security bugs in source code.
    *   **Tool:** Use `semgrep` or `sonar-scanner` to search for insecure patterns (SQL Injection, XSS).
    *   **Command:** `semgrep --config=p/security-audit .`
3.  **Secret Detection:** Never commit credentials.
    *   **Pre-commit:** Use `gitleaks detect` or `git-secrets` before pushing code.
    *   **Remediation:** If leaked, rotate the credential immediately.
4.  **Container Security:** Validate Dockerfiles and images.
    *   **Linting:** `hadolint Dockerfile`.
    *   **Scanning:** `trivy fs .` (file system) or `trivy image` (final).

## Examples
- "Run `trivy image my-app:latest` to check for CVEs."
- "Audit dependencies with `npm audit --audit-level=high`."
- "Scan codebase for secrets using `gitleaks detect -v`."
- "Review Python code for security flaws with `bandit -r .`."

## Resources
- **OWASP Top 10:** Reference for common web risks.
- **Principle of Least Privilege:** Ensure containers and processes run with minimal permissions.
- **Regular Updates:** Keep dependencies updated to fix known CVEs.
