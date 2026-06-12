---
name: tooling-dev
description: "Comprehensive Tooling Development covering CLI design, Internal tools, and Documentation extraction."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Tooling & CLI Development

Expert methodology for building production-grade internal tools, CLI applications, and automated documentation extraction systems. This skill unifies CLI design patterns, automation scripting, and documentation-as-code.

**USE FOR:**
- Designing and implementing CLI applications (Commander, Typer, Click).
- Building automation scripts for developer workflows.
- Implementing documentation extraction from code (JSDoc, Javadoc, Sphinx).
- Creating interactive prompts, progress bars, and structured logs for CLI tools.

**DO NOT USE FOR:**
- General web backend development (use `backend-*`).
- Frontend UI development (use `frontend-engineering`).

**INVOKES:**
- CLI frameworks, regex, documentation generators.

## Core Principles
1. **User Experience (UX):** CLIs are interfaces; prioritize help text, intuitive flags, and meaningful errors.
2. **Fail Loudly:** Return appropriate exit codes and clear error messages to stderr.
3. **Automation-Friendly:** Support non-interactive modes (`--yes`, `--quiet`) for CI/CD usage.
4. **Self-Documenting:** Documentation should be derived from the code whenever possible.

## Checklist
- [ ] Verify that `--help` provides clear and accurate information.
- [ ] Ensure the tool handles invalid input gracefully with a non-zero exit code.
- [ ] Test the tool in a non-interactive environment.
- [ ] Validate that extracted documentation is complete and correctly formatted.
