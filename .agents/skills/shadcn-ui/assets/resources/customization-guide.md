# shadcn/ui: Customization Guide

## Theming Approach
Uses a CSS variable-based system (HSL) in `globals.css` for colors, spacing, and design tokens.

## Color System
- `--primary`: Main brand color.
- `--primary-foreground`: Contrast text on primary.
- Update variables in `:root` for light mode and `.dark` for dark mode.

## Customization Path
- [Colors & Dark Mode](./CUSTOM_COLORS.md)
- [Component Variants (cva)](./CUSTOM_VARIANTS.md)
- [Typography & Layout](./CUSTOM_TYPOGRAPHY.md)
- [Design Systems & Tokens](./CUSTOM_SYSTEMS.md)

## Best Practices
1. **Don't modify `components/ui/` directly.** Use wrappers.
2. **Use HSL variables** for easy theme switching.
3. **Extend Tailwind** in `tailwind.config.js` instead of replacing.
