# Accessibility Auditor Referência 📚
## Tools

### 1. `axe-core` / `axe-cli`
**Description:** The world's leading accessibility testing engine.
**Comandos Comuns:**
- `axe http://example.com`: Run an audit on a URL.
- `axe --tags wcag2a`: Run checks for WCAG 2.0 Level A.

### 2. `pa11y`
**Description:** Automated accessibility testing tool.
**Comandos Comuns:**
- `pa11y http://example.com`: Run a standard test.
- `pa11y --standard WCAG2AA http://example.com`: Test against WCAG 2.1 AA.

### 3. `Lighthouse` (via Chrome/CLI)
**Description:** Open-source, automated tool for improving the quality of web pages, including accessibility.
**Comandos Comuns:**
- `lighthouse http://example.com --only-categories=accessibility`: Run only accessibility checks.

