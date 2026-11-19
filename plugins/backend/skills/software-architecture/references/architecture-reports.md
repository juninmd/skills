# Architecture Review Reports

Open when producing a standalone visual HTML report for an architecture review, deepening candidates, or a structural comparison.

## Contents

- Report Scaffold and Dependencies
- Report Header and Metadata
- Candidate Card Structure
- Diagram Authoring with Mermaid and SVG
- Styling and Visual Hierarchy

## Report Scaffold and Dependencies

Write the report as one self-contained HTML file in the OS temp directory (`%TEMP%` or `$TMPDIR`). It uses CDN resources only, so no server is needed:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture Review</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "strict" });
    </script>
    <style>
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <!-- Content sections -->
    </main>
  </body>
</html>
```

## Report Header and Metadata

Show the repository name, audit timestamp, and a legend:
- **Solid box:** module boundary
- **Dashed line:** deliberate seam
- **Red highlight:** coupling that leaks across a seam
- **Dark solid box:** consolidated deep module

## Candidate Card Structure

Render each deepening candidate as an `<article>` card with a before/after comparison:

1. **Title:** the transformation in one phrase (for example "Consolidate Order Intake Pipeline").
2. **Badges:** confidence (`Strong`, `Exploratory`, `Speculative`) and dependency class (`In-Process`, `Ports & Adapters`, `External Mock`).
3. **Files:** monospaced paths touched.
4. **Before / After:** two columns of diagrams showing the change.
5. **Win:** bullets on interface depth, test locality, and wrappers removed.

## Diagram Authoring with Mermaid and SVG

### Call Flow and Coupling (Mermaid)

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[Client] --> B[DeepModule]
      B --> C[(Database)]
      B -.-> D[NotificationAdapter]
      classDef deep fill:#0f172a,color:#fff,stroke:#0f172a;
      class B deep
  </pre>
</div>
```

### Layer Collapse and Visual Blocks (HTML/Tailwind)

To show several shallow tiers merging into one deep boundary, put styled Tailwind cards side by side:
- **Before:** a stack of thin cards, each holding a trivial one-line pass-through.
- **After:** one dark card with a single public method and its helpers kept inside.

## Styling and Visual Hierarchy

- Favor whitespace; keep it editorial.
- Give colors a job: emerald for verified consolidations, red for boundary leaks, amber for trade-offs.
- Cap diagrams at about `320px` tall so before and after panels line up with no vertical scrolling.
