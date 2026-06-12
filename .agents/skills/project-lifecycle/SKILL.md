---
name: project-lifecycle
description: "Comprehensive Project Lifecycle covering Planning, PRDs, Issue Tracking, Execution, and Git/GitHub Workflows."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Git, GitHub"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Project Lifecycle & Git Workflows

Expert methodology for managing the end-to-end software development lifecycle. This skill unifies spec-first design, creating Product Requirement Documents (PRDs), breaking down work into issues, execution planning, Git worktree management, GitHub issue triage, and PR finalization.

**USE FOR:**
- Creating validated design specs (Spec-First) and converting them into PRDs.
- Breaking plans into independently executable GitHub issues (Vertical Slicing).
- Applying Karpathy's guidelines to simplify tasks and reduce execution errors.
- Executing complex, multi-step implementation plans.
- Triaging GitHub issues (labels, reproduction, out-of-scope management).
- Managing isolated branches via Git worktrees.
- Finalizing development work (squashing commits, creating PRs via `gh` CLI).

**DO NOT USE FOR:**
- Writing actual code implementations (use `backend-*` or `frontend-engineering`).
- Setting up CI/CD pipelines (use `cloud-devops`).

**INVOKES:**
- `git`, `gh cli`, markdown generation, planning templates.

## Core Principles
1. **Plan Before Acting:** Validate designs and requirements before writing code.
2. **Vertical Slices:** Break work into small, testable, end-to-end features.
3. **Branch Isolation:** Use worktrees to prevent context pollution during concurrent development.
4. **Traceability:** Every commit should trace back to an issue, and every issue to a PRD.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Spec-First Design & PRDs](references/spec-first-design.md)
- [Issue Breakdown & Triage](references/issue-management.md)
- [Execution & Karpathy Guidelines](references/execution-guidelines.md)
- [Git Worktrees & Branch Management](references/git-workflows.md)
- [GitHub CLI & PR Finalization](references/github-workflows.md)

## Checklist
- [ ] Ensure the PRD or spec is fully validated before creating issues.
- [ ] Confirm that each generated issue represents a single, verifiable vertical slice.
- [ ] Use a clean Git worktree for new feature development.
- [ ] Verify that all commits are squashed logically before opening a PR.
