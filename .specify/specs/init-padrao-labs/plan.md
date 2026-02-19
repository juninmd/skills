# Implementation Plan - Initialize Luizalabs Standard App

> Created from specification: `.specify/specs/init-padrao-labs/spec.md`
> This plan defines the technical implementation for automated app scaffolding.

## Header

- **Feature Branch**: `feature/init-padrao-labs`
- **Date Created**: 2026-02-19
- **Spec Location**: `.specify/specs/init-padrao-labs/spec.md`
- **Input Document**: agents.md (Diretrizes de Segurança e Qualidade)
- **Status**: `draft`

---

## Summary

**Primary Requirement**:
Provide a command-line tool that initializes new Luizalabs apps with all required files (Makefile, dependency.yaml, hangar-info.yaml, sonar.properties, .gitignore, Dockerfile, .gitlab-ci.yml, README.md) following standard templates.

**Technical Approach**:
Extend existing CLI tool with an `init` command that:
1. Prompts user for project metadata (name, owner, tribe, vertical, type)
2. Reads templates from `.specify/templates/`
3. Performs string replacements for project-specific values
4. Creates directory structure with all files
5. Validates generated files against constraints

**Key Design Decisions**:
- **Decision 1**: Use template files with [PLACEHOLDER] markers instead of programmatic generation → Reason: Easy to update standards, version controlled, visible diffs
- **Decision 2**: Implement as Node.js CLI tool (not Bash) → Reason: Cross-platform, better error handling, already used in project
- **Decision 3**: Store templates in `.specify/templates/` → Reason: Single source of truth, easy to maintain alongside specs

---

## Technical Context

### Environment & Dependencies

- **Language**: Node.js 18+ (ES Modules)
- **Runtime**: npm/pnpm scripts
- **Testing**: vitest (existing framework in package.json)
- **Build Tool**: esbuild (for bundling CLI if needed)
- **File I/O**: Built-in fs module (no external dependencies)

### Integration Points

- **CLI Entry**: `pnpm init` or CLI package bin script
- **Template Storage**: `.specify/templates/` directory
- **Output**: Project root or specified directory
- **Validation**: check-spec.mjs (existing validator)

### Performance Requirements

| Metric | Target |
|--------|--------|
| Init command | < 1 second for file creation |
| Template rendering | < 500ms for 10 projects |
| Validation | < 2 seconds for files |

### Constraints & Limitations

- **Inputs**: Only alphanumeric + hyphen for project names
- **Cross-platform**: Works on Linux, macOS, Windows
- **Dependencies**: Prefer fs, path built-ins (zero external deps)
- **File permissions**: Preserve execute bits on Dockerfile, shell scripts
- **Security**: Never create files with secrets, document env var setup

---

## Architecture

### Project Structure

```
padrao-labs-agents/
├── .specify/
│   ├── templates/
│   │   ├── Makefile.tmpl
│   │   ├── dependency.yaml.tmpl
│   │   ├── hangar-info.yaml.tmpl
│   │   ├── sonar-project.properties.tmpl
│   │   ├── .gitignore.tmpl
│   │   ├── Dockerfile.tmpl
│   │   ├── .gitlab-ci.yml.tmpl
│   │   └── README.md.tmpl
│   └── scripts/
│       ├── init-padrao-labs.mjs  # NEW: Main init command
│       ├── init-spec.mjs         # Existing: Spec scaffolder
│       └── check-spec.mjs        # Existing: Validator
└── cli/
    ├── src/
    │   ├── commands/
    │   │   ├── init.ts           # NEW: Entry point for init
    │   │   └── ...existing
    │   └── ...
    └── ...
```

### Implementation Strategy

#### Phase 1: Template System
- Create 8 template files in `.specify/templates/`
- Each template has [OWNER], [TRIBE], [APP_NAME], [TYPE] placeholders
- Test template loading and text replacement

#### Phase 2: CLI Command
- Create `init-padrao-labs.mjs` with:
  - User input prompt (project name, owner, tribe, vertical)
  - Template rendering logic (read + replace + write)
  - File creation with proper permissions
  - Validation check after generation

#### Phase 3: Integration
- Add `init` command to CLI package (cli/src/commands/init.ts)
- Add npm script: `"init": "node .specify/scripts/init-padrao-labs.mjs"`
- Update help documentation

