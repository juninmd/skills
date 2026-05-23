# Spec-First Design Workflow

Detailed procedures for creating validated design and implementation plans.

## 1. Inspect Context
- Read project instructions, relevant files, patterns, and tests.
- Identify constraints: API, data model, UX, security, performance, compatibility.
- Narrow the topic to the first independently shippable slice.

## 2. Clarify and Decide
- Ask only concise, must-have questions.
- Prefer assumption-based decisions over open-ended placeholders.
- Select exactly one approche; avoid presenting multiple alternatives.

## 3. Writing the Spec
Target path: `temp/specs/YYYY-MM-DD-<topic>-design.md`.
- Use local date and kebab-case topic.
- Include: Request, Context, Chosen Design, Scope (In/Out), File Structure, Data Flow.

## 4. Transition to Implementation
- Use the spec as the single source of truth.
- Delete the temporary spec immediately after implementation completes.
