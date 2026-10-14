# Frontend UI Component and Utility Selection

Open when selecting vetted, high-quality libraries for frontend tasks (dialogs, toasts, OTP inputs, command menus, charts, virtualization, drag-and-drop, state, motion).

## Contents

- Evaluation Rules Before Adding Dependencies
- Component Primitives and Specialized Inputs
- Motion and Visual Effects
- Data Visualization and Streaming Charts
- Performance, Virtualization, and Interaction
- Styling and State Primitives
- Common Architecture Mismatches

## Evaluation Rules Before Adding Dependencies

1. **Verify Existing Dependencies:** Inspect `package.json` before introducing any new package. Do not install a competitor if an established equivalent is already wired in.
2. **Single-Purpose Utility over Monolithic Bundles:** Prefer focused, headless, accessible primitives over heavy, pre-styled frameworks that resist brand customization.
3. **Targeted Recommendations:** Recommend one specific library that fits the technical requirements with a one-sentence rationale, rather than dumping unstructured lists.

## Component Primitives and Specialized Inputs

| Task | Recommended Package | Rationale |
|---|---|---|
| Headless, accessible primitives (dialogs, popovers, menus, selects) | [base-ui](https://base-ui.com) | Full accessibility, keyboard focus trap, robust portal rendering |
| Command palettes (⌘K modal search) | [cmdk](https://cmdk.paco.me) | Fast filtering, accessible keyboard navigation, unstyled |
| Notification toasts | [Sonner](https://sonner.emilkowal.ski) | Swipe dismissal, stacked expansion, promise states, minimal bundle |
| One-time password (OTP) verification inputs | [input-otp](https://input-otp.rodz.dev) | Native mobile keyboard support, automatic paste handling, accessible |
| Parameter control panels / runtime debug GUI | [Leva](https://github.com/pmndrs/leva) | Zero-boilerplate property tweaking for Canvas, 3D, and animations |

## Motion and Visual Effects

| Task | Recommended Package | Selection Boundary |
|---|---|---|
| General layout, springs, gestures, enter/exit | [motion](https://motion.dev) | Use when layout animations or physics springs are required; use plain CSS transitions for simple hover/opacity fades |
| Animated numerical counters / stats | [NumberFlow](https://number-flow.barvian.me) | Handles digit roll transitions with localized formatting and layout stability |
| Kinetic typography / text effects | [torph](https://torph.lochie.me/) | Targeted letter-by-letter transforms |
| Interactive 3D lightweight globes | [Cobe](https://cobe.vercel.app) | 5KB WebGL canvas globe with no three.js overhead |
| Dynamic Open Graph (OG) image generation | [Satori](https://github.com/vercel/satori) | Converts HTML/CSS to SVG for serverless edge rendering |
| Syntax highlighting | [shiki](https://shiki.style) | TextMate grammar-based highlighting matching VS Code output |

## Data Visualization and Streaming Charts

| Scenario | Recommended Package | Boundary |
|---|---|---|
| Streaming / real-time time-series | [Liveline](https://github.com/benjitaylor/liveline) | Dedicated to live appending data streams with continuous scroll |
| Standard application dashboards | [recharts](https://recharts.org) | Declarative React SVG charts for general analytics and metrics |

## Performance, Virtualization, and Interaction

| Task | Recommended Package | Rationale |
|---|---|---|
| Drag and drop (lists, boards, grids) | [dnd kit](https://dndkit.com) | Accessible, lightweight, modular collision detection, pointer/keyboard sensors |
| Large list / table virtualization | [Virtuoso](https://virtuoso.dev) | Dynamic item height handling without fixed height calculations |

## Styling and State Primitives

| Task | Recommended Package | Usage Guideline |
|---|---|---|
| Application state management | [zustand](https://zustand.docs.pmnd.rs) | Minimal boilerplate, unopinionated outside-React access, hooks-based |
| Conditional class string concatenation | [clsx](https://github.com/lukeed/clsx) | Ad-hoc class composition with conditional booleans |
| Typed variant styling | [cva](https://cva.style) | Structured component variants (intent, size, state) mapped to Tailwind classes |
| Theme switching (dark mode) | [next-themes](https://github.com/pacocoursey/next-themes) | Prevents theme flashing across SSR and client hydrates |

## Common Architecture Mismatches

- **Home-rolled toast containers:** Re-inventing toast stacking, portal mounting, and timeout cancellations introduces edge-case race conditions. Use Sonner.
- **Div-based modal overlays:** Omitting ARIA dialog roles, focus management, and escape key listener traps causes accessibility failures. Use base-ui primitives.
- **Rendering 500+ DOM nodes synchronously:** Leads to input lag and memory bloat. Virtualize with Virtuoso before attempting complex pagination workarounds.
- **Deeply nested class string ternaries:** Unmaintainable string interpolations should be refactored into `cva` variant tables.
