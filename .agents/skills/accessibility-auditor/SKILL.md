---
name: accessibility-auditor
description: This skill enables the agent to evaluate web applications for accessibility (a11y) compliance, ensuring they are usable by people with disabilities.
---

# Accessibility Auditor

## Instructions
- Run automated accessibility scanning tools (e.g., Axe, Lighthouse) on target URLs or local files.
- Detect common violations such as low contrast, missing alt text, and improper ARIA labels.
- Manually inspect complex interactions that automated tools might miss (e.g., keyboard navigation trap).
- Verify screen reader compatibility (e.g., using NVDA or VoiceOver simulators).
- Categorize violations by severity (Critical, Serious, Moderate, Minor).
- Map violations to specific WCAG success criteria (e.g., 1.4.3 Contrast).
- Provide code snippets or design adjustments to fix identified issues.
- Re-scan to verify that the fixes work.

## Resources
- **Semantic HTML:** Prioritize standard HTML elements over custom ARIA implementations.
- **Keyboard Access:** Ensure all interactive elements can be reached and activated using a keyboard.
- **Contrast Ratios:** Maintain sufficient color contrast for text and interactive components.
