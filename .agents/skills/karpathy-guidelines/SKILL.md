---
name: karpathy-guidelines
description: "Karpathy Guidelines for Resolving requirements, Reducing technical, Minimizing regression via Multi-step validation plans and falsifiable verification steps."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace]
---

# Karpathy Guidelines

Expert behavioral methodology derived from Andrej Karpathy's observations on LLM pitfalls, biasing toward caution, simplicity, and surgical precision in code changes.

**USE FOR:**
- Resolving requirements before implementation through "Thinking First".
- Reducing technical debt by enforcing "Simplicity First" and rejecting speculative features.
- Minimizing regression risk through "Surgical Changes" that touch only necessary lines.
- Driving completion through "Goal-Driven Execution" with explicit success criteria.

**DO NOT USE FOR:**
- Routine, low-risk edits where speed is the primary constraint.
- Tasks unrelated to software engineering or code modification.

**INVOKES:**
- Multi-step validation plans and falsifiable verification steps.

## Methodology and Guidelines
Implementation details for thinking, simplicity, and surgical precision are documented in:
- [Karpathy Coding Methodology](references/karpathy-methodology.md)

## Core Principles
1. **Caution over Speed:** Prefer extra turns for clarification over incorrect implementation.
2. **Minimalism:** Every line must trace directly to a user requirement.
3. **Verification:** Changes are incomplete until behavioral correctness is proven.

## Checklist
- [ ] Explicitly state assumptions and success criteria before implementation.
- [ ] Minimize the change surface to only the lines required for the task.
- [ ] Ensure all edits match the existing codebase style and formatting.
- [ ] Verify that your changes did not introduce new orphans or unused code.
