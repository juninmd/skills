# documentation Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `ai-writing-tells/ai-writing-tells.md` | Strip AI writing tells from prose (README, CHANGELOG, PR body, post-mortem) without adding or dropping a claim: [ai-writing-tells](ai-writing-tells/ai-writing-tells.md) (blader/humanizer, MIT; see [UPSTREAM.md](ai-writing-tells/UPSTREAM.md)) |
| `ascii-figures.md` | A figure must survive plain text or an unrendered host: picking the right ASCII/box-drawing form and keeping it inside a fixed column width: [ascii-figures](ascii-figures.md) |
| `code-snippet-images.md` | Deciding whether a code snippet should ship as an image at all, and keeping it short and secret-free when it does: [code-snippet-images](code-snippet-images.md) |
| `diagrams-as-code.md` | Converting a Mermaid block to a rendered image, but only after confirming the target host doesn't already render fenced `mermaid` itself: [diagrams-as-code](diagrams-as-code.md) |
| `docs-drift.md` | Doc tests/doctest verification, versioned docs for a breaking API change, OpenAPI spec drift from the implementation: [docs-drift](docs-drift.md) |
| `docs-verification.md` | A version-sensitive or unfamiliar API call, or a build error that contradicts expected behavior — verify against the installed version, not the declared range: [docs-verification](docs-verification.md) |
| `document-generation.md` | Generating or filling a PDF/DOCX/XLSX/PPTX programmatically — picking the library per language and preferring a template fill over building from scratch: [document-generation](document-generation.md) |
