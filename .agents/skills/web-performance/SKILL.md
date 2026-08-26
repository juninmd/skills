---
name: web-performance
description: |
  Make pages load and respond fast for real visitors on mobile. Use for Core Web Vitals, improving LCP, INP and CLS on a slow page, critical rendering path, image and font loading, code splitting, hydration, third-party scripts, and RUM data.
---

# Web Performance

## Preflight
```bash
curl -sS -o /dev/null -w 'ttfb %{time_starttransfer} total %{time_total}\n' https://example.com
npx lighthouse https://example.com --preset=perf --form-factor=mobile --quiet
```

Start from field data at p75, never a local run. Then name the **one** failing vital — fixing two at once proves neither.

## Workflow
1. Start from field data, never a local run. Segment by device and network; the p75 mobile visitor is the target, not your laptop on fibre.
2. Score at p75 against the thresholds below and name the one failing vital. Fixing two at once means proving neither.
3. Rule out the server first. A backend answering in 800ms cannot reach a 2.5s LCP, and no amount of image work will change that.
4. Attack that vital's actual cause (see the routing table).
5. Re-measure in the field after release. A lab-only improvement did not happen.

## Thresholds

| Vital | Good | Needs work | Poor | Measures |
|---|---|---|---|---|
| LCP | ≤ 2.5s | 2.5–4.0s | > 4.0s | when the main content appeared |
| INP | ≤ 200ms | 200–500ms | > 500ms | how fast interactions respond |
| CLS | ≤ 0.1 | 0.1–0.25 | > 0.25 | how much the layout jumped |

## Cause Routing

| Failing | Look at | Usual cause |
|---|---|---|
| LCP | TTFB, then resource discovery | slow server; hero image found late in a stylesheet or via JS; lazy-loaded LCP element |
| INP | long tasks, main-thread work | hydration, oversized bundles, a synchronous handler, third-party scripts |
| CLS | elements without reserved space | images with no dimensions, injected banners/ads, late webfont swap, content inserted above the viewport |

```bash
# Lab pass, mobile emulation — for iteration, not for verdicts
npx lighthouse https://example.com --preset=perf --form-factor=mobile --quiet
# Which requests block first paint
npx lighthouse https://example.com --only-audits=render-blocking-resources
# Server phases: is TTFB the problem before anything renders?
curl -sS -o /dev/null -w 'dns %{time_namelookup} connect %{time_connect} tls %{time_appconnect} ttfb %{time_starttransfer} total %{time_total}\n' https://example.com
```

## The Fixes That Actually Move Metrics

```html
<!-- LCP: discoverable early, prioritized, correctly sized, never lazy -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high">
<img src="/hero.avif" width="1200" height="630" fetchpriority="high" alt="...">

<!-- CLS: reserve the box before the bytes arrive -->
<img src="/thumb.jpg" width="400" height="300" style="aspect-ratio:4/3;height:auto">

<!-- Fonts: no invisible text, no late swap -->
<link rel="preload" as="font" type="font/woff2" href="/inter.woff2" crossorigin>
<!-- @font-face { font-display: swap } -->
```

## Reference Routing
- Threshold detail, field-data sources and their lag, per-metric root causes, priority hints: [vitals-and-field-data.md](references/vitals-and-field-data.md)

## Stop
- The verdict is being taken from a lab score. Lab is for iteration; field data at p75 is the verdict.
- Server response time has not been ruled out. No amount of image work fixes an 800ms TTFB.
- The LCP element is lazy-loaded. Fix that before anything else; it is the most common self-inflicted regression.

## Rules
- Field data means your own RUM or the public vendor dataset. That dataset is a rolling 28-day aggregate, so it cannot verify this week's release — use RUM for that and keep the aggregate as the quarterly reading.
- Lazy-load below the fold only. Lazy-loading the LCP element is the single most common self-inflicted regression.
- Reserve space for images, ads, and embeds with dimensions or `aspect-ratio`. Late content is what shifts layout.
- Third-party tags spend your budget on someone else's code. Load them after interactive, or not at all, and re-audit them — one tag's update becomes your regression.
- Hydration is real work. Prefer server-rendered static regions; hydrate only what is interactive.
- Set a CI budget on bundle size and vitals so a regression fails a build, not a quarterly review.
- A percentage improvement without an absolute number is marketing. Report before and after in milliseconds at p75.
- Server, query, and general profiling belong to `performance-engineering`; the component work to `frontend-engineering`; spend to `cost-engineering`.

## Checklist
- [ ] One failing vital identified from field data at p75, not from a lab score.
- [ ] Server response time ruled out before any front-end work.
- [ ] LCP element discoverable early, prioritized, sized, and not lazy-loaded.
- [ ] Every image, ad, and embed reserves its box.
- [ ] Re-measured in the field; before/after reported in absolute milliseconds.
- [ ] A CI budget guards the regression.
