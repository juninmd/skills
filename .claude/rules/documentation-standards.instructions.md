---
name: documentation-standards
description: Documentation standards including README formatting, architecture documentation, and release notes.
applyTo: '**/*.md'
paths:
  - "**/*.md"
trigger: glob
globs: "**/*.md"
---

# Rule: Documentation Standards

## 1. README.md (Mandatory at root)
- Every project must have a `README.md` at the root.
- **Required Sections**:
  - App description and core features.
  - Architecture overview.
  - Setup and usage instructions.
  - Environment variables definitions.
  - Run, build, and test commands.

## 2. Technical Writing
- Use clear, professional, and concise language.
- Structure with clear headings and bullet points for readability.
- Maintain a `CHANGELOG.md` or Release Notes to document major versions and breaking changes.
