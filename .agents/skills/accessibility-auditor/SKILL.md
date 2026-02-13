---
name: accessibility-auditor
description: Auditoria de acessibilidade web (A11y) usando ferramentas automatizadas e verificação manual para conformidade WCAG 2.1 AA.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Accessibility Auditor

Esta skill garante que interfaces web sejam utilizáveis por pessoas com deficiência, seguindo o padrão WCAG 2.1 Nível AA.

## Instructions
1.  **Automated Scan:** Utilize ferramentas como `lighthouse-cli` ou `pa11y` para uma varredura inicial.
    *   **Reasoning:** Ferramentas automáticas detectam ~30-50% dos problemas comuns (contraste, labels faltantes).
    *   **Verification:** O score de acessibilidade deve ser >= 95.
2.  **Interactive Elements:** Verifique TODOS os elementos interativos (botões, inputs).
    *   **Keyboard Test:** Tudo deve ser operável apenas com teclado (Tab, Enter, Space).
    *   **Focus Check:** O foco deve ser visível (`outline` ou estilo customizado).
3.  **Semantic Structure:** Use headings (`h1`-`h6`) logicamente, landmarks (`main`, `nav`, `aside`) e listas (`ul`, `ol`).
    *   **No Div-Soup:** Evite `<div onClick="...">` para botões. Use `<button>`.

## Common Tasks
*   **Run Lighthouse:** `lighthouse <url> --view` (Gera report HTML).
*   **Run Pa11y:** `pa11y <url>` (Testa contra WCAG2AA).
*   **Check Contrast:** Use extensões ou ferramentas online para garantir ratio 4.5:1 (texto normal) ou 3:1 (texto grande).

## Examples
### Valid vs Invalid Button
**Invalid (Div-based):**
```html
<div class="btn" onclick="submit()">Enviar</div> <!-- Inacessível via teclado, sem role -->
```

**Valid (Native):**
```html
<button type="submit" class="btn">Enviar</button> <!-- Acessível, focusable, enter/space support -->
```

### Image Alt Text
**Invalid:** `<img src="logo.png" />` (Leitor de tela lê o nome do arquivo).
**Valid:** `<img src="logo.png" alt="Logotipo da Empresa" />` (Descritivo).
**Valid (Decorative):** `<img src="bg-pattern.png" alt="" />` (Ignorado pelo leitor).

## Resources
- **WCAG Checklist:** Consulte a checklist oficial ou simplificada (A11y Project).
- **WAI-ARIA:** Use `aria-label`, `aria-expanded`, etc., SOMENTE quando HTML nativo não for suficiente.
