# shadcn/ui: Detailed Initialization

## components.json
```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": { "components": "@/components", "utils": "@/lib" }
}
```

## lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## tailwind.config.js (Extended)
Include `tailwindcss-animate` plugin and extend theme with shadcn colors (border, input, ring, etc.) and `borderRadius` variables.
