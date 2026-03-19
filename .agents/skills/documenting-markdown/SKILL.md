---
name: documenting-markdown
description: Gerar documentação de alta qualidade em Markdown a partir do código-fonte, incluindo READMEs, referências de API e guias técnicos.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Skill: Markdown Documenter

## Description
This skill enables the agent to automatically generate high-quality Markdown documentation from source code. It analyzes code structures, comments, and metadata to produce READMEs, API references, and technical guides.

## Capabilities
- Parse source code files to extract classes, functions, and docstrings.
- Generate structured Markdown reports.
- Create README.md templates based on project structure.
- Format technical documentation according to best practices.

## Usage
1. **Analyze:** Read source files and identify key components.
2. **Transform:** Map code structures to Markdown sections (e.g., functions to "API Reference").
3. **Refine:** Enhance generated text with descriptions and usage examples.

## Constraints
- Focus on clarity and readability.
- Maintain consistent formatting.
- Respect existing documentation styles if present.
