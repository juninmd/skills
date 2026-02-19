# Tasks Template

> Generated from: `.specify/specs/init-padrao-labs/plan.md`
> This document breaks the implementation plan into actionable, dependency-tracked tasks.

## Format & Instructions

**Task Notation**:
- `[ID]` - Unique task identifier (e.g., TASK-001)
- `[P]` - Indicates this task is parallelizable (can be done simultaneously with others at same level)
- `[US#]` - User story reference (which acceptance criterion this addresses)
- `[depends: TASK-XXX]` - Prerequisites that must complete first

**Example**:
```
TASK-015 [P] [US2] Create database models [src/models/] [depends: TASK-005]
```

**Execution Rules**:
1. Complete prerequisites before starting
2. Run tests after each task: `pnpm test:run`
3. Commit working code: `git add . && git commit -m "[TASK-XXX] [description]"`
4. Mark task complete before moving to next

---

## Overview

- **Feature**: init-padrao-labs
- **Spec**: `.specify/specs/init-padrao-labs/spec.md`
- **Plan**: `.specify/specs/init-padrao-labs/plan.md`
- **Total Tasks**: [Count of all tasks]
- **Estimated Duration**: [From plan]
- **Start Date**: [When work begins]

---

## Phase 1: Foundation Setup

**Goal**: Create project structure and base infrastructure (MUST complete before any user stories)

### Environment & Structure
- **TASK-001**: Create directory structure and configuration files [.specify/specs/init-padrao-labs/] [depends: none]
- **TASK-002**: Set up package.json, tsconfig, and build configuration [.specify/specs/init-padrao-labs/] [depends: TASK-001]
- **TASK-003**: Initialize testing framework (vitest, @vue/test-utils if needed) [test/setup.ts] [depends: TASK-002]
- **TASK-004**: Create type definitions and interfaces [src/types.ts] [depends: TASK-002]

### Foundation Tests
- **TASK-005**: [P] Create foundation test suite (verify types, imports, setup) [src/__tests__/setup.test.ts] [depends: TASK-003, TASK-004]

### **CHECKPOINT Phase 1**
```
✓ TASK-001 through TASK-005 complete
✓ All foundation tests passing (pnpm test:run)
✓ No TypeScript errors (pnpm docs:build generates no errors)
→ Proceed to Phase 2 only after checkpoint verification
```

---

## Phase 2: P1 User Story - [Primary User Story Name]

**Goal**: Implement primary user scenarios

**Acceptance Criteria from Spec**:
```gherkin
Given [precondition]
When [action]
Then [outcome]
```

### Core Implementation
- **TASK-006**: Implement [core component/function] [src/init-padrao-labs.ts] [depends: TASK-005]
  - What: [Specific implementation details]
  - Why: [Why this approach]
  - Test: [How to validate]

- **TASK-007**: [P] Implement [supporting component] [src/utils/[helper].ts] [depends: TASK-005]
  - What: [Details]
  - Test: [Validation approach]

- **TASK-008**: Create unit tests for P1 implementation [src/__tests__/init-padrao-labs.test.ts] [depends: TASK-006, TASK-007]
  - Test coverage target: > 80%
  - Key scenarios to test: [List specific test cases]

- **TASK-009**: Integrate with platform APIs [src/platforms/] [depends: TASK-006]
  - Platforms: [Which ones: gemini_cli, copilot, etc.]
  - Integration type: [Direct calls, wrapper functions, etc.]

- **TASK-010**: Create integration tests [src/__tests__/integration.test.ts] [depends: TASK-009]
  - Test: Real platform integration (if possible)
  - Fallback: Mock API responses

### Documentation for P1
- **TASK-011**: Create SKILL.md / documentation [SKILL.md] [depends: TASK-006]
  - Sections: Installation, Usage, Examples, API Reference
  - Frontmatter: name, description, works_on, tags

- **TASK-012**: [P] Create usage examples and guides [docs/examples/] [depends: TASK-011]

### **CHECKPOINT Phase 2 - P1 Complete**
```
✓ TASK-006 through TASK-012 complete
✓ All P1 acceptance criteria verified
✓ Unit test coverage > 80%
✓ Integration tests passing
✓ Documentation complete with examples
→ Proceed to Phase 3 after checkpoint verification
```

---

## Phase 3: P2+ User Stories & Polish

**Goal**: Additional features, optimization, documentation completion

### P2 Scenarios (if any)
- **TASK-013**: [P2 User Story 1] implementation [src/[feature-p2].ts] [depends: TASK-012]

- **TASK-014**: [P2 User Story 2] implementation [src/[feature-p2].ts] [depends: TASK-012]

- **TASK-015**: Tests for P2 scenarios [src/__tests__/[feature-p2].test.ts] [depends: TASK-013, TASK-014]

