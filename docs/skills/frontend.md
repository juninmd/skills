# Frontend Skills

Skills for web frontend development.

## `react-dev`

**Invoke:** `/react-dev`

React 19+ with modern patterns.

**Key patterns:**
- Server Components (RSC) for data fetching
- `useActionState` for form state management
- `use()` hook for promise resolution
- Component size limit: <100 lines
- No unnecessary `useEffect` — prefer RSC and server actions

**Covers:** Server vs Client component decisions, Suspense boundaries, error boundaries, concurrent features, React DevTools profiling.

---

## `nextjs-dev`

**Invoke:** `/nextjs-dev`

Next.js 15+ with App Router.

**Breaking changes in Next.js 15:**
- `cookies()`, `headers()`, `params`, `searchParams` are now async — must be awaited
- Fetch is uncached by default
- Turbopack is stable and preferred over Webpack

**Covers:** App Router structure, Server Actions, route handlers, middleware, image optimization, ISR/SSG/SSR selection, deployment on Vercel.

---

## `shadcn-ui`

**Invoke:** `/shadcn-ui`

Building with shadcn/ui components.

**Covers:** component discovery via `npx shadcn@latest add`, customization via `cn()` utility, Radix UI primitives, theming with CSS variables, accessibility built-in, dark mode setup.

---

## `vite`

**Invoke:** `/vite`

Vite 8 with Tailwind CSS v4.

**What changed in Tailwind v4:**
- CSS-first configuration (no more `tailwind.config.js`)
- `@import "tailwindcss"` in CSS
- Lightning CSS engine
- Container queries built-in

**Covers:** Vite plugin configuration, HMR, build optimization, library mode, proxy configuration.

---

## `vitepress`

**Invoke:** `/vitepress`

VitePress documentation sites.

**Covers:** config setup, theme customization, sidebar and nav generation, Markdown extensions (containers, code groups), Vue component integration, search configuration, deployment.

---

## `frontend-design`

**Invoke:** `/frontend-design`

Production-grade distinctive UI interfaces.

**Covers:** design system fundamentals, responsive layouts, typography scales, color systems, micro-interactions, loading states, skeleton screens, error states, empty states.

---

## `frontend-craftsmanship`

**Invoke:** `/frontend-craftsmanship`

Production frontend implementation and review across visual quality, React/Next.js performance, accessibility, and web interface guidelines.

**Covers:** product-fit UI contracts, Server Component boundaries, waterfall and bundle reduction, render optimization, responsive polish, keyboard/focus validation, and UI review findings.

---

## `developing-ui-ux-components`

**Invoke:** `/developing-ui-ux-components`

Reusable accessible UI components.

**Covers:** compound component pattern, controlled vs uncontrolled components, ARIA attributes, keyboard navigation, focus management, CSS custom properties for theming.
