# Frontend Review and Validation

Standards for auditing UI code quality and accessibility.

## 1. Validation Checklist
- **Accessibility:** Verify keyboard flow, visible focus, accessible names, and semantic HTML.
- **Layout:** Confirm no overlaps, clipped labels, or layout shifts (CLS).
- **Responsiveness:** Test mobile, tablet, and desktop breakpoints.

## 2. Review Output Format
Lead with concrete findings using severity tags:
- `path/file:line SEVERITY - Description and required fix.`

## 3. Severity Levels
- **BLOCKER:** Security flaws, broken primary workflows, hydration crashes.
- **HIGH:** User-facing defects, loading waterfalls, keyboard traps, unreadable contrast.
- **LOW:** Polish, minor a11y improvements, maintainability, local cleanup.

## 4. References
Fetch latest guidelines if needed:
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
