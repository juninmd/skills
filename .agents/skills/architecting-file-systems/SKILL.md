---
name: architecting-file-systems
description: Manage, organize, and optimize complex project directory structures and file organization patterns
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Skill: File System Architect

## Description
This skill empowers the agent to manage, organize, and optimize complex project structures. It provides specialized knowledge and workflows for creating scalable, maintainable, and standard-compliant directory hierarchies and file organization patterns.

## Capabilities
- Design scalable directory structures for various project types (Web, Mobile, Data Science, etc.).
- Refactor existing file systems for better organization and separation of concerns.
- Identify and remove redundant or misplaced files.
- Enforce naming conventions and project-specific organizational standards.
- Generate boilerplate structures for new modules or components.

## Usage
1. **Analyze:** Examine the current project structure using directory listing tools.
2. **Design:** Propose an optimized structure based on project requirements and industry best practices.
3. **Execute:** Create directories, move files, and organize assets according to the approved architecture.
4. **Maintain:** Periodically review the structure to prevent "folder rot" and ensure ongoing compliance.

## Constraints
- Always verify the impact of structural changes on build systems and imports.
- Do not delete files without explicit confirmation or backup.
- Adhere to the specific conventions of the target framework (e.g., Next.js App Router, Clean Architecture).
