# shadcn/ui: Architecture & Customization

## File Structure
- `src/components/ui/`: Standard shadcn components.
- `src/lib/utils.ts`: The `cn()` helper location.

## The `cn()` Utility
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Customization
- **Theme:** Edit CSS variables in `app/globals.css`.
- **Variants:** Use `class-variance-authority` (cva).
- **Extension:** Create wrapper components in `components/` (outside `ui/`).
