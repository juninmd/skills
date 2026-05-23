# iOS Implementation Checklist

Standards for verifying iOS app quality and system integration.

## Layout & Typography
- [ ] Touch targets ≥ 44pt.
- [ ] Content respects safe areas and 8pt grid.
- [ ] Dynamic Type supported up to accessibility sizes without truncation.

## Colors & Accessibility
- [ ] Dark Mode is intentional and uses semantic colors.
- [ ] VoiceOver labels present on all interactive elements.
- [ ] Reading order is logical; Bold Text preference respected.

## Navigation & Privacy
- [ ] Tab bar for top-level navigation; no hamburger menus.
- [ ] Back swipe works throughout the application.
- [ ] Permissions requested in-context with custom explanation.
- [ ] ATT prompt shown if tracking; Sign in with Apple available.

## System Integration
- [ ] App handles background/interruption state gracefully.
- [ ] Share Sheet available for shareable content.
- [ ] Content indexed for Spotlight where applicable.
