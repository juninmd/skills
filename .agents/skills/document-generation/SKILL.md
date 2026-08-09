---
name: document-generation
description: |
  Generate and inspect Office and PDF documents programmatically. Use for docx, xlsx, pptx, and pdf creation, templating, tables, charts, formatting, and document extraction.
---

# Document Generation

## Workflow
1. Identify the required format, template, data source, and output structure before coding.
2. Choose the library for the repo language: `docx`/`xlsx`/`pptx` for Node, `python-docx`/`openpyxl`/`python-pptx` for Python.
3. Build documents from data structures, not string concatenation; separate content from styling.
4. Add tables, charts, and images with explicit dimensions and shared styles.
5. Verify the output by reading the generated file back programmatically and asserting content, counts, and layout.

## Rules
- Never interpolate untrusted input directly into spreadsheets (formula injection in xlsx).
- Keep styling in shared constants; avoid per-cell ad-hoc formatting.
- Validate by parsing the output, not by visual inspection alone.
- Pin the generation library version; document formats drift across releases.

## Checklist
- [ ] Format, template, and data source are explicit.
- [ ] Styling is centralized; untrusted input is safe.
- [ ] Output verified by reading the file back.
