# Implementation Plan Template

> Created from specification: `.specify/specs/[feature]/spec.md`
> This plan translates requirements into technical architecture and implementation strategy.

## Header

- **Feature Branch**: `feature/[descriptive-identifier]`
- **Date Created**: [date]
- **Spec Location**: `.specify/specs/[feature]/spec.md`
- **Input Document**: [Where this plan came from]
- **Status**: `draft` | `review` | `approved` | `in-progress`

---

## Summary

**Primary Requirement**:
[Concise statement of the main requirement from the spec]

**Technical Approach**:
[High-level decision on how this will be implemented - language, framework, architecture pattern]

**Key Design Decisions**:
- **Decision 1**: [What] because [Why] vs Alternative [other approach]
- **Decision 2**: [What] because [Why] vs Alternative [other approach]

---

## Technical Context

### Environment & Dependencies

- **Language/Version**: [e.g., TypeScript 5.4, Python 3.11] [NEEDS CLARIFICATION if unknown]
- **Framework**: [e.g., Vue 3, FastAPI, Express.js]
- **Build Tool**: [e.g., Vite 5, tsc, esbuild]
- **Testing Framework**: [e.g., vitest, pytest, jest]
- **Runtime**: [e.g., Node.js 18+, Python 3.9+, Deno]
- **Package Manager**: [e.g., pnpm, pip, npm]

### Integration Points

- **External APIs**: [Which external services does this integrate with?]
- **Internal Services**: [Which services in the project does this depend on?]
- **Storage**: [Database type: SQLite, PostgreSQL, MongoDB, etc.]
- **Caching**: [If applicable: Redis, in-memory, etc.]

### Performance Goals

| Metric | Target |
|--------|--------|
| Response Time | [e.g., < 500ms for sync operations] |
| Bundle Size | [e.g., < 100KB gzipped] |
| Memory Usage | [e.g., < 50MB for CLI tool] |
| Concurrent Users | [Platform-dependent; N/A for CLI] |

### Constraints & Limitations

- **Security**: [Cannot store secrets in code, must use env vars]
- **Accessibility**: [WCAG 2.1 Level AA required for UI]
- **Browser Support**: [If applicable: Chrome 90+, Firefox 88+]
- **Platform Compatibility**: [Which platforms: Linux, macOS, Windows?]
- **Dependencies**: [Cannot add large dependencies, prefer built-in Node APIs]

---

## Architecture

### Project Structure

```
[feature-name]/
├── SKILL.md                    # Main documentation (for skills)
├── spec.md                     # Specification (in .specify/specs)
├── src/
│   ├── index.ts               # Entry point / main module
│   ├── [feature].ts           # Core implementation
│   ├── types.ts               # Type definitions
│   ├── utils/
│   │   └── [helper].ts
│   └── __tests__/
│       ├── [feature].test.ts
│       └── integration.test.ts
├── scripts/
│   └── [helper-script].ts     # CLI scripts (if applicable)
├── package.json               # Dependencies (if monorepo sub-package)
└── README.md                  # Quick start guide

```

### Design Patterns

**Pattern 1: [Name]**
- Used for: [What problem does this solve?]
- Example: [Real example from the codebase]
- Benefits: [Why this pattern?]

**Pattern 2: [Name]**
- [Similar structure]

---

## Data Model

> Define the structure of key data entities and relationships.

### Entity: [Primary Entity Name]

```typescript
// Type definition
interface [EntityName] {
  id: string;               // Unique identifier
  name: string;             // Human-readable name
  [property]: [type];       // [Description]
  created_at: Date;         // Timestamp
  updated_at: Date;         // Timestamp
}

// Storage schema (if persisted)
CREATE TABLE [entities] (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  [column] [type] [constraints],
  created_at DATETIME,
  updated_at DATETIME
);
```

### Relationships

```
[Entity1] 1 -- N [Entity2]
  ↳ [Entity1] can have multiple [Entity2]s
  ↳ [Entity2] belongs to one [Entity1]
```

---

## Constitution Check

> Verify this plan complies with the constitutional principles defined in `.specify/memory/constitution.md`

