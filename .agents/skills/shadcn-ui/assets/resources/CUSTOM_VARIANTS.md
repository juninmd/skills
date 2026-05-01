# shadcn/ui: Component Variants (cva)

## class-variance-authority (cva)
All components use `cva` to define variant logic.

## Adding Custom Variants
Edit the component file in `components/ui/` (e.g., `button.tsx`):
```typescript
const buttonVariants = cva("...", {
  variants: {
    variant: {
      default: "...",
      success: "bg-green-600 text-white hover:bg-green-700",
    },
    size: {
      default: "...",
      xl: "h-12 px-10 text-base",
    },
  },
})
```

## Wrapper Components
For complex behavior, create a new component in `components/` that wraps the `ui/` component.
