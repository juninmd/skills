
# Design Systems

## Preflight
```bash
rg -n 'blue-[0-9]|gray-[0-9]|#[0-9a-fA-F]{3,6}' src/components/ | head   # primitives leaking
ls .changeset/ 2>/dev/null && cat package.json | jq '{name, version, exports}'
rg -l '\.stories\.' src/components/ | wc -l                              # story coverage
```

Know who consumes this package and on what cadence. Consumers cannot migrate on your schedule.

## Workflow
1. Start from the tokens — color, spacing, type scale, radius, shadow, motion. Every component reads them; none holds a raw value.
2. Inventory what product teams already built and promote the **repeated** shapes. Do not invent components nobody asked for; an unused component is permanent maintenance for zero users.
3. Design each component API around what a consumer must decide, and expose the rest through composition.
4. Name variants by intent, never by appearance.
5. Publish with a usage example, the accessibility contract, and a changeset describing the API impact.
6. Treat API and token-meaning changes as breaking, and ship them with a migration path.

## Token Layers
The middle layer is the whole point, and the one most often skipped.

| Layer | Example | Who may reference it |
|---|---|---|
| Primitive | `blue-600`, `space-4` | the semantic layer only |
| Semantic | `color-action`, `color-danger`, `space-inline-sm` | components |
| Component | `button-bg-hover` | that component |

The most common defect in any design system: a component reading `blue-600` instead of `color-action`. It reviews fine, ships fine, and breaks the day dark mode arrives.

```bash
rg -n 'blue-[0-9]|gray-[0-9]|#[0-9a-fA-F]{3,6}' src/components/   # primitives and hex leaking in
```

## Variant Naming

| Intent-named | Appearance-named |
|---|---|
| `variant="danger"` | `variant="red"` |
| `tone="subtle"` | `tone="light-gray"` |
| `size="compact"` | `size="28px"` |

Appearance names become lies the first time the brand changes, and then they are permanent because renaming them is a breaking change.

## Composition Over Configuration

```tsx
// Fifteen booleans: a layout engine with a bad interface
<Card hasHeader hasFooter isCompact showDivider headerAlign="left" ... />

// Composition: the consumer assembles what they need
<Card>
  <Card.Header>…</Card.Header>
  <Card.Body>…</Card.Body>
</Card>
```

Always forward `className`, `ref`, and the underlying element props. A component consumers cannot escape gets forked instead of used — and a fork is a component you no longer control but still support.

## What Counts as Breaking

| Change | Breaking | Ship with |
|---|---|---|
| Removing a variant or prop | yes | codemod, or a deprecation window |
| Changing a prop default | yes — silently | major, and say it in the notes |
| Changing what a semantic token resolves to | yes — visually, everywhere | major |
| Adding an optional prop | no | minor |
| Tightening a prop's accepted type | yes | major |

Consumers cannot migrate on your schedule. Ship the codemod in the same release, or keep the old path alive for a stated window.

## Stop
- A component reads a primitive token or a hex value. Fix it before publishing; it will not survive theming.
- A breaking change has no codemod and no deprecation window. Do not publish it.
- A variant or state has no story. It is untested — add one or do not document the state.

## Rules
- Tokens are the theming boundary. A component that hard-codes a hex value cannot be themed and will not survive dark mode.
- Accessibility is part of the component contract, not the consumer's problem: label association, focus, roles, and keyboard behavior ship with the component. `accessibility` sets the bar.
- Every documented variant and state needs a story, and the story **is** the test — visual and interaction assertions run against it. An undocumented state is an untested one.
- Design-tool parity means shared token **names**, not pixel matching. Sync the names first; pixel comparison without shared names is an endless argument.
- The system serves products. When a product needs an escape hatch, give it one instead of blocking their release — a blocked team forks, and the fork never comes back.
- Enumerate the states a component owes with `ui-state-design`; the visual system itself is decided by `frontend-design`; consuming the library is `frontend-engineering`.

## Checklist
- [ ] Components read semantic tokens only; no primitive or hex leaks (grep proves it).
- [ ] Variants named by intent, never by appearance.
- [ ] APIs favor composition; `className`, `ref`, and element props forwarded.
- [ ] Accessibility contract documented and shipped with the component.
- [ ] Every variant and state has a story, and the story asserts something.
- [ ] Breaking changes carry a codemod or a stated deprecation window.