#### Phase 4: Validation
- Auto-run `check-spec.mjs` on generated files
- Report any deviations from standard
- Provide fix suggestions

### Data Flow

```
User Input (name, owner, tribe)
    ↓
Validate Input (constraints check)
    ↓
Load Templates (.specify/templates/*.tmpl)
    ↓
Replace Placeholders ([OWNER] → actual value)
    ↓
Create Output Files (mkdir + write)
    ↓
Run Validator (check-spec.mjs)
    ↓
Report Results (success or errors)
```

### Configuration Values

| Placeholder | Source | Example | Validation |
|---|---|---|---|
| [APP_NAME] | User input or --name flag | my-service | lowercase, alphanumeric + hyphens |
| [OWNER] | User input or from git config | backend_squad | lowercase, underscore separated |
| [TRIBE] | Predefined list | operacao | from enum list |
| [VERTICAL] | Predefined list | operacoes | from enum list |
| [TYPE] | python \| nodejs \| java | python | default: nodejs |
| [DATE] | System date | 2026-02-19 | YYYY-MM-DD |

---

## Implementation Tasks

#### Task 1: Create Template Files
- [ ] Makefile.tmpl (language-specific)
- [ ] dependency.yaml.tmpl
- [ ] hangar-info.yaml.tmpl
- [ ] sonar-project.properties.tmpl
- [ ] .gitignore.tmpl
- [ ] Dockerfile.tmpl
- [ ] .gitlab-ci.yml.tmpl
- [ ] README.md.tmpl

#### Task 2: Implement init-padrao-labs.mjs
- [ ] Parse command-line arguments
- [ ] Prompt for missing values
- [ ] Load and validate templates
- [ ] Perform string replacements
- [ ] Create output directory
- [ ] Write files with correct permissions
- [ ] Return success/error with helpful messages

#### Task 3: Integration & Testing
- [ ] Add integration test cases
- [ ] Test on Linux, macOS, Windows
- [ ] Verify generated files pass validator
- [ ] Document usage in README
- [ ] Add examples to docs/

#### Task 4: Documentation
- [ ] Update README with `pnpm init` command
- [ ] Create docs/templates guide
- [ ] Add troubleshooting guide
- [ ] Update this plan to `approved` status

---

## Testing Strategy

### Unit Tests
- Template loading and parsing
- Placeholder replacement logic
- Input validation (project name, owner, tribe formats)
- File write operations (on temp directory)

### Integration Tests
- End-to-end: init → validate → check all files exist
- Cross-platform: run on Linux, macOS, Windows VMs
- Generated app structure: `make help` works, `make run` available

### Manual Testing Checklist
- [ ] `pnpm init` with default values
- [ ] `pnpm init --type python`
- [ ] `pnpm init --type nodejs`
- [ ] Generated Makefile targets work
- [ ] Generated .gitlab-ci.yml is valid YAML
- [ ] Validator passes on generated files

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| User provides invalid project name | High | Low | Input validation + helpful error message |
| Template file missing | Low | High | Check template existence before rendering |
| File permissions lost on Windows | Medium | Medium | Use explicit chmod + test on Windows |
| Generated app doesn't pass validator | Medium | High | Run validator automatically + fail if errors |
| Users override important files | Low | Medium | Prompt before overwrite + backup option |

---

## Success Metrics

✅ New app initialized in < 5 seconds
✅ All 8 files generated correctly
✅ Generated files pass spec validator
✅ Works on Linux, macOS, Windows
✅ Zero external dependencies (only Node.js built-ins)
✅ User-friendly error messages
✅ Command discoverable: `make help` mentions it

---

## Open Items

- [NEEDS CLARIFICATION] Should init also create GitHub/GitLab repo automatically?
- [NEEDS CLARIFICATION] Should we support monorepo multi-app initialization?
- [NEEDS CLARIFICATION] Default values: Should we read from git config (user.name/email)?


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

- **Specification**: `.specify/specs/init-padrao-labs/spec.md`
- **GitHub Issues**: [Link to related GitHub issues]
- **Design Docs**: [Link to architecture diagrams]
- **External Docs**: [Links to framework/library documentation]
