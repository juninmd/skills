---
name: spec-first-design
description: "Spec-First Design for Designing new, Planning complex, Resolving requirement via temp/specs/YYYY-MM-DD-<topic>-design.md."
license: MIT
metadata:
  version: 1.1.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace]
---

# Spec-First Design

Expert methodology for turning ambiguous requests into concrete, validated design-and-plan documents in `temp/specs/` before any code implementation begins.

**USE FOR:**
- Designing new features or significant behavioral changes.
- Planning complex refactors with multiple dependencies.
- Resolving requirement ambiguity through structured specs.
- Creating executable handoffs for agents or human engineers.
- Ensuring "test-first" implementation for critical logic.

**DO NOT USE FOR:**
- Simple one-line changes or configuration updates.
- Generating sets of alternative proposals (choose one).

**INVOKES:**
- `temp/specs/YYYY-MM-DD-<topic>-design.md` generation.

## Methodology and Guidelines
Implementation details for workflows, templates, and checklists are documented in:
1. [Design Workflow](references/spec-workflow.md)
2. [Templates & Checklists](references/spec-templates.md)

## Core Principles
1. **Decision over Options:** Select the single best defensible design; do not offer menus.
2. **Ambiguity Reduction:** Every task in the plan must be executable without further context.
3. **Temporality:** Specs are ephemeral artifacts that must be deleted after implementation.

## Checklist
- [ ] Inspect project context and constraints before writing the spec.
- [ ] Write one chosen design and implementation plan to `temp/specs/`.
- [ ] Include failing-test-first steps for all behavioral changes.
- [ ] Complete all design and plan validation checklists within the spec.
- [ ] Ensure spec deletion is the final task in the implementation plan.