### Before Implementation Review
- [ ] **Skill-First Architecture**: Is this a standalone, reusable component?
- [ ] **Multi-Agent Compatibility**: Does it work across required platforms?
- [ ] **Specification-First**: Is the spec complete before we code?
- [ ] **Markdown-First**: Will documentation be in Markdown with proper frontmatter?
- [ ] **Test-Before-Merge**: Are tests being planned alongside implementation?

### After Implementation Review
- [ ] **All principles verified**: Re-check after implementation
- [ ] **Test coverage > 80%**: Verify with coverage reports
- [ ] **Documentation complete**: All artifacts updated
- [ ] **Catalog synced**: `node src/loader.js` has been run

### Constitutional Violations (if any)

| Violation | Justification | Alternative Rejected |
|-----------|---------------|----------------------|
| [Principle] | [Why it's necessary] | [Why simpler approach won't work] |

---

## Implementation Strategy

### Three-Phase Approach

#### Phase 1: Foundational Infrastructure
**Goal**: Build the base layer that enables all user stories

- Create project structure
- Set up testing framework
- Define type definitions
- Implement core utilities
- **Exit criteria**: Foundation tests pass, types compile

#### Phase 2: P1 User Stories
**Goal**: Implement primary user scenarios

- [User Story 1]: [Brief description]
- [User Story 2]: [Brief description]
- **Exit criteria**: All P1 scenarios tested and working

#### Phase 3: P2+ User Stories & Polish
**Goal**: Additional features, optimization, documentation

- [User Story]: [Brief description]
- Performance optimization
- Documentation completeness
- **Exit criteria**: All acceptance criteria met

### Parallel Work Opportunities

Tasks that can be executed in parallel:
- Setup and core types (foundation must complete first)
- [Task A] and [Task B] can work simultaneously (no dependency)
- [Task C] and [Task D] can work simultaneously

---

## Integration Points

### With Other Systems

| System | Integration Type | Impact |
|--------|-----------------|--------|
| [System A] | [Calls / Called by] | [What data exchanges?] |
| [System B] | [Calls / Called by] | [What data exchanges?] |

### Deployment Strategy

- **Build Process**: [How will this be packaged/deployed?]
- **Versioning**: [Semantic versioning, version bumping strategy]
- **Rollback Plan**: [How to revert if something breaks?]
- **Monitoring**: [What metrics/logs need to be tracked?]

---

## Testing Strategy

### Unit Tests
- Test: [Individual functions/classes]
- Framework: [e.g., vitest, pytest]
- Coverage Target: > 80%

### Integration Tests
- Test: [Feature working with dependencies]
- Approach: [Real database/API calls vs mocks]

### E2E Tests (if applicable)
- Test: [User workflows end-to-end]
- Framework: [e.g., Cypress, Playwright]

### Manual Testing Checklist
- [ ] [User story 1 works as expected]
- [ ] [Edge case handled properly]
- [ ] [Error messages are helpful]

---

## Success Metrics

> How will we know this implementation is successful?

1. **Functional**: All acceptance criteria from spec are met
2. **Quality**: Test coverage > 80%, no critical linting issues
3. **Performance**: Meets performance goals defined above
4. **Documentation**: Catalog entries accurate, examples working
5. **Compatibility**: Works on all required platforms

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| [Risk description] | [If it happens, what breaks?] | [How to prevent/handle?] |

---

## Timeline Estimates

> Rough estimates for planning only - not commitments

| Phase | Tasks | Est. Duration |
|-------|-------|----------|
| Foundation | Setup, types, utils | 2-4 hours |
| P1 Stories | [Story 1, 2, 3] | 6-8 hours |
| P2 Stories | [Story 4, 5] | 4-6 hours |
| Polish | Docs, optimization | 2-3 hours |
| **Total** | | **14-21 hours** |

---

## References & Resources

- **Specification**: `.specify/specs/[feature]/spec.md`
- **GitHub Issues**: [Link to related GitHub issues]
- **Design Docs**: [Link to architecture diagrams]
- **External Docs**: [Links to framework/library documentation]
