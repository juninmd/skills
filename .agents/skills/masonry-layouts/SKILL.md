---
name: masonry-layouts
description: |
  Build variable-height card grids with CSS multi-column, a layout library, or native grid masonry. Use for gallery and feed layouts, items splitting across columns, and a grid that jumps as images load.
---

# Masonry Layouts

## Preflight
```bash
rg -n 'columns:|column-count|masonry' src/**/*.css | head
rg -n '<img' src/ | rg -v 'width=|height=' | head    # images with no reserved box
```

Answer first: **must visual order match DOM order?** Everything else follows from it.

## The Question That Picks the Approach
**Must visual order match DOM order?** Everything else follows from that one answer.

| Answer | Approach | Cost |
|---|---|---|
| No — a gallery, order is decorative | CSS multi-column | zero JS, works without hydration |
| Yes — a feed, ranking matters | JS masonry library, absolute positioning | JS, relayout, hydration gap |
| Progressive enhancement | native `grid-template-rows: masonry` inside `@supports` | narrow support; always needs a fallback branch |

## Multi-Column Fills the Wrong Way
This is the trap, and it is invisible until someone reads the page in order.

```
Multi-column        Masonry (true order)
┌───┬───┬───┐       ┌───┬───┬───┐
│ 1 │ 4 │ 7 │       │ 1 │ 2 │ 3 │
│ 2 │ 5 │ 8 │       │ 4 │ 5 │ 6 │
│ 3 │ 6 │ 9 │       │ 7 │ 8 │ 9 │
└───┴───┴───┘       └───┴───┴───┘
 top-to-bottom       left-to-right
```

Item 2 lands **below** item 1, not beside it. Never ship multi-column where reading order carries meaning — a ranked feed, a paginated result set, anything chronological.

## CSS Baseline

```css
.grid {
  columns: 3 280px;          /* count and min width, responsive for free */
  column-gap: var(--space-4);
}
.grid > * {
  break-inside: avoid;       /* on the ITEM, not the container */
  margin-bottom: var(--space-4);
}
.grid img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;       /* reserves the box before the bytes arrive */
}
```

Without `break-inside: avoid` a card splits across the column boundary the moment its content grows.

## Why the Grid Jumps

| Symptom | Cause | Fix |
|---|---|---|
| Cards overlap or leave gaps | first layout pass measured zero-height images | relayout on image `load` |
| Everything shifts on resize | no resize handling | `ResizeObserver` on the container |
| Stack of full-width cards, then a jump | SSR markup carries no JS positions | CSS fallback that stands alone, or hide until first layout |
| Shift as each image arrives | no reserved box | `width`, `height`, and `aspect-ratio` on every image |
| Scrolling degrades over time | thousands of DOM nodes | virtualize — on a measured trigger |

```js
const ro = new ResizeObserver(() => layout());
ro.observe(container);
container.querySelectorAll('img').forEach(img => {
  if (!img.complete) img.addEventListener('load', layout, { once: true });
});
```

## Virtualize on Evidence, Not a Number
Not "over 200 items". Virtualize when you measure one of: DOM nodes in the thousands, a layout pass exceeding one frame (~16ms), or heap growth tracking scroll depth. Virtualization breaks find-in-page, anchor links, and print — pay that cost only once it is earned.

## Stop
- Reading order carries meaning and multi-column is on the table. Stop — it fills top-to-bottom; item 2 lands below item 1.
- Images have no reserved box. Fix that before layout work, or every measurement is against a moving target.
- Virtualization is being added on a guessed threshold. Measure first; it breaks find-in-page, anchors, and print.

## Rules
- Multi-column and absolute positioning detach the visual picture from the DOM, and both focus order and screen-reader order follow the **DOM**. Keep DOM order meaningful; route the audit to `accessibility`.
- Native grid masonry support is narrow. Treat it as progressive enhancement inside a feature query, never as the only path.
- Set `break-inside: avoid` on the item, never on the container — on the container it does nothing.
- Every image reserves its box before it loads, or the layout shifts and `web-performance` will bill you for the CLS.
- Column counts get verified at mobile, tablet, and desktop. A three-column grid at 360px is one unreadable column of slivers.
- The visual system — spacing, radius, card treatment — belongs to `frontend-design`; the component implementation to `frontend-engineering`.

## Checklist
- [ ] Order-sensitivity answered first, and the approach follows from it.
- [ ] Focus and screen-reader order still read correctly.
- [ ] `break-inside: avoid` on items; no card splits at any breakpoint.
- [ ] Every image reserves its box; no shift on a throttled network or at hydration.
- [ ] Layout re-measures after image load and on `ResizeObserver`.
- [ ] Column counts verified at mobile, tablet, and desktop; virtualization added only on measured evidence.
