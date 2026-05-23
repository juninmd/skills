---
name: frontend-craftsmanship
description: |
  **FRONTEND SKILL** - Build fast, accessible, and visually intentional web UIs.
  USE FOR: React/Next.js implementation, performance optimization (RSC/RCL), web accessibility (a11y), visual hierarchy, design system surfaces, dashboard UI, landing pages.
  DO NOT USE FOR: backend business logic, native mobile apps (use developing-react-native), heavy data science, DevOps configuration.
  INVOKES: react, nextjs, tailwind, accessibility audits, performance profiling.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "React, Next.js, Browser"
allowed-tools: [read_file, write_file, replace]
---

# Frontend Craftsmanship

Expert methodology for producing production-grade web interfaces that balance product fit, interface quality, and runtime performance.

**USE FOR:**
- Architecting React/Next.js data flow and component boundaries.
- Hardening UI accessibility and keyboard navigation.
- Optimizing render performance and minimizing bundle sizes.
- Implementing distinctive, polished UI designs following domain-specific cues.
- Auditing existing frontend codebases for quality and compliance.

**DO NOT USE FOR:**
- Generic application logic unrelated to the interface.
- Low-level infrastructure or server-side only tasks.

**INVOKES:**
- `next`, `react`, `zod`, `tailwind`, `playwright` tools.

## Methodology and Guidelines
Implementation details for design, optimization, and review are documented in:
1. [UI Design & Composition](references/ui-design-guidelines.md)
2. [React & Next.js Optimization](references/frontend-optimization.md)
3. [Frontend Review & Validation](references/frontend-review.md)

## Core Principles
1. **Product First:** Polish must support, not break, the primary task.
2. **Accessible by Design:** A11y is a core requirement, second only to functionality.
3. **Runtime Quality:** Minimize waterfalls, hydration mismatches, and layout shifts.

## Checklist
- [ ] Define explicit visual direction and state model before implementation.
- [ ] Minimize client-side code crossing the RSC boundary.
- [ ] Verify accessibility (focus, contrast, ARIA) and responsive layout.
- [ ] Run targeted smoke tests for the updated user workflow.
