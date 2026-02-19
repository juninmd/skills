# Specification - Initialize Luizalabs Standard App Structure

> This spec defines the standard initialization workflow for new Luizalabs applications.
> Based on agents.md and best practices across the organization.

## Header Section

- **Feature Name**: Initialize Luizalabs Standard App Structure
- **Type**: `workflow`
- **Branch**: `feature/init-padrao-labs`
- **Date**: 2026-02-19
- **Status**: `draft`
- **Spec Version**: 1.0
- **Description**: Automated scaffolding and initialization of new Luizalabs apps following security, quality, and deployment standards (Makefile, dependency.yaml, hangar-info.yaml, sonar.properties, .gitignore, Dockerfile, gitlab-ci.yml)
- **Platforms**: gemini_cli, copilot, antigravity, claude, cursor, windsurf, cline

---

## User Scenarios & Testing

> Each scenario tests the initialization of a complete app structure following Luizalabs standards.

### P1: Initialize New Backend App with All Standard Files

**Narrative**:
- **Who**: DevOps engineers and backend developers starting a new microservice
- **What**: They run a command to scaffold a new app with all required Luizalabs files
- **Why**: Ensures compliance from day 1 with security, quality, and deployment standards

**Independent Testing Approach**:
- Create a new directory and run initialization command
- Verify all required files exist (Makefile, dependency.yaml, hangar-info.yaml, sonar.properties, .gitignore, Dockerfile, .gitlab-ci.yml)
- Validate file contents match Luizalabs standard (correct format, required sections)
- Test that `make help` shows standard targets
- Verify `make test:coverage` command is available

**Acceptance Criteria**:
```gherkin
Given a new empty project directory
When I run 'pnpm spec:init my-app' or 'npx @luizalabs/padrao-labs-agents init'
Then all 8 standard files are created with correct placeholders
  And all files contain correct [OWNER], [TRIBE], [APP_NAME] markers
  And Makefile has required targets: run, coverage, clean
  And sonar.properties has minimum 90% coverage requirement
  And dependency.yaml has owner, tribe, vertical fields
  And .gitignore excludes .env, __pycache__, coverage.xml, .venv
  And Dockerfile installs 'make' as system dependency
  And gitlab-ci.yml includes security-scanner, unit-tests, quality-scanner jobs
```

### P2: Customize Files for Specific Project Type (Python/Node.js/Java)

**Narrative**:
- **Who**: Developers working with a specific tech stack
- **What**: They initialize with project-type specific templates (Python, Node.js, Java)
- **Why**: Each language has different dependency management and test frameworks

**Independent Testing Approach**:
- Initialize with `--type python` flag
- Verify Makefile uses Python virtual env (.venv)
- Verify requirements.txt is created
- Verify sonar.properties has python.coverage.reportPaths
- Verify Dockerfile uses python:3.11-bullseye

**Acceptance Criteria**:
```gherkin
Given project type selection (python | nodejs | java)
When initialization completes with --type flag
Then language-specific Makefile is generated
  And package manager is configured correctly (pip, npm, maven)
  And sonar.properties has language-specific settings
  And .gitlab-ci.yml has language-specific test commands
```

### P3: Validate Generated Files Match Luizalabs Constitution

**Narrative**:
- **Who**: QA and TC engineers validating new apps
- **What**: They run validation against the generated files
- **Why**: Ensure no drifts from standards and all guidelines are implemented

**Independent Testing Approach**:
- Generate a complete app structure
- Run validation against agents.md requirements
- Check for anti-patterns (hardcoded IPs, secrets in code, etc)

**Acceptance Criteria**:
```gherkin
Given a freshly initialized app
When I run 'pnpm spec:validate' or 'make spec-validate'
Then no errors are reported
  And .gitignore includes all sensitive patterns
  And Dockerfile uses non-root user (if applicable)
  And sonar.properties excludes tests correctly
  And dependency.yaml has all required fields
```

### Edge Cases & Error Scenarios

- **Missing placeholders**: What if user doesn't fill [OWNER], [TRIBE], [APP_NAME]?
  - Command should warn and provide instructions
- **File already exists**: What if directory has existing Makefile?
  - Prompt user to confirm overwrite or merge
- **Git not initialized**: What if .git doesn't exist?
  - Create .gitignore anyway, document Git initialization step
- **Invalid project type**: What if user requests unsupported language?
  - Show list of supported types and retry

---

## Requirements

### Mandatory Files Generated

1. **Makefile** - Standard targets: `run`, `coverage`, `clean`, `help`
   - Includes SHELL := /bin/bash
   - Exports PYTHONPATH for Python projects
   - Has language-specific targets

2. **dependency.yaml** - Project metadata (owner, tribe, vertical, app info)
   - All fields in lowercase_with_underscores
   - Full documentation in app section

3. **hangar-info.yaml** - Backstage catalog metadata
   - Annotations for security, tier, auth, WAF, QRadar
   - Boolean values in single quotes ('Yes', 'No')
   - owner uses group: prefix

4. **sonar-project.properties** - Code quality configuration
   - sonar.projectKey matches app name
   - sonar.python.coverage.reportPaths for Python
   - Minimum 90% coverage requirement in documentation
   - Exclusions for tests and conftest

5. **.gitignore** - Security: exclude .env, __pycache__, coverage.xml, .venv, .pytest_cache
   - Node.js: node_modules, dist, build
   - Python: *.pyc, .venv, __pycache__

