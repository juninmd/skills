---
name: trailmark-summary
description: |
  **DIAGNOSTIC SKILL** - Generate structural codebase overviews using Trailmark.
  USE FOR: structural analysis, language detection, entry point enumeration, dependency graph mapping, orientation on new codebases.
  DO NOT USE FOR: detailed code graph queries, hotspot/taint analysis (use full Trailmark pass), fixing bugs (use diagnosing-bugs).
  INVOKES: trailmark analyze --summary, uv run trailmark.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [run_shell_command, read_file]
---

# Trailmark Summary

Expert methodology for performing rapid structural analysis of codebases to identify primary languages, entry points, and dependency interactions using the Trailmark CLI.

**USE FOR:**
- Getting a quick structural overview before deeper decomposition.
- Detecting primary languages and entry point counts for reviews.
- Orienting on unfamiliar codebases before starting detailed analysis.
- Mapping high-level module dependencies.

**DO NOT USE FOR:**
- Full structural analysis when all passes are required.
- Detailed taint tracking or performance hotspot identification.

**INVOKES:**
- `trailmark analyze --summary` commands.

## Methodology and Guidelines
Implementation details for setup, language detection, and workflow are documented in:
1. [Setup & Language Detection](references/trailmark-setup.md)
2. [Summary Workflow](references/trailmark-workflow.md)

## Core Principles
1. **Tool Integrity:** Never skip trailmark installation checks or primary language detection.
2. **Completeness:** Ensure the output contains language, entry points, and graph shape.
3. **Escalation:** Move to a full analysis pass if the summary provides insufficient depth.

## Checklist
- [ ] Confirm target directory and detect the primary language before execution.
- [ ] Verify that the output includes all three mandatory structural metrics.
- [ ] Report the specific installation gap if the tool is not found.
- [ ] Validate findings against local `AGENTS.md` and `README.md` conventions.
