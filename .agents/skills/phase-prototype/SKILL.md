---
name: phase-prototype
description: |
  Prototype stage of the delivery loop: stops until the user picks or comments. Use for building three throwaway variants A, B and C so a direction is chosen before any planning starts.
---

# Stage 2 — Prototype

## Preflight
```bash
ls .workflow/<slug>/research.md || echo 'run phase-research first'
mkdir -p .workflow/<slug>/prototypes/{A,B,C}
```

Three genuinely distinct approaches, derived from the research. If the user could not pick wrongly and regret it, they are not far enough apart.

## Contract
- **Entry:** `.workflow/<slug>/research.md`; run `phase-research` if missing.
- **Output:** variants `A`, `B`, `C` plus `prototype.md`. Prototype code is throwaway and never merged.
- **Location:** every variant under `.workflow/<slug>/prototypes/<variant>/`, recorded in `scratch`. Nothing outside that path.
- **Human gate:** the loop stops here until the user selects a variant or sends comments.

## Workflow
1. Derive three **genuinely distinct** approaches from the research and prior art.
2. Build each as a self-contained artifact the user can open and click: fake data, hardcoded state, no production wiring.
3. Show each in its key states — empty, populated, error, and the core interaction itself.
4. Label them `A`, `B`, `C`, each with a one-line tradeoff so they compare at a glance.
5. Increment `rounds.prototype`, set `awaiting: "prototype-selection"`, notify, and **stop working**.
6. On comments: run another round, increment again, stop again. Do not advance.
7. On selection: record the choice, the rejections, and why in `prototype.md`.
8. Set `stage: "plan"` and `awaiting: null` in one write.

## Three Variants, Not Three Skins
The point is to make a decision cheap. Three versions of the same idea make it impossible.

| Distinct | Skins |
|---|---|
| Wizard · single form · inline editing | the same form in blue, green, and grey |
| Server-rendered · client-side · hybrid | the same layout with different padding |
| Optimistic · confirm-first · queued | the same flow with different button copy |

If a user could not pick wrongly and regret it, the variants are not far enough apart.

## Presenting Them

| Variant | One-line tradeoff |
|---|---|
| A | Fastest to build; breaks down past ~20 items |
| B | Handles scale; costs an extra round trip |
| C | Best on mobile; needs a new component in the design system |

Every variant must be **openable** — a file the user can double-click, a route they can visit. A description of a prototype is not a prototype, and it does not settle anything.

## Quality Bar Is Deliberately Low

| Do | Do not |
|---|---|
| Hardcode data | wire the real API |
| Skip error handling | add retries or logging |
| Duplicate freely | extract abstractions |
| One file per variant | build a structure |
| Delete it afterwards | keep "just the good parts" |

Time spent making a prototype good is time spent on two variants that will be thrown away.

## Stop
- No explicit selection has been made. Silence is not approval; the loop does not advance.
- Any prototype file landed outside `.workflow/<slug>/prototypes/`. Move it — the delivery branch must carry none.
- A variant is not openable. A description of a prototype settles nothing; build it or drop it.

## Rules
- Never advance without an **explicit** selection. Silence is not approval, and a prototype nobody answered is a prototype nobody looked at.
- Iteration rounds are expected and uncapped, but every one increments `rounds.prototype`. That counter is how the loop shows the cost of indecision.
- Never promote prototype code. The plan re-implements the chosen direction properly — that is why the bar was allowed to be low.
- Everything lives under `.workflow/<slug>/prototypes/` and is listed in `scratch`, so `phase-done` can prove the delivery branch carries none of it.
- The visual quality of a variant is not what is being chosen — the **direction** is. Say so when presenting them, or feedback arrives about colors.

## Checklist
- [ ] Three genuinely distinct variants built and openable.
- [ ] Key states and the core interaction shown for each.
- [ ] One-line tradeoff per variant, comparable at a glance.
- [ ] `rounds.prototype` incremented on every round, including comment rounds.
- [ ] User explicitly selected a variant; silence never advanced the loop.
- [ ] Choice and rejections recorded in `prototype.md` with reasons.
- [ ] All prototype code under `.workflow/<slug>/prototypes/` and listed in `scratch`.
