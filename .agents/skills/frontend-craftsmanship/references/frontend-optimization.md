# React and Next.js Optimization Patterns

Best practices for performance, bundle size, and data flow.

## 1. Boundary Strategy
- **RSC First:** Default to Server Components; use `"use client"` only for interactivity or browser APIs.
- **Data Fetching:** Prefer RSC/loaders over `useEffect`. Start independent promises early.
- **Serialization:** Minimize props crossing the RSC boundary.

## 2. Rendering Efficiency
- **State Location:** Keep UI state local. Avoid business logic in UI stores.
- **Hoisting:** Move static JSX, regexes, and large objects out of render paths.
- **Memoization:** Use `useMemo`/`useCallback` only for verified render pressure or stable identities.
- **Non-Urgent Updates:** Use `startTransition` or `useDeferredValue` for non-blocking UI changes.

## 3. Bundle Optimization
- **Direct Imports:** Avoid barrel imports if they inflate bundles.
- **Dynamic Imports:** Lazy load heavy or below-the-fold client components.
- **Validation:** Use project-standard schemas (e.g., Zod) at the application boundary.
