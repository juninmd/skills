# shadcn/ui: Design Systems & Tokens

## Structure
Organize your customizations for scale:
```text
src/
├── styles/
│   ├── globals.css      # CSS variables
│   └── themes/          # Brand-specific overrides
├── lib/
│   └── design-tokens.ts # Shared constants (colors, spacing)
└── components/
    └── custom/          # Your wrapper logic
```

## Design Tokens File
Store shared values in a TypeScript object:
```typescript
export const designTokens = {
  radius: { card: '1rem', button: '0.5rem' },
  typography: { h1: 'text-5xl font-bold' },
} as const
```
Use as classes: `<h1 className={designTokens.typography.h1}>...</h1>`.