6. **Dockerfile** - Container configuration
   - `RUN apt-get install -y make` (required for CI/CD)
   - Non-root user when applicable
   - Multi-stage builds for optimization

7. **.gitlab-ci.yml** - CI/CD Pipeline
   - Includes security-scanner job
   - unit-tests with coverage report
   - quality-scanner for SonarQube
   - deploy-staging job (optional)

8. **README.md** - Project documentation
   - Description of app
   - Quick start section (npm install, make run)
   - Environment variables section
   - Release Notes with version history

### Feature Flags

- `--type` flag: Select project type (python, nodejs, java)
- `--with-docker`: Include Docker configuration
- `--with-gitlab-ci`: Include CI/CD pipeline
- `--with-tests`: Create tests directory with examples

### Input Validation

- App name: lowercase, alphanumeric + hyphens only
- Owner: lowercase_with_underscores, max 50 chars
- Tribe: from predefined list (operacao, produto, platform, etc)
- Vertical: from predefined list (operacoes, desenvolvimento, etc)

---

## Success Criteria

✅ New project initialized with zero configuration (pick defaults)
✅ All 8 files follow Luizalabs standard exactly
✅ `make help` shows all available commands
✅ `make run` works with default setup
✅ `make coverage` generates coverage report
✅ `pnpm spec:validate` finds no compliance issues
✅ Files are immediately git-ready (no manual edits needed)
✅ Cross-platform: works on Linux, macOS, Windows

---

## Open Questions

- [NEEDS CLARIFICATION] Should we auto-create GitHub/GitLab repo or just local directories?
- [NEEDS CLARIFICATION] Should initialization prompt for owner/tribe or use defaults?
- [NEEDS CLARIFICATION] Should Android project type be supported initially?
- [NEEDS CLARIFICATION] Should we auto-run `npm install` after generation?

---

## Related Standards

- **agents.md** § Diretrizes de Segurança e Qualidade
- **agents.md** § Makefile
- **agents.md** § dependency.yaml
- **agents.md** § hangar-info (Backstage Catalog)
- **agents.md** § SonarQube
- **agents.md** § Gitlab CI
- **agents.md** § Anti-Patterns (O que NÃO fazer)


---

## Requirements

### Functional Requirements

- **FR-001**: [Specific, measurable capability]
  - Definition: [What exactly must it do?]
  - Scope: [What is included/excluded?]

- **FR-002**: [NEEDS CLARIFICATION] [Unclear requirement that needs refinement]
  - Questions: [What needs to be clarified?]

### Non-Functional Requirements

- **Performance**: [Response time, throughput targets]
- **Scalability**: [How many users/requests must it handle?]
- **Security**: [What data must be protected? How?]
- **Accessibility**: [WCAG standards, screen reader support]
- **Compatibility**: [Which versions of platforms must work?]

### Key Entities & Data Model

**Primary Entity: [Entity Name]**
- `attribute_1` (string, required): [Description]
- `attribute_2` (enum: value1, value2): [Description]
- Relationships: [How does this entity relate to others?]

**Secondary Entity: [Entity Name]**
- [Similar structure]

---

## Dependencies & Constraints

### External Dependencies
- **Platform APIs**: [Which external services/APIs are required?]
- **Libraries**: [Required third-party libraries]
- **Services**: [Required backend services]

### Constraints
- **Technical**: [Any technical limitations?]
- **Business**: [Any business constraints?]
- **Legal/Compliance**: [Any regulatory requirements?]

### Assumptions
- [Assumption 1 about system behavior]
- [Assumption 2 about user behavior]

---

## Testing Strategy

> Defina a estratégia de testes já na fase de especificação.

### Testes Unitários
- [Quais funções/componentes devem ter testes unitários?]
- Coverage target: ≥ 80% (idealmente ≥ 90%)

### Testes de Integração
- [Quais fluxos devem ser testados end-to-end?]
- [Abordagem: mocks ou chamadas reais?]

### Testes Manuais
- [Quais cenários precisam de validação manual?]

---

## Contracts

> Defina as interfaces e APIs esperadas para a feature.

### Interface Principal
```typescript
// Defina a interface esperada
interface [FeatureName] {
  // [property]: [type]; // [description]
}
```

### Inputs & Outputs
- **Input**: [Formato e tipo dos dados de entrada]
- **Output**: [Formato e tipo dos dados de saída]
- **Erros**: [Tipos de erro esperados e como são comunicados]

---

## Success Criteria

> Define measurable outcomes that determine if this feature is complete and working.

- **SC-001**: [All P1 user scenarios execute successfully]
- **SC-002**: [Test coverage > 80%]
- **SC-003**: [Documentation complete with examples]
- **SC-004**: [Works on all required platforms (defined in Header)]
- **SC-005**: [Catalog entries generated with proper metadata]
- **SC-006**: [[NEEDS CLARIFICATION] Performance target - what should it be?]

---

## Out of Scope

> Explicitly list what is NOT included in this feature to prevent scope creep.

- [Feature/capability that could be added but isn't in this scope]
- [Integration that might be useful but is handled separately]
- [Future enhancement that's documented but not implemented]

---

## Related Documents

- **Constitution**: See `.specify/memory/constitution.md` for development principles
- **Plan**: Will be created in `.specify/specs/init-padrao-labs/plan.md` after approval
- **Tasks**: Will be created in `.specify/specs/init-padrao-labs/tasks.md` from the plan
