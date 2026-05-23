# UI Design and Composition Guidelines

Principles for building visually intentional and domain-appropriate interfaces.

## 1. Establishing the UI Contract
- **Workflows:** Identify primary tasks and viewport constraints.
- **Direction:** Choose a visual tone that fits the domain (avoid generic SaaS aesthetics).
- **States:** Define all required states: loading, empty, error, disabled, hover, focus, selected, and optimistic.

## 2. Design with Intent
- **Typography:** Match font scale to context (compact for tools, expressive for marketing).
- **Color:** Use a systematic palette (neutral base, semantic states, purposeful accents).
- **Hierarchy:** Make strong compositional decisions regarding density and rhythm.
- **Motion:** Use short, interruptible animations to clarify state changes; respect `prefers-reduced-motion`.
- **Cues:** Use domain-specific visual cues instead of decorative-only elements.
