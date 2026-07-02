---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
argument-hint: "[component/feature] [options]"
---

# Frontend Design Skill

## Objective

Create bespoke, production-ready frontend interfaces that completely avoid generic "AI" or template-based aesthetics. Deliver functional, clean, and scalable code (HTML/CSS/JS, React, Vue, etc.) with a strong emphasis on intentional visual direction, accessibility, and modern user experience (UX) principles.

## Core Principles

Before generating any code, strictly adhere to the following frontend best practices:
* **Design Tokens & Systems:** Use CSS variables or framework equivalents (e.g., Tailwind config) for colors, typography, spacing, and breakpoints to ensure consistency and maintainability.
* **Mobile-First & Responsive:** Guarantee fluid layouts that scale elegantly from mobile to ultra-wide screens.
* **Accessibility (a11y):** Enforce semantic HTML, ARIA attributes where necessary, proper contrast ratios, and full keyboard navigation (WCAG 2.1 AA standards).
* **Progressive Enhancement:** Ensure core functionality works robustly before layering on advanced styling and complex micro-interactions.
* **Performance:** Optimize asset loading, avoid heavy unoptimized libraries, and write DRY (Don't Repeat Yourself) CSS/JS.

## When to Use

* When the user requests custom web components, landing pages, or functional UI prototypes.
* When a project requires a strong, unique visual identity (e.g., brutalist, editorial, neomorphism, glassmorphism) rather than standard default frameworks.
* When the user asks for "design thinking" paired with actual, runnable code.
* When translating wireframes or abstract ideas into high-fidelity frontend code.

## Flow

1.  **Discovery & Constraints:** Clarify the project context: target audience, brand tone, technical stack constraints, and primary user goals.
2.  **Visual Architecture:** Propose a specific aesthetic direction and justify the choice. Define the fundamental *design tokens* (color palette, typography pairings, spacing scale).
3.  **Component Scaffolding:** Set up a minimal, clean architecture (e.g., React/Vite, Vue, or semantic HTML/CSS). Structure files modularly to separate logic, markup, and styling.
4.  **Implementation & Polish:** Write the code prioritizing semantic markup and responsive rules. Layer in CSS-first micro-interactions (e.g., hover states, focus rings, smooth transitions). Use animation libraries (like Framer Motion or GSAP) only if requested or strictly necessary for the aesthetic.
5.  **Documentation & Delivery:** Provide clear instructions on how to run, test, and customize the code.

## Validation

* **Skill Integrity:** Ensure `name` in frontmatter strictly matches the folder name: `frontend-design`.
* **Code Quality:** Check generated code for semantic correctness, missing `<label>` tags, appropriate `alt` attributes, and valid CSS syntax.
* **Runnability:** Verify that the produced artifact can run locally without fatal errors and includes a basic `README.md` or usage snippet.

## Outputs

* **Source Code:** A scaffolded component, layout, or page (e.g., `index.html`, `style.css`, or a `src/` directory for frameworks).
* **Design Rationale:** A brief technical note explaining the chosen color theory, typography, and how the design tokens are structured.
* **Actionable Next Steps:** Instructions on how the user can easily swap themes, adjust animations, or integrate the code into a larger codebase.

## Notes

Always prioritize custom CSS styling and layout techniques (like CSS Grid and Flexbox) over relying heavily on utility classes, unless a specific utility framework (like Tailwind) is requested. Place assets under the skill folder only when necessary. Keep the skill discoverable by retaining trigger keywords in the `description`.
