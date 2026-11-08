# Hero Image

Open this file when the README has no header image, or the existing one is generic.

## What it must show

The image answers "what does this do" before the reader reads a word. Pick the figure from the project, not from a stock style.

| Project | Composition |
|---|---|
| UI app | the real main screen, cropped, inside a simple browser or device frame, with the name and tagline on one side |
| CLI or TUI | a terminal window with the real command and a shortened real output |
| Library | a short real code snippet on the left, its result on the right |
| Service or pipeline | three to five boxes showing input, the service, and output |

## Format

- 1280×640 (2:1), which also fits GitHub's social preview. Text no smaller than 28 px at that size so it survives mobile.
- Prefer SVG for drawn headers: crisp, small, diffable. Use PNG for headers built from a real screenshot.
- Text in SVG uses a system font stack (`system-ui, -apple-system, Segoe UI, sans-serif`) or is converted to paths; GitHub does not load web fonts in images.
- Provide a dark variant (`readme-header-dark.svg`) when the light one has a white background, and switch with `<picture>`.
- Under 1 MB. Store at `.github/assets/readme-header.svg`.

## Minimal SVG skeleton

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <rect width="1280" height="640" rx="24" fill="#0f172a"/>
  <text x="80" y="260" fill="#f8fafc" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="72" font-weight="700">ProjectName</text>
  <text x="80" y="330" fill="#94a3b8" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="32">What it does, in one line</text>
  <!-- right half: the real screen, terminal, snippet, or flow -->
  <rect x="680" y="120" width="520" height="400" rx="16" fill="#1e293b"/>
</svg>
```

Embed a real screenshot in an SVG with `<image href="data:image/png;base64,...">` only when the result stays under 1 MB; otherwise compose a PNG.

## Verify

```bash
file .github/assets/readme-header.*
du -h .github/assets/readme-header.*
npx --yes playwright screenshot --viewport-size=1280,640 "file://$PWD/.github/assets/readme-header.svg" /tmp/header-check.png
```

Look at the rendered PNG: text legible, nothing clipped, contrast readable in both themes.
