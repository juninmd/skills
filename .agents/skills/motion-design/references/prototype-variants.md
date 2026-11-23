# Motion Prototyping and Variant Exploration

Techniques for building runtime variant pickers, comparing animation personalities, and tuning physics parameters.

## Contents
- Why Prototype Motion Variants
- Motion Personality Profiles
- Runtime Variant Switcher Implementation
- Blind Evaluation Workflow
- Promoting Selected Variants to Production Tokens

## Why Prototype Motion Variants

Motion cannot be judged accurately from static design specs or raw numbers. Micro-differences in spring stiffness and damping fundamentally alter the perceived personality of a feature:
- Building 3–4 distinct variants behind an ephemeral runtime toggle allows stakeholders to test tactile feel directly in the browser.
- Side-by-side comparison eliminates endless subjective debates by grounding feedback in actual interaction.

## Motion Personality Profiles

Define standardized motion archetypes for comparative evaluation:

| Profile | Stiffness | Damping | Mass | Perceived Character |
|---|---|---|---|---|
| **Snappy (Default)** | 420 | 34 | 0.8 | Responsive, efficient, zero bounce. Ideal for productivity tools and high-frequency actions. |
| **Gentle / Cinematic** | 220 | 26 | 1.0 | Soft deceleration, smooth arrival. Ideal for editorial content, reader views, and luxury apps. |
| **Tactile / Spring** | 360 | 22 | 0.9 | Subtle overshoot (3–5%), mechanical springiness. Ideal for gaming, social micro-interactions, toggles. |
| **Sharp / Linear Easing** | — | — | — | Strict CSS `cubic-bezier(0.16, 1, 0.3, 1)` with 160ms fixed duration. Consistent, deterministic timing. |

## Runtime Variant Switcher Implementation

Embed an unobtrusive developer widget during prototype reviews:

```tsx
import { useState } from "react";
import { motion, type Transition } from "framer-motion";

export const VARIANT_PRESETS: Record<string, Transition> = {
  Snappy: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 },
  Gentle: { type: "spring", stiffness: 220, damping: 26, mass: 1.0 },
  Tactile: { type: "spring", stiffness: 360, damping: 22, mass: 0.9 },
  Sharp: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
};

export function VariantExplorer({ children }: { children: (transition: Transition) => React.ReactNode }) {
  const [selectedKey, setSelectedKey] = useState("Snappy");

  return (
    <div className="relative">
      {/* Floating Selector Pill */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full border bg-background/95 p-1 shadow-lg backdrop-blur">
        {Object.keys(VARIANT_PRESETS).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedKey(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedKey === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Render Component with Active Physics Transition */}
      {children(VARIANT_PRESETS[selectedKey])}
    </div>
  );
}
```

## Blind Evaluation Workflow

To avoid cognitive bias toward specific technical numbers:
1. Label prototypes with generic names (`Option A`, `Option B`, `Option C`).
2. Ask team members to complete standard tasks (e.g. archiving 5 items, opening 3 dialogs).
3. Record feedback on perceived speed, distractibility, and fluidity.
4. Reveal underlying physics configurations only after preferences are established.

## Promoting Selected Variants to Production Tokens

Once a personality profile is selected, commit values to the design token dictionary rather than scattering ad-hoc constants across components:

```typescript
// src/lib/motion-tokens.ts
export const motionTokens = {
  durations: {
    instant: "100ms",
    fast: "180ms",
    normal: "240ms",
  },
  easings: {
    standard: "cubic-bezier(0.16, 1, 0.3, 1)",
    exit: "cubic-bezier(0.7, 0, 0.84, 0)",
  },
  springs: {
    interactive: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 },
    sheet: { type: "spring", stiffness: 320, damping: 28, mass: 1.0 },
  },
} as const;
```
