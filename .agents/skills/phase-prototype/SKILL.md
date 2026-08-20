---
name: phase-prototype
description: |
  Prototype stage of the delivery loop: stops until the user picks or comments. Use for building three throwaway variants A, B and C so a direction is chosen before any planning starts.
---

# Stage 2 — Prototype

## Contract
- Entry: `.workflow/<slug>/research.md`; run `phase-research` if missing.
- Output: variants `A`, `B`, `C` plus `prototype.md`. Prototype code is throwaway and never merged.
- Human gate: the loop stops here until the user selects a variant or sends comments.

## Workflow
1. Derive three genuinely distinct approaches from the research and prior art — not three skins of one idea.
2. Build each as a self-contained artifact the user can open and click: fake data, hardcoded state, no production wiring.
3. Show each variant in its key states and interactions: empty, populated, error, and the core interaction itself.
4. Label them `A`, `B`, `C` and give each a one-line tradeoff so they can be compared at a glance.
5. Set `awaiting: "prototype-selection"` and notify the user. Stop working.
6. On comments: run another round — refine the named variants or generate new ones — and stop again. Do not advance.
7. On selection: record the chosen variant, the rejected ones, and why in `prototype.md`; carry the decisions forward.
8. Set `stage: "plan"` and hand the research plus the chosen prototype to `phase-plan`.

## Rules
- Never advance without an explicit selection; silence is not approval.
- Iteration rounds are expected; there is no cap on them.
- Prototype quality bar is deliberately low — no tests, no abstractions, no error handling.
- Never promote prototype code; the plan re-implements the chosen direction properly.

## Checklist
- [ ] Three distinct variants built and viewable.
- [ ] Key states and interactions shown for each.
- [ ] Tradeoffs stated in one line per variant.
- [ ] User explicitly selected a variant.
- [ ] Choice and rejections recorded in `prototype.md`.
- [ ] Prototype code excluded from the delivery branch.
