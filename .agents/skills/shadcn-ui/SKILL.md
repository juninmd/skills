---
name: shadcn-ui
description: "Component composition with Radix primitives. Triggers: radix, components."
argument-hint: "[context] [options]"
---

# shadcn/ui Integration

Senior frontend guidance for building with shadcn/ui—beautiful, accessible, and customizable components.

## Core Principles
- **Ownership:** Components live in your codebase.
- **Customization:** Full control over styling and behavior.
- **Efficiency:** Zero runtime overhead.

## Quick Start
1. **Initialize:** `npx shadcn@latest init`
2. **Add Component:** `npx shadcn@latest add [name]`
3. **Use Utility:** All components use the `cn()` helper for class merging.

## Guides
- [Discovery & Installation](references/GUIDE_INSTALLATION.md)
- [Architecture & Customization](references/GUIDE_ARCHITECTURE.md)
- [Blocks & Accessibility](references/GUIDE_BLOCKS_A11Y.md)

## Validation
- **Type check:** `tsc --noEmit`
- **Lint:** Standard project linter.
- **Visual:** Test in light/dark modes and responsive breakpoints.

## Checklist

- [ ] Confirm the project stack, styling system, and component ownership model before adding generators.
- [ ] Keep generated shadcn/ui code aligned with local conventions instead of treating it as vendor code.
- [ ] Validate accessibility, theming, and responsive behavior after integrating each component.

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