### Performance & Optimization
- **TASK-016**: [P] Performance profiling and optimization [src/] [depends: TASK-015]
  - Measure: [Current baseline]
  - Target: [Performance goal from plan]
  - Optimization: [Expected improvements]

- **TASK-017**: [P] Bundle size analysis and optimization (if applicable) [src/] [depends: TASK-016]
  - Current size: [If known]
  - Target: [Goal from plan]

### Accessibility & Quality
- **TASK-018**: [P] Accessibility review (WCAG 2.1 AA if UI component) [src/components/] [depends: TASK-012]

- **TASK-019**: [P] Code style and linting fixes [src/] [depends: TASK-015]
  - Run: `pnpm lint:md` and address all issues

### Catalog Integration
- **TASK-020**: Update catalog metadata and run generator [.agents/] [depends: TASK-011]
  - Command: `node src/loader.js`
  - Verify: Catalog entry appears in docs/catalog.json

### Final Validation
- **TASK-021**: Run full test suite and build [all tests + docs build] [depends: TASK-020]
  - Commands: `pnpm test:run && pnpm docs:build`
  - Expected: Zero errors, all tests pass

---

## Phase 4: Review & Merge

**Goal**: Get approval from maintainers and merge to main

### Code Review Prep
- **TASK-022**: Prepare pull request [.github/pull_requests/] [depends: TASK-021]
  - Title: `[Feature] [Short description]`
  - Description: Summary of changes, testing instructions
  - Checklist: Verify all constitutional principles

- **TASK-023**: Request reviews from maintainers [GitHub PR] [depends: TASK-022]
  - Required approvals: 1+ maintainers
  - CI/CD checks: Must pass (tests, linting, build)

### Post-Approval
- **TASK-024**: Address review feedback if any [varies] [depends: TASK-023]
  - Re-run tests after changes
  - Update documentation if requested
  - Push updates to PR branch

- **TASK-025**: Merge to main branch [git merge] [depends: TASK-024 or TASK-023 if approved]
  - Command: `git checkout main && git merge feature/[branch]`
  - Delete feature branch: `git branch -d feature/[branch]`

- **TASK-026**: Deploy to production [CD pipeline] [depends: TASK-025]
  - Via: CI/CD pipeline (automated on merge to main)
  - Verify: Docs site updated, new entries visible

---

## Task Dependencies Graph

```
TASK-001 → TASK-002 → TASK-003, TASK-004
                         ↓
                      TASK-005
                         ↓
              TASK-006, TASK-007 [Parallel]
                         ↓
              TASK-008, TASK-009 [Parallel]
                         ↓
              TASK-010, TASK-011, TASK-012 [Mostly Parallel]
                         ↓
              TASK-013, TASK-014 [P2 Parallel]
                         ↓
           TASK-015, TASK-016, TASK-017, TASK-018, TASK-019 [Parallel]
                         ↓
                      TASK-020
                         ↓
                      TASK-021
                         ↓
           TASK-022, TASK-023, TASK-024, TASK-025, TASK-026 [Linear]
```

---

## Execution Checklist

### Before Starting
- [ ] Create feature branch: `git checkout -b feature/init-padrao-labs`
- [ ] Review spec and plan documents
- [ ] Understand all acceptance criteria

### During Implementation
- [ ] Complete tasks in dependency order
- [ ] Run tests after each task: `pnpm test:run`
- [ ] Commit after each logical unit: `git commit -m "[TASK-XXX] [description]"`
- [ ] Update task status in this document

### After Each Phase
- [ ] Run full test suite: `pnpm test:run`
- [ ] Verify build: `pnpm docs:build`
- [ ] Verify code quality: `pnpm lint:md`
- [ ] Confirm checkpoint criteria met

### Before Pulling
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Catalog regenerated: `node src/loader.js`
- [ ] Create meaningful commit messages

---

## Task Status Tracking

Use this table to track progress:

| Task ID | Status | Assigned To | Notes |
|---------|--------|-------------|-------|
| TASK-001 | [ ] pending | [ ] | |
| TASK-002 | [ ] pending | [ ] | |
| TASK-003 | [ ] pending | [ ] | |
| TASK-004 | [ ] pending | [ ] | |
| TASK-005 | [ ] pending | [ ] | |
| TASK-006 | [ ] pending | [ ] | |
| TASK-007 | [ ] pending | [ ] | |
| TASK-008 | [ ] pending | [ ] | |
| ... | ... | ... | |

---

## Notes

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Tests failing after changes | Re-run `pnpm test:run` and check error messages |
| Type errors in TypeScript | Run `npm run docs:build` to see full errors |
| Build size too large | Import only what you need, check for unused dependencies |
| Catalog not updating | Run `node src/loader.js` after updating metadata |

### Questions During Implementation

- [Question 1]: [Answer from team]
- [Question 2]: [Answer from team]

### Decisions Made During Implementation

- [Decision 1]: [Context and rationale]
- [Decision 2]: [Context and rationale]
