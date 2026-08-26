# Vitals Thresholds and Field Data

## Thresholds, measured at the 75th percentile of real sessions

| Metric | Good | Needs improvement | Poor |
| --- | --- | --- | --- |
| Largest Contentful Paint (loading) | ≤ 2.5s | 2.5s – 4.0s | > 4.0s |
| Interaction to Next Paint (responsiveness) | ≤ 200ms | 200ms – 500ms | > 500ms |
| Cumulative Layout Shift (visual stability) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |

A page passes only when all three are in the good band at p75, segmented by device class. A desktop-only pass with a failing mobile p75 is a failing page.

## Where field data comes from

1. **Your own RUM.** The browser's performance observers report each metric from real sessions; a small script sends them to your analytics. This is the only source with same-day feedback, per-route granularity, and your own dimensions (release, device, country, logged-in state). Build it before you need it.
2. **The public field dataset compiled by browser vendors** from opted-in users. Free, comparable across sites, and available per origin and often per URL — but it is an aggregate over a **rolling 28-day window**. A fix released today only fully clears that window four weeks later, and moves the number gradually before then. Never treat it as release verification.
3. **Lab runs** (local profiles, CI audits, synthetic checks) are for diagnosis and regression gates, never for judging real-user performance. A lab score improving while field data does not is a fix that did not reach real visitors.

Practical loop: verify with your own RUM within days of release, use the public dataset as the slow, comparable quarterly reading, and gate regressions in the lab.

## Root causes by metric

**LCP** — decompose into time to first byte, resource load delay, resource load time, and render delay. TTFB dominates more often than people expect: slow origin, uncached database query, cold serverless start, or a redirect chain. A 800ms TTFB leaves under 1.7s for everything else. Fix the server first; the `performance-engineering` skill covers backend profiling, query cost, and caching.

Then: the LCP element is discovered late (inside JS, a background image in CSS, or behind a lazy-loading attribute), the image is oversized or in a legacy format, or render is blocked by synchronous scripts and fonts.

**INP** — long tasks on the main thread: heavy event handlers, large re-renders, hydration, third-party scripts, and expensive layout work. Break tasks, defer non-urgent work past paint, and virtualize long lists.

**CLS** — images and embeds without dimensions, injected banners and ads, late-loading fonts causing reflow, and content inserted above the current viewport.

## Prioritizing the LCP element

Prefer the priority hint on the element itself over a preload:

```html
<img src="/hero.avif" width="1200" height="630" fetchpriority="high" alt="…">
```

The hint raises the request's priority where it is discovered, keeps the URL in one place, and cannot go stale the way a preload pointing at a renamed asset does. Reserve preload for resources the parser cannot discover early (a font, or an image referenced only from CSS or JS). Never set `loading="lazy"` on the LCP element, and never mark many elements high priority — everything prioritized is nothing prioritized.
