---
name: documentation-extraction
description: |
  **DOCUMENTATION SKILL** - Generate and maintain API/code documentation as code using AI extraction and automation.
  USE FOR: API docs generation (OpenAPI → docs), code comment extraction, type-driven docs (JSDoc, Sphinx), AI-powered summaries.
  DO NOT USE FOR: manual content creation (use spec-first-design), marketing copy, visual design mockups.
  INVOKES: typedoc, swagger-ui, mkdocs, sphinx, docusaurus, extracting-context, developing-ai-agents.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Documentation Extraction & Automation

Expert methodology for maintaining documentation as code through API contracts, type exports, and AI-assisted content generation.

**USE FOR:**
- Generating API documentation from OpenAPI specs (Swagger UI, ReDoc, Spectacle).
- Extracting TypeScript/Python type definitions into markdown docs (TypeDoc, Sphinx).
- Auto-generating changelogs from commits and pull requests.
- Summarizing code modules with AI to build README sections and guides.
- Syncing docs with code via CI/CD validation (docs stale if code changes without update).

**DO NOT USE FOR:**
- Manual content creation without extraction/generation pipeline.
- Marketing or business documentation.
- Visual design and wireframing.

**INVOKES:**
- `typedoc`, `swagger-ui`, `mkdocs`, `sphinx`, `docusaurus`, `ai-extraction`, `contract-testing`.

## Methodology
Documentation is code-first: types are extracted, APIs are spec-driven, and prose is AI-assisted to reduce manual effort.

## Core Principles
1. **Single Source of Truth:** Types, API specs, and code comments are the source; docs are generated/validated.
2. **Automation:** All non-prose (parameter lists, type tables, API specs) is auto-generated and validated in CI.
3. **Freshness:** Docs versioning matches code versioning; breaking changes auto-flagged in changelog.

## Checklist
- [ ] API documentation generated from OpenAPI spec (Swagger UI, ReDoc, or Spectacle).
- [ ] Type definitions (JSDoc, TSDoc, Sphinx docstrings) extracted to markdown.
- [ ] README includes generated badges (test coverage, build status, npm version).
- [ ] Changelog auto-generated from commit messages (Conventional Commits + tooling).
- [ ] Code examples in docs are validated: linked to actual source files or runnable tests.
- [ ] Module-level docstrings (Python) or file comments (TypeScript) auto-extracted to docs.
- [ ] Breaking changes flagged during version bump; migration guides required for major versions.
- [ ] Docs site versioned (v1.0, v2.0); old versions remain accessible.
- [ ] CI/CD validates: OpenAPI spec matches implementation; docs examples run; no broken links.
