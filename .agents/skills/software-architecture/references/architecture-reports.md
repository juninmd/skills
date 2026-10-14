# Architecture Review Reports

Open when generating standalone, visual HTML reports for codebase architectural reviews, deepening candidates, and structural comparisons.

## Contents

- Report Scaffold and Dependencies
- Report Header and Metadata
- Candidate Card Structure
- Diagram Authoring with Mermaid and SVG
- Styling and Visual Hierarchy

## Report Scaffold and Dependencies

Generate reviews as a single, self-contained HTML document stored in the operating system temporary directory (`%TEMP%` or `$TMPDIR`). The file relies solely on CDN resources without local server requirements:

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

Include repository name, audit timestamp, and a concise visual legend:
- **Solid Box:** Module boundary
- **Dashed Line:** Explicit architectural seam
- **Red Highlight:** Coupling leak across seams
- **Dark Solid Box:** Deep module consolidation

## Candidate Card Structure

Format each deepening candidate as an `<article>` card with side-by-side comparison:

1. **Title:** Clear transformation statement (e.g., "Consolidate Order Intake Pipeline").
2. **Badges:** Recommendation confidence (`Strong`, `Exploratory`, `Speculative`) and dependency classification (`In-Process`, `Ports & Adapters`, `External Mock`).
3. **Involved Files:** Monospaced list of active paths.
4. **Before / After Diagrams:** Two-column visual representation of the transformation.
5. **Architectural Win:** Specific bulleted improvements in interface depth, test locality, and wrapper deletion.

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

For showing shallow multi-tier layers collapsed into a single deep boundary, use styled Tailwind cards side by side:
- **Before:** Multiple stacked thin cards, each with trivial 1-line pass-through methods.
- **After:** A single consolidated dark card exposing one public method and encapsulating internal helpers.

## Styling and Visual Hierarchy

- Maintain clean whitespace and an editorial presentation.
- Use accent colors purposefully: emerald for verified consolidations, red for boundary leaks, amber for architectural trade-offs.
- Keep diagrams bounded to `~320px` height so before/after panels align without requiring vertical scrolling.
