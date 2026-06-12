---
name: frontend-engineering
description: "Comprehensive Frontend Engineering covering React, Next.js, Vite, shadcn/ui, Accessibility, and UI/UX Design patterns."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "React, Next.js, Browser, Tailwind CSS"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Frontend Engineering

Expert methodology for architecting and developing production-grade web interfaces. This skill unifies best practices for modern React, Next.js, Vite build tooling, accessible UI component design (shadcn/ui), and frontend craftsmanship.

**USE FOR:**
- Architecting and developing applications with React 19+ and Next.js (App Router, RSC).
- Configuring and optimizing builds with Vite and Rolldown.
- Implementing UI component libraries using shadcn/ui and Radix.
- Hardening UI accessibility (A11y), keyboard navigation, and ARIA support.
- Applying distinctive, polished UI designs and optimizing runtime performance.
- Managing client/server component boundaries and state.

**DO NOT USE FOR:**
- Backend business logic or database migrations (use `backend-node` or `data-engineering`).
- Native mobile app development (use `mobile-engineering`).

**INVOKES:**
- `react`, `next`, `vite`, `npx shadcn@latest`, `tailwind`, accessibility tools.

## Core Principles
1. **Product First:** Polish must support, not break, the primary user task.
2. **Accessible by Design:** A11y is a core requirement, second only to functionality. Leverage Radix for complex primitives.
3. **Runtime Quality:** Minimize waterfalls, hydration mismatches, and layout shifts.
4. **Server-First Execution:** Maximize use of React Server Components; keep client components thin and interactive.
5. **Purity in Styling:** Zero runtime overhead via build-time CSS (Tailwind v4 / CSS modules).

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [React & Next.js Architecture](references/react-nextjs-arch.md)
- [Vite Build & Tooling](references/vite-tooling.md)
- [UI Components & shadcn/ui](references/ui-components.md)
- [Accessibility & Craftsmanship](references/accessibility-craftsmanship.md)

## Checklist
- [ ] Define the visual direction, component boundary, and state model before coding.
- [ ] Verify accessibility (focus, contrast, ARIA) and responsive layout.
- [ ] Minimize client-side code crossing the RSC boundary.
- [ ] Test HMR and build performance if touching configuration.
