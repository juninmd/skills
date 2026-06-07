---
name: edit-article
description: |
  **WRITING SKILL** - Edit technical articles and blog posts for clarity, coherence, and flow.
  USE FOR: when user provides a draft article or post and asks for editing, proofreading, or improvement.
  DO NOT USE FOR: writing articles from scratch, code documentation, README files.
  INVOKES: section-by-section revision with 240-char paragraph constraint.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Edit Article

Edit a technical article or blog post for clarity, coherence, and flow.

## Phase 1 — Structure analysis

1. Divide the article into sections based on headings.
2. Map information dependencies — which sections rely on concepts introduced in other sections.
3. Verify the section order respects these dependencies (prerequisites appear before dependents).
4. Present the structure to the user and confirm before editing:
   > "I've identified [N] sections. The order is [list]. Does this look right before I start editing?"

## Phase 2 — Section-by-section revision

For each section in order:

1. Rewrite to enhance **clarity, coherence, and flow**.
2. Preserve the author's voice and intent — improve, don't replace.
3. Apply the **240-character limit per paragraph** — if a paragraph exceeds this, split it at a natural sentence boundary.
4. Check that the section logically follows from the previous one.
5. Present the revised section to the user before moving to the next.

## Editing principles

- **Clarity:** each sentence should have one clear subject and one clear action.
- **Coherence:** ideas within a paragraph must connect; use transitions between paragraphs.
- **Flow:** vary sentence length; avoid starting consecutive sentences with the same word.
- **240-char limit:** forces shorter paragraphs which are easier to scan and digest.

## What NOT to change

- Technical accuracy — do not rewrite technical claims unless they are clearly wrong
- Code samples — format only, never change behavior
- Author's chosen terminology — suggest alternatives but don't force them
- The article's thesis or conclusions

## Output

Present each revised section inline. After all sections, offer a final full-article render if the user wants to review the complete edited version.

## Checklist

- [ ] Structure analyzed and presented to user before editing begins.
- [ ] Section order respects information dependencies.
- [ ] Each paragraph stays within 240 characters.
- [ ] Author's voice and technical accuracy preserved.
- [ ] Code samples unchanged (format only if needed).
- [ ] Each section presented to user before moving to the next.
