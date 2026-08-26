---
name: document-generation
description: |
  Generate and inspect Office and PDF documents programmatically. Use for docx, xlsx, pptx, and pdf creation, templating, tables, charts, formatting, and document extraction.
---

# Document Generation

## Preflight
```bash
ls *.docx *.xlsx *.pptx templates/ 2>/dev/null    # is there a template to fill?
python -c 'import docx, openpyxl; print("ok")' 2>/dev/null
pdftotext -v 2>&1 | head -1                       # text layer available?
```

Filling an existing template preserves styles, headers, and numbering. Generating from scratch loses all of them, permanently.

## Workflow
1. Identify the format, the template, the data source, and the output structure before writing code.
2. Pick the library for the repository's language (below).
3. **Prefer filling an existing template** over building from scratch.
4. Build the remaining content from data structures, never string concatenation. Keep styling in shared constants; give every table, chart, and image explicit dimensions.
5. Verify by reading the generated file back and asserting content, counts, and layout.

## Library by Language

| Format | Node | Python |
|---|---|---|
| Word | `docx` | `python-docx` |
| Excel | `exceljs` | `openpyxl` |
| PowerPoint | `pptxgenjs` | `python-pptx` |
| PDF (generate) | render HTML → `puppeteer` | `weasyprint`, or convert a docx |
| PDF (extract) | `pdf-parse` | `pdfplumber` |

## Template Over Scratch
Opening the shipped file and replacing placeholder runs and table rows **preserves its styles, headers, numbering, and theme**. Regenerating from scratch loses all of them, and the result looks obviously machine-made in a way nobody can quite fix afterwards.

```python
doc = Document('template.docx')           # keeps every style definition
for p in doc.paragraphs:
    if '{{customer}}' in p.text:
        for run in p.runs:                # replace at RUN level, not paragraph
            run.text = run.text.replace('{{customer}}', name)
doc.save('out.docx')
```

Replacing `paragraph.text` wholesale destroys the run structure and with it every inline format — bold, links, footnote marks.

## Extraction Traps

| Trap | Symptom | Handling |
|---|---|---|
| PDF with no text layer (a scan) | extraction returns empty strings, no error | detect near-zero characters, route through OCR (`tesseract`, `ocrmypdf`) |
| PDF has no row model | tables come back as loose text | extract tables separately, and assert the shape |
| Spreadsheet formula vs cached value | `=SUM(A1:A9)` or a stale number, or `None` | choose deliberately: `openpyxl(data_only=True)`; assert not null |
| Merged cells | values appear only in the top-left | normalize before reading |
| Multi-page tables | header repeats mid-data | drop repeated header rows explicitly |

A silent empty extraction is the dangerous one — it reports success and produces an empty report.

## Formula Injection
Any cell value starting with `=`, `+`, `-`, or `@` becomes an executable formula when the file is opened. A user-supplied name of `=HYPERLINK("http://evil","click")` is a live payload in the recipient's spreadsheet.

```python
if isinstance(v, str) and v[:1] in '=+-@':
    v = "'" + v          # leading apostrophe forces text
cell.value = v
```

## Verify by Parsing

```python
out = Document('out.docx')
assert len(out.tables[0].rows) == len(rows) + 1        # +1 for the header
assert '{{' not in '\n'.join(p.text for p in out.paragraphs)   # no placeholder survived
```

Visual inspection misses the unfilled placeholder on page 7.

## Stop
- Untrusted input would be written to a cell without neutralizing `=`, `+`, `-`, `@`. That is formula injection in the recipient's machine.
- Extraction returned near-zero characters. It is a scan — route through OCR; never report an empty document as empty.
- A font used in a PDF is not embedded. Pagination will shift silently on another machine.

## Rules
- Pin the generation library version. Document formats and library behavior drift across releases, and the failure is a subtly malformed file rather than an error.
- For PDF output, embed every font used. A missing font substitutes silently, shifting metrics and breaking pagination — assert the page count after generation.
- Give images and tables explicit dimensions; a document that reflows differently per viewer is not a deliverable.
- Never inline a secret, an internal hostname, or customer data into a template that will be shared.
- Authoring the content itself belongs to `documentation`; charts and data shaping to `data-analysis`.

## Checklist
- [ ] Format, template, and data source explicit before coding.
- [ ] Template filled at run level; styles, headers, and numbering preserved.
- [ ] Untrusted input neutralized against formula injection.
- [ ] Extraction handles the scanned PDF and the cached-value spreadsheet cases.
- [ ] Fonts embedded; page count asserted for PDF output.
- [ ] Output verified by parsing it back — no placeholder survived.
