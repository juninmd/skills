# Tailwind CSS v4 with Vite

Detailed guidelines for the CSS-first configuration and OKLCH color system.

## 1. Quick Setup
```bash
npm install tailwindcss @tailwindcss/vite
```
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss()] })
```

## 2. CSS-First Config (@theme)
Tailwind v4 removes `tailwind.config.js`. Use CSS variables in your entry file:
```css
@import "tailwindcss";
@theme {
  --color-primary: #3b82f6;
  --font-display: 'Geist', sans-serif;
}
```

## 3. OKLCH Color Functions
Utilize perceptual color harmony:
- `bg-primary: oklch(70% 0.15 250 / 80%);`
- `text-accent: oklch(65% 0.25 30);`

## 4. Arbitrary Values
Use brackets directly in classes: `class="h-[calc(100vh-4rem)]"`.
