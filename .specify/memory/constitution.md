# Luizalabs Agents & Skills Constitution

## Core Principles

### 1. **Skill-First Architecture**
Every feature or capability should be developed as a standalone, reusable skill. Skills must be self-contained, independently testable, and documented with clear metadata (name, description, works_on platforms, tags).

**Rationale**: Reusability across different AI agents (Gemini, Copilot, Claude, Antigravity, etc.) and maintainability through modular design.

### 2. **Multi-Agent Compatibility**
All skills, agents, and rules must be designed to work across multiple AI coding assistants. Each artifact should declare its supported platforms via `works_on` metadata.

**Supported Platforms**:
- Gemini CLI (`gemini_cli`)
- GitHub Copilot (`copilot`)
- Google Antigravity (`antigravity`)
- Claude Code (`claude`)
- Cursor IDE (`cursor`)
- Windsurf (`windsurf`)
- Cline/Roo Code (`cline`)

**Rationale**: Developers use different AI tools. Our catalog should work universally.

### 3. **Specification-First Development**
Before implementing any new skill, agent, or rule:
1. Write a complete specification in `.specify/specs/<feature>/spec.md`
2. Define user scenarios and acceptance criteria
3. Create implementation plan in `plan.md`
4. Generate task breakdown in `tasks.md`
5. Only then implement

**Rationale**: Reduces rework, ensures completeness, maintains quality standards.

### 4. **Markdown-First Documentation**
All skills, agents, rules, hooks, and workflows use Markdown as the primary format:
- Skills: `SKILL.md` with frontmatter metadata
- Agents: `AGENTS.md` with platform-specific instructions
- Rules: `RULES.md` with style guidelines
- Hooks: `HOOKS.md` with trigger definitions
- Workflows: `WORKFLOW.md` with CI/CD pipeline specs

**Rationale**: Human-readable, version-controllable, AI-parseable.

### 5. **Test-Before-Merge Imperative**
Every new skill, agent, or rule must include automated tests before merging:
- Skills: Unit tests for core functionality, integration tests for platform compatibility
- Components: Vue component tests with @vue/test-utils
- CLI: Tests for install/update/init commands
- Documentation: Build validation (no broken markdown, valid frontmatter)

**Rationale**: Quality assurance, regression prevention, confidence in changes.

## Additional Constraints

### Security
- **No secrets in code**: All credentials, API keys, and sensitive data must be externalized to `.env` files or secret management systems
- **Input sanitization**: All user inputs in skills must be validated and sanitized
- **Dependency auditing**: Run `pnpm audit` regularly, address high/critical vulnerabilities immediately

### Performance
- **Bundle size**: Keep VitePress docs bundle under 5MB (currently optimized with lazy loading)
- **Lazy loading**: Use `defineAsyncComponent` for Vue components not used in critical render path
- **Search indexing**: Catalog.json must be optimized for fast client-side search (MiniSearch)

### Accessibility
- **WCAG 2.1 Level AA**: All documentation UI components must meet accessibility standards
- **Keyboard navigation**: Full keyboard support for search, filters, navigation
- **Screen reader compatibility**: Proper ARIA labels and semantic HTML

## Development Workflow

### 1. Feature Specification
```bash
# Create new feature spec
cd .specify/specs
mkdir <feature-name>
cp ../templates/spec-template.md <feature-name>/spec.md
# Edit spec.md with requirements and user scenarios
```

### 2. Clarification Phase
- Mark unclear requirements with `[NEEDS CLARIFICATION]`
- Use AI agent with `/speckit.clarify` command
- Resolve all ambiguities before proceeding

### 3. Planning Phase
```bash
# Generate technical plan
# Use AI agent: /speckit.plan
# Review .specify/specs/<feature-name>/plan.md
```

### 4. Task Breakdown
```bash
# Generate actionable tasks
# Use AI agent: /speckit.tasks
# Review .specify/specs/<feature-name>/tasks.md
```

### 5. Implementation
```bash
# Create feature branch
git checkout -b feature/<feature-name>

# Implement tasks sequentially
# Use AI agent: /speckit.implement <TASK-ID>

# Run tests after each task
pnpm test:run
```

### 6. Code Review
- **Constitution check**: Validate compliance with all 5 core principles
- **Test coverage**: Ensure all new code has tests
- **Documentation**: Update relevant docs (README, integration guides)
- **Catalog sync**: Run `node src/loader.js` to regenerate catalog

### 7. Merge & Deploy
```bash
# Merge to main
git checkout main
git merge feature/<feature-name>

# Deploy docs
pnpm docs:build
# Deploy to production (handled by CI/CD)
```

## Governance Rules

### Constitutional Violations
Any deviation from core principles must be:
1. Explicitly documented in `plan.md` under "Complexity Tracking" table
2. Justified with clear rationale
3. Include explanation of why simpler alternatives were rejected
4. Approved by at least one maintainer in PR review

### Complexity Justification Template
| Constitutional Violation | Justification | Simpler Alternative Rejected |
|-------------------------|---------------|------------------------------|
| [Principle violated]    | [Why needed] | [Why not used]              |

### Quality Gates
All PRs must pass:
- [ ] Automated tests (`pnpm test:run`)
- [ ] Markdown linting (`pnpm lint:md`)
- [ ] Build validation (`pnpm docs:build`)
- [ ] Constitution compliance check
- [ ] At least one approving review

### Amendment Process
To amend this constitution:
1. Create PR with proposed changes to this file
2. Provide detailed justification in PR description
3. Require approval from 2+ maintainers
4. Update version and ratified date below

## Metadata
- **Version**: 1.0.0
- **Ratified**: 2026-02-18
- **Last Amended**: 2026-02-18
- **Amendments**: None
- **Maintainers**: Luizalabs Platform Team
- **Repository**: https://gitlab.luizalabs.com/luizalabs/padrao-labs-agents
