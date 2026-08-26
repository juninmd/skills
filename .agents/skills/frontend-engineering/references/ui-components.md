# UI Components: Stack, Flow, and Composition

Consolidated guidance for building reusable web components. Replaces the former `ui-flow.md`, `ui-best-practices.md`, `ui-design-guidelines.md`, and the shadcn `BEST_PRACTICES.md`.

Accessibility rules are not repeated here — use the `accessibility` skill. Runtime and bundle cost belong to `web-performance`. Visual system decisions (type scale, palette, motion durations) belong to `frontend-design`.

## 1. Stack Selection
- Preserve the repository framework, bundler, styling system, package manager, and test runner.
- For a new project, verify maintained versions and choose the smallest stack that meets the browser and deployment requirements.
- Add a component catalog or design-system tooling only when multiple consumers justify it.

## 2. Component Development Flow
1. **Requirements** — review the spec for every state (hover, active, disabled, loading, empty, error, selected, optimistic) and the constraints the component must survive (viewport sizes, the workflows and screens it appears in). Define the props contract before writing markup.
2. **Implementation** — semantic HTML first, responsive styles, interaction logic in hooks, strict separation between rendering and orchestration.
3. **Validation** — unit and interaction tests (Vitest/Testing Library), visual check in Storybook where the repo has one, keyboard pass.
4. **Documentation** — document props and give a usage example per meaningful state.

## 3. Core Principles
- **Atomic composition:** build atoms before molecules and organisms; prefer composition over deep prop drilling.
- **Thin components:** business logic lives in `domain/`, services, or hooks — never inline in a component.
- **Isolation:** components are self-contained and free of module-level side effects.
- **Naming:** kebab-case files, `PascalCase` components, `use*` hooks.
- **Props:** strict TypeScript interfaces for every component contract. No `any`, no untyped spread onto DOM nodes.

## 4. Styling
- No inline `style={{ ... }}` blocks. Use the repository's system: utility classes, CSS Modules, or CSS-in-JS — one of them, not three.
- Responsive by default: relative units (`rem`, `em`, `ch`) and mobile-first breakpoints.
- Consume design tokens (custom properties or theme config); do not hard-code hex values or magic pixel numbers in components.
- Domain-appropriate visual cues over decorative-only elements.

## 5. shadcn/ui
- Do not modify files under `components/ui/` directly — wrap them.
- Compose, do not fork. Extend through props and slots.
- Use the CLI (`npx shadcn add <component>`); it resolves Radix peer dependencies for you.
- Merge classes with the `cn()` utility so consumer overrides win.

### shadcn troubleshooting
- **Module not found** — check the `@/*` path alias in `tsconfig.json` and the `aliases` block in `components.json`.
- **Styles not applying** — confirm `globals.css` is imported at the root and that the Tailwind content/source globs cover the component directory.
- **Type errors after add** — install the Radix peer dependencies and confirm the `@types/react` major matches the installed React.
