---
name: auditing-accessibility
description: Web accessibility (A11y) auditing using automated tools and manual verification for WCAG 2.1 AA compliance.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Accessibility Auditor

This skill ensures that web interfaces are usable by people with disabilities, following the WCAG 2.1 Level AA standard.

## Instructions
1.  **Automated Scanning:** Use tools like `lighthouse-cli` or `pa11y` for an initial scan.
    *   **Rationale:** Automated tools detect ~30-50% of common issues (contrast, missing labels).
    *   **Validation:** The accessibility score must be >= 95.
2.  **Interactive Elements:** Check ALL interactive elements (buttons, inputs).
    *   **Keyboard Testing:** Everything must be operable using only the keyboard (Tab, Enter, Space).
    *   **Focus Verification:** Focus must be visible (`outline` or custom style).
3.  **Semantic Structure:** Use headings (`h1`-`h6`) logically, landmarks (`main`, `nav`, `aside`), and lists (`ul`, `ol`).
    *   **No Div-Soup:** Avoid `<div onClick="...">` for buttons. Use `<button>`.

## Common Tasks
*   **Run Lighthouse:** `lighthouse <url> --view` (Generates HTML report).
*   **Run Pa11y:** `pa11y <url>` (Tests against WCAG2AA).
*   **Verify Contrast:** Use extensions or online tools to ensure a 4.5:1 ratio (normal text) or 3:1 (large text).

## Examples
### Valid vs. Invalid Button Example
**Invalid (Div-based):**
```html
<div class="btn" onclick="submit()">Send</div> <!-- Inaccessible via keyboard, no role -->
```

**Valid (Native):**
```html
<button type="submit" class="btn">Send</button> <!-- Accessible, focusable, enter/space support -->
```

### Image Alternative Text
**Invalid:** `<img src="logo.png" />` (Screen reader reads the filename).
**Valid:** `<img src="logo.png" alt="Company Logo" />` (Descriptive).
**Valid (Decorative):** `<img src="bg-pattern.png" alt="" />` (Ignored by the reader).

## Resources
- **WCAG Checklist:** Consult the official or simplified checklist (A11y Project).
- **WAI-ARIA:** Use `aria-label`, `aria-expanded`, etc., ONLY when native HTML is not sufficient.

