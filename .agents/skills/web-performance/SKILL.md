---
name: web-performance
description: |
  Make pages load and respond fast for real visitors. Use for Core Web Vitals, LCP, INP and CLS, the critical rendering path, image and font loading, code splitting, hydration cost, third-party scripts, and reading field data from RUM or Lighthouse.
---

# Web Performance

## Workflow
1. Start from field data, not a local run. Segment by device class and network; the p75 mobile visitor is the target.
2. Pick the failing vital and find its cause: LCP is usually the hero image or a blocking request, INP is main-thread work, CLS is unreserved space.
3. Trace the critical path for the first screen and remove anything that blocks it that the first screen does not need.
4. Fix the largest contentful element first: preload it, size it, serve it in a modern format, and never lazy-load it.
5. Cut main-thread work: split bundles by route, defer non-interactive components, and break long tasks so input can land between them.
6. Re-measure in the field after release. A lab improvement that field data does not show did not happen.

## Rules
- Optimize the visitor's p75, not your laptop. A fast local build hides everything that matters.
- Reserve space for images, ads, and embeds with explicit dimensions or aspect ratio; late-arriving content is what shifts layout.
- Fonts: preload the one used above the fold, use `font-display: swap`, and subset it. Invisible text is a failed paint.
- Lazy-load below the fold only. Lazy-loading the LCP element makes the metric worse.
- Third-party tags are someone else's performance budget spent on your page. Load them after interactive or not at all.
- Hydration is real work. Prefer server-rendered static regions and hydrate only what is interactive.
- Set a budget in CI on bundle size and vitals, so a regression fails a build instead of a quarterly review.

## Checklist
- [ ] The failing vital is identified from field data at p75.
- [ ] The critical path and the LCP element are optimized deliberately.
- [ ] A CI budget guards against regression.
