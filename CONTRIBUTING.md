# Contributing to Luizalabs Agents & Skills Catalog

Thank you for your interest in contributing to the Luizalabs Agents & Skills Catalog! This project aims to centralize high-quality AI agent configurations, skills, and development standards.

By contributing, you help improve the productivity and consistency of our engineering teams.

---

## 1. Core Principles & Governance

All contributions to this repository must adhere to our core project constitution:

1.  **Skill-First Architecture:** Every feature should be a standalone, reusable module.
2.  **Multi-Agent Compatibility:** Skills and rules must work across Gemini, Copilot, Claude, Cursor, and other AI coding assistants.
3.  **Specification-First Development:** We strictly use **Specification-Driven Development (SDD)**. Write specs before code.
4.  **Markdown-First Documentation:** All artifacts and communications use Markdown.
5.  **Test-Before-Merge Imperative:** Tests and validations are required before merging any PR.
6.  **English Only:** All content (Skills, Agents, Rules, Documentation, Code) MUST be written in **English**. This ensures optimal performance across LLMs, consistent tokenization, and superior reasoning accuracy.

---

## 2. Specification-Driven Development (SDD) Workflow

For anything beyond a simple typo fix, you must follow the SDD workflow. We use AI agents to help us plan, clarify, and execute changes.

### Step 1: Initialize the Specification
Before writing code, scaffold a new feature specification:
```bash
pnpm spec:init [feature-name]
```
This will create a folder in `.specify/specs/[feature-name]/` containing templates for `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.

### Step 2: Write the Spec
Edit `.specify/specs/[feature-name]/spec.md`. Define the user scenarios, functional requirements, and success criteria. Do not write implementation details here.

### Step 3: Plan & Task Breakdown (with your AI Agent)
Use your preferred AI agent (Claude, Gemini, Copilot) to help clarify the spec and break it down into tasks. You can prompt your agent with:
> *"Follow the workflow in .agent/workflows/sdd-new-feature.md for the feature [feature-name]"*

### Step 4: Implementation
Implement the tasks strictly one at a time, checking off the items in `.specify/specs/[feature-name]/tasks.md`.
```bash
git checkout -b feature/[feature-name]
# ... write code for TASK-001 ...
pnpm test:run
git add .
git commit -m "[TASK-001] Brief description of what was implemented"
```

### Step 5: Validation & Quality Gates
Before opening a Pull Request, you must validate your specs and code:
```bash
pnpm spec:check        # Validates spec status
pnpm test:run          # Runs unit and integration tests (>80% coverage required)
pnpm lint:md           # Checks markdown formatting
pnpm lint:skills       # Validates skills against agentskills.io schema
node src/loader.js     # Regenerates the documentation catalog
pnpm docs:build        # Ensures the VitePress documentation builds successfully
```

---

## 3. Creating and Formatting Skills

If you are contributing a new **Skill**, it must be placed in `.agent/skills/` and strictly follow these standards:

### Specification (agentskills.io)
*   **Directory Structure:** Every skill must be a self-contained folder.
*   **Frontmatter:** `SKILL.md` must start with YAML frontmatter containing `name` and `description`.
*   **Name Match:** The `name` in the YAML frontmatter must exactly match the directory name.

### Anthropic Best Practices
*   **Action-Oriented Naming:** Use **gerunds** for skill directory names and frontmatter (e.g., `auditing-code` instead of `code-auditor`, `managing-aws` instead of `aws-manager`).
*   **Conciseness & Progressive Disclosure:** Keep `SKILL.md` under 500 lines. Move large templates, reference lists, or forms to separate files in `assets/` or `references/`.
*   **Nesting:** Keep file references only one level deep from `SKILL.md` so the LLM doesn't lose context.
*   **Third Person:** Write descriptions and instructions in the third person.
*   **Solving Problems (Executable Code):** If your skill includes scripts in `scripts/`, they should handle their own errors and print clear, actionable outputs for the agent.

---

## 4. Submitting a Pull Request (PR)

1.  Push your `feature/[feature-name]` branch to origin.
2.  Open a Pull Request against the `main` branch.
3.  **Title:** Use Conventional Commits (e.g., `feat(skills): add managing-redis skill`).
4.  **Description:** Reference the spec document (`.specify/specs/[feature-name]/spec.md`) and briefly explain the changes.
5.  **Review:** At least one maintainer must review and approve your PR.
6.  **CI/CD:** Ensure all automated GitHub/GitLab actions pass successfully.

---

## 5. Coding Conventions

*   **File Paths:** Use **Forward Slashes (`/`)** for all file paths, even if you are on Windows. This is crucial for LLM path resolution.
*   **Indentation:** Use 2 spaces for YAML and Markdown.
*   **Package Manager:** Always use `pnpm` for installing dependencies and running scripts.

Thank you for helping us build an incredible ecosystem for AI-augmented development!

*Luizalabs · Magalu*
