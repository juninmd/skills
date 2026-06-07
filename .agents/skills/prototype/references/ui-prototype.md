# UI Prototype Guide

Generate multiple design variations of a UI component or page, toggled via a floating bottom control bar.

## When to use

When you need to evaluate "several radically different UI variations" by switching between them in-browser rather than debating static mockups.

## Shape A (preferred) — variants on existing route

Use `?variant=N` URL parameters on an existing route. Preserves real data, auth, and context.

```tsx
const variant = new URLSearchParams(window.location.search).get('variant') ?? '1'

if (variant === '1') return <VariantOne />
if (variant === '2') return <VariantTwo />
return <VariantThree />
```

## Shape B (fallback) — dedicated throwaway route

Use when no existing page can host the variants. Create a dedicated `/proto/[feature]` route. Mark it clearly as a prototype and gate it out of production.

## Variant guidelines

- Aim for 3 variants; cap at 5
- Each variant must differ in **structure** — different layout, different information hierarchy, different primary affordance
- NOT just different colors or spacing
- Avoid excessive shared code that constrains variant independence

## Switcher

Fixed bottom bar (visible only in dev/proto mode):

```tsx
// Fixed bottom bar — hide in production
{isProtoMode && (
  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#000', color: '#fff', padding: '8px', display: 'flex', gap: '8px' }}>
    <button onClick={() => setVariant('1')}>← Variant 1</button>
    <span>Variant {variant}</span>
    <button onClick={() => setVariant('2')}>Variant 2 →</button>
  </div>
)}
```

Add keyboard support: `←` / `→` keys to cycle variants.

## Anti-patterns

- Cosmetic-only differences (color, spacing) — not enough to compare approaches
- Connecting prototype mutations to real backend calls
- Shipping prototype switcher infrastructure to production

## Completion

Once a winner is chosen:
1. Document why that variant won (PR description or ADR)
2. Delete all variant code except the winner
3. Remove the switcher entirely
