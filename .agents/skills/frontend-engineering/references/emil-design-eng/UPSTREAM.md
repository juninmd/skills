# Upstream

- Source: https://github.com/emilkowalski/skills (`skills/`), MIT, see `LICENSE`.
- Pinned commit: `d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128` (2026-09-24).
- Files: `emil-design-eng/SKILL.md` → `design-eng.md`, `animate/SKILL.md` → `animate.md`, `animate/RECIPES.md` → `animate-recipes.md`, `review-animations/SKILL.md` → `review-animations.md`, `review-animations/STANDARDS.md` → `review-standards.md`, `improve-animations/SKILL.md` → `improve-animations.md`, `improve-animations/AUDIT.md` → `improve-audit.md`, `improve-animations/PLAN-TEMPLATE.md` → `improve-plan-template.md`, `find-animation-opportunities/SKILL.md` → `find-animation-opportunities.md`, `animation-vocabulary/SKILL.md` → `animation-vocabulary.md`, `apple-design/SKILL.md` → `apple-design.md`, `mobile-native/SKILL.md` → `mobile-native.md`, `prototype/SKILL.md` → `prototype-variants.md`, `prototype/PICKER.md` → `prototype-picker.md`, `ask-sonner/SKILL.md` → `sonner.md`, `ask-sonner/API.md` → `sonner-api.md`, `performance-cheatsheet.md` → `performance-cheatsheet.md`. Each upstream `SKILL.md` is renamed so clients do not load it as a separate skill.
- Local changes: companion-file and `SKILL.md` links point at the renamed copies; mentions of sibling upstream skills link to the vendored copy or name the owning skill here. No other edits.
- Vetting: prose and example code only; no scripts, network calls, or agent-directed concealment.
- Updating: re-vet the upstream diff from the pinned commit before copying.
