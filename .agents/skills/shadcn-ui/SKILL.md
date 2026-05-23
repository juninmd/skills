---
name: shadcn-ui
description: |
  **FRONTEND SKILL** - Build accessible React UIs using shadcn/ui and Radix.
  USE FOR: shadcn/ui init, adding components, customization, Radix UI, Tailwind merging (cn), theme config.
  DO NOT USE FOR: traditional npm libraries, non-React frameworks, legacy CSS-in-JS.
  INVOKES: npx shadcn cli, radix-ui.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "React, Next.js, Tailwind CSS"
allowed-tools: [run_shell_command, read_file, write_file, replace]
---

# shadcn/ui Integration

Expert methodology for building accessible web interfaces by composing Radix UI primitives with Tailwind CSS via the shadcn/ui CLI.

**USE FOR:**
- Bootstrapping component libraries with `shadcn init`.
- Adding UI components (Dialog, Sheet, Table) directly.
- Customizing component logic and styling in-repo.
- Implementing dark mode and themes via CSS variables.
- Using the `cn()` helper for Tailwind merging.

**INVOKES:**
- `npx shadcn@latest`, `lucide-react`, `tailwind-merge`.

## Methodology
Details are documented in:
1. [Installation](references/GUIDE_INSTALLATION.md) | [Architecture](references/GUIDE_ARCHITECTURE.md)
2. [Blocks & A11y](references/GUIDE_BLOCKS_A11Y.md) | [Best Practices](references/BEST_PRACTICES.md)
3. [Available Components](references/AVAILABLE_COMPONENTS.md)

## Principles
1. **Ownership:** Generated code is part of the project; refactor freely.
2. **Accessibility:** Leverage Radix for keyboard and ARIA support.
3. **Purity:** Zero runtime overhead via build-time Tailwind.

## Checklist
- [ ] Confirm project stack before initialization.
- [ ] Align generated code with local coding standards.
- [ ] Validate theme support and responsiveness.
- [ ] Verify keyboard navigation for complex primitives.
