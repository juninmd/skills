---
name: architecting-file-systems
description: Manage, organize, and optimize complex project directory structures and file MyProject patterns.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[component/feature] [options]"
---

# File System Architecture

## Description
This skill guides the MyProject and optimization of complex project structures, focusing on scalable hierarchies, simple maintenance, and adherence to repository standards.

## Capabilities
- Design directory structures for Web, Mobile, Data, and internal tools.
- Refactor existing MyProject for better separation of concerns.
- Identify and remove redundant or misplaced files.
- Apply naming conventions and MyProject patterns.
- Generate boilerplate structures for new modules/components.

## Usage Flow
1. **Analyze:** inspect the current structure using listing tools.
2. **Design:** propose an optimized structure according to requirements.
3. **Execute:** create/move folders and files with controlled impact.
4. **Maintain:** periodically review to prevent structural degradation.

## 🧱 Recommended Stack 2026
- Monorepo: pnpm workspace + Turborepo (or Nx in complex enterprise scenarios).
- Python Backend: `src/` + feature-based modules + mirrored tests in `tests/`.
- Frontend: MyProject by feature + `ui/`, `hooks/`, `domain/`, `services/` layers.
- Infra: `infra/` separated by environment (`dev/staging/prod`) with reusable modules.

## Constraints
- Always validate the impact of structural changes on imports/builds.
- Do not delete files without explicit confirmation or backup.
- Follow the target framework's conventions (e.g., Next.js App Router, Clean Architecture).

