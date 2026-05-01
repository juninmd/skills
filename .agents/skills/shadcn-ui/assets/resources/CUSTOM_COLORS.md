# shadcn/ui: Colors & Dark Mode

## HSL Format
`hue saturation lightness` (e.g., `221.2 83.2% 53.3%`).
Update `--primary` to match your brand.

## Dark Mode Setup (Next.js)
```bash
npm install next-themes
```

```tsx
// app/providers.tsx
import { ThemeProvider } from "next-themes"
export function Providers({ children }) {
  return <ThemeProvider attribute="class" defaultTheme="system">{children}</ThemeProvider>
}
```

## Theme Toggle
Use `useTheme()` from `next-themes` to toggle the `class` on the `html` element.
