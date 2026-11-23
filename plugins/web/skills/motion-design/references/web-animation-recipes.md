# Web Animation Recipes

Production-ready implementation patterns for CSS transitions, Framer Motion, and Web Animations API.

## Contents
- CSS-Only Accordion and Height Reveal
- Dialog and Modal Overlays
- Staggered List Transitions
- Shared Layout and Morphed Elements
- Tactile Micro-Interactions
- Motion Reduction Fallbacks

## CSS-Only Accordion and Height Reveal

Avoid animating `height: auto` directly with JavaScript. Use CSS Grid row interpolation:

```html
<div class="accordion-item">
  <button class="accordion-trigger" aria-expanded="false">Toggle Section</button>
  <div class="accordion-content">
    <div class="accordion-inner">
      <p>Collapsible text content rendered here without layout thrashing.</p>
    </div>
  </div>
</div>

<style>
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.accordion-content[data-open="true"] {
  grid-template-rows: 1fr;
}

.accordion-inner {
  overflow: hidden;
}
</style>
```

## Dialog and Modal Overlays

Subtle translation, scale, and opacity provide clean depth without visual clutter:

```tsx
// Using Framer Motion
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg rounded-xl bg-background p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.8,
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

## Staggered List Transitions

When rendering collections, stagger entry to guide eye tracking. Cap the cumulative delay so lists never feel sluggish:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 26,
    },
  },
};

export function StaggeredList({ items }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants} className="p-3">
          {item.title}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

## Shared Layout and Morphed Elements

Use Framer Motion's `layoutId` or the browser View Transitions API for seamless morphing between views (e.g. active tab indicator):

```tsx
import { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["Overview", "Activity", "Settings"];

export function TabBar() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <nav className="flex space-x-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="relative px-3 py-1.5 text-sm font-medium transition-colors"
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-indicator"
              className="absolute inset-0 rounded-md bg-background shadow-sm"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </nav>
  );
}
```

## Tactile Micro-Interactions

Buttons and interactive triggers should give immediate tactile feedback on press:

```css
/* Tactile Press Utility */
.interactive-tap {
  transition: transform 120ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 120ms ease;
  will-change: transform;
}

.interactive-tap:active {
  transform: scale(0.97) translateY(1px);
}
```

## Motion Reduction Fallbacks

Always respect reduced motion preferences. When `prefers-reduced-motion` is active:
1. Replace multi-property movement with instantaneous display or simple opacity fades.
2. In Framer Motion, set duration to `0` or wrap components with `useReducedMotion()`.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
