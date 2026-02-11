# Accessibility Auditor Forms

## 1. Accessibility Audit Request (a11y_request.md)

### Goal
Initiate an accessibility audit for a specific page or component.

### Fields
- **Target URL/File:** [URL or Path]
- **Standard:** [WCAG 2.1 AA / Section 508]
- **Scope:** [Full Page / Specific Component]
- **Device Context:** [Desktop / Mobile]

## 2. Accessibility Audit Report (a11y_report.md)

### Goal
Document the findings of an accessibility audit.

### Fields
- **Target:** [URL/File]
- **Date:** [Date of audit]
- **Compliance Score:** [Score if available]
- **Violations:**
    - **Issue 1:**
        - **Description:** [Description]
        - **Impact:** [Critical/Serious/Minor]
        - **WCAG Criteria:** [e.g., 1.1.1 Non-text Content]
        - **Element:** [Code snippet]
        - **Fix:** [Recommendation]
    - **Issue 2:** ...
