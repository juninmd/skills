# Motion Audit and Remediation

Workflow for auditing UI motion across an application, identifying opportunities and performance bottlenecks, and authoring remediation plans.

## Contents
- Audit Phase 1: Codebase Inventory
- Audit Phase 2: Finding High-Impact Opportunities
- Audit Phase 3: Diagnosing Over-Animation and Jank
- Motion Quality Rubric
- Remediation Plan Template

## Audit Phase 1: Codebase Inventory

Sweep the repository for existing animation configurations and libraries:

1. **Package Scan:** Search `package.json` for `framer-motion`, `motion`, `gsap`, `animejs`, `@react-spring/web`, or Tailwind animation plugins.
2. **CSS Inspection:** Search styles for global `transition: all`, keyframe declarations, or `animate-*` classes.
3. **Reduced Motion Check:** Check if `@media (prefers-reduced-motion)` is implemented globally or in custom hooks.

```bash
# Locate blanket transitions and layout property animations
rg -n "transition:\s*all" src/
rg -n "transition:.*(height|width|top|left|margin|padding)" src/
```

## Audit Phase 2: Finding High-Impact Opportunities

Locate UI surfaces that suffer from abrupt popping, lack of continuity, or jarring state shifts:

| Opportunity Area | Symptom | High-Craft Treatment |
|---|---|---|
| **Tab Swapping** | Active indicator instantly jumps or flickers between tabs. | Add a shared layout indicator (`layoutId` or CSS translation) sliding underneath active tab. |
| **List Filtering** | Cards instantly disappear or snap into new grid slots. | Animate list item exit with slight scale-down (`0.95`) and opacity fade; animate sibling reflow. |
| **Drawer / Sheet Reveal** | Modal pops in without spatial orientation. | Slide in from screen edge using physics spring; dim backdrop simultaneously. |
| **Button State Transition** | Button text abruptly swaps to "Saved" or "Loading". | Cross-fade contents smoothly within a fixed or smoothly expanding container boundary. |
| **Collapsible Sections** | FAQs or accordions jump open instantly. | Transition CSS Grid rows (`0fr -> 1fr`) to reveal content with zero layout shifts. |

## Audit Phase 3: Diagnosing Over-Animation and Jank

Identify motion that impedes user velocity or degrades rendering performance:

- **Sluggish Timers:** Any transition taking longer than 350ms for basic navigation or feedback.
- **Excessive Bounce:** Spring animations oscillating more than once or twice for utilitarian components (inputs, modals).
- **Uncapped Stagger:** Long lists (>10 items) where each item has an incremented delay, forcing the user to wait seconds to see the bottom of the list.
- **Forced Synchronous Layouts:** JavaScript animations measuring DOM dimensions on every tick.

## Motion Quality Rubric

Score candidate components from 1 (poor) to 5 (excellent) across five dimensions:

| Dimension | Standard |
|---|---|
| **Purpose** | Motion explains hierarchy or state change without adding ornamental friction. |
| **Performance** | Strictly compositor-driven properties (`transform`, `opacity`); maintains 60/120fps. |
| **Responsiveness** | Durations stay within 100ms–250ms for direct actions; gesture tracking is 1:1. |
| **Interruptibility** | Immediate response when user clicks or escapes during active transition. |
| **Accessibility** | Complete graceful degradation when `prefers-reduced-motion` is active. |

## Remediation Plan Template

When reporting audit findings, organize improvements into prioritized work units:

### Remediation Matrix Example

| Priority | Component | Issue | Proposed Solution | Effort |
|---|---|---|---|---|
| **P0** | `src/components/NavigationDrawer.tsx` | Animates `left` and `width`, dropping frames on mobile. | Refactor to `transform: translateX()` with CSS spring. | 1h |
| **P0** | Global CSS | `* { transition: all 0.2s }` causing input typing lag. | Strip global rule; apply targeted transitions to buttons and links. | 30m |
| **P1** | `src/components/FilterableList.tsx` | Items pop abruptly when filters are toggled. | Add exit fade and layout animation with capped 150ms duration. | 2h |
| **P1** | `src/components/Modal.tsx` | Bounce animation takes 600ms to settle before input is focused. | Switch to snappy spring (`stiffness: 400`, `damping: 32`), duration ~200ms. | 1h |
| **P2** | `src/components/Tabs.tsx` | Static underline indicator. | Implement sliding indicator with `layoutId="activeTab"`. | 1.5h |
