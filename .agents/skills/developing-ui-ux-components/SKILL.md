---
name: developing-ui-ux-components
description: Design, implement, and document reusable, accessible frontend UI components for web applications
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# UI/UX Component Developer Skill

## Description
This skill enables the agent to design, implement, and document reusable frontend UI components. It focuses on creating modular, accessible, and styled components for web applications using modern frameworks.

## Workflow

### 1. Analyze Requirements
- Review design specs (Figma, Sketch) or user stories.
- Identify the component's purpose, states (hover, active, disabled), and props.
- Determine accessibility requirements (ARIA attributes).

### 2. Implement Component
- Write the component code (e.g., React, Vue, Angular).
- Apply styling (CSS, SASS, Tailwind).
- Ensure responsiveness across different screen sizes.

### 3. Test & Validate
- Write unit tests for component logic (e.g., Jest, React Testing Library).
- Visually test the component in a sandbox (e.g., Storybook).
- Verify accessibility compliance.

### 4. Document
- Document component props, usage examples, and variations.
- Update the component library or style guide.

## Best Practices
- **Atomic Design:** Build small atoms (buttons, inputs) first, then combine them into molecules and organisms.
- **Prop Drilling:** Avoid excessive prop drilling; use composition or context where appropriate.
- **Isolation:** Ensure components are self-contained and don't rely on global state or styles.
