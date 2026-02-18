# Spec-Driven Development Commands for AI Agents

This guide shows how to use /speckit commands with different AI coding assistants.

## Command Structure

All commands follow this pattern:

```
/speckit.[COMMAND] [ARGUMENTS]
```

## Available Commands

### 1. /speckit.constitution

**Purpose**: Establish core principles and governance for projects

**Where to use**: Start of any new project or major feature initiative

**How to invoke**:
```
/speckit.constitution Let's create a constitution for [project] that emphasizes
[principle 1], [principle 2], and [principle 3]. Include constraints for [constraints].
```

**Example for padrao-labs-agents**:
```
/speckit.constitution Create 5 core principles for the Luizalabs Agents catalog:
1. Skills must be reusable and multi-platform compatible
2. All artifacts must follow specification-first development
3. Test-before-merge is mandatory
4. Documentation is primary, code is secondary
5. Architecture decisions must be justified

Include constraints for: security (no hardcoded secrets),
performance (< 5MB bundle), accessibility (WCAG 2.1 AA).
```

**Output**: `.specify/memory/constitution.md`

---

### 2. /speckit.specify

**Purpose**: Define requirements, user scenarios, and acceptance criteria

**Where to use**: When starting work on a new skill, agent, or rule

**How to invoke**:
```
/speckit.specify Write a complete specification for [feature] that:
- Describes who the users are and what they want
- Lists acceptance criteria in Given/When/Then format
- Identifies unclear requirements with [NEEDS CLARIFICATION]
- Defines success metrics
```

**Example for a new skill**:
```
/speckit.specify Create a specification for a "Kubernetes Resource Inspector" skill that:
- Allows developers to analyze Kubernetes manifests and identify issues
- Provides suggestions for improvement based on best practices
- Works on all platforms (Gemini, Copilot, Claude, Antigravity, Cursor)
- Include P1 scenarios: inspect manifest, get improvement suggestions
- Include edge cases: invalid YAML, missing resources
- Mark any unclear requirements with [NEEDS CLARIFICATION]
```

**Output**: `.specify/specs/[feature]/spec.md`

---

### 3. /speckit.clarify

**Purpose**: Address ambiguities and NEEDS CLARIFICATION markers in specifications

**Where to use**: After creating a spec, before planning

**How to invoke**:
```
/speckit.clarify Review this specification and help me clarify [specific items]:
- What exactly should [unclear requirement] do?
- What are the edge cases for [scenario]?
- How should [behavior] be validated?
```

**Example**:
```
/speckit.clarify Review the Kubernetes spec and clarify:
- What specific "issues" should the analyzer detect? (syntax, security, performance, cost?)
- Should it support multiple manifest formats (YAML, JSON, Kustomize)?
- What are acceptable performance targets for analyzing large manifests?
```

**Output**: Updated `.specify/specs/[feature]/spec.md` with clarifications

---

### 4. /speckit.plan

**Purpose**: Create technical implementation plan from the specification

**Where to use**: After spec is approved, before breaking into tasks

**How to invoke**:
```
/speckit.plan Create a technical plan for [feature] that:
- Specifies the technology stack and dependencies
- Describes the architecture and design patterns
- Identifies integration points
- Validates against the constitution
- Maps each acceptance criterion to implementation components
```

**Example**:
```
/speckit.plan Create a technical plan for the Kubernetes skill that:
- Uses TypeScript for the implementation
- Integrates with existing CLI installer pattern
- Describes how each user scenario maps to code components
- Validates that it complies with the 5 constitutional principles
- Include an implementation strategy for P1 scenarios
```

**Output**: `.specify/specs/[feature]/plan.md`

---

### 5. /speckit.analyze

**Purpose**: Validate consistency between spec, plan, and constitution

**Where to use**: Before starting implementation, to catch issues early

**How to invoke**:
```
/speckit.analyze Review this [spec/plan] and verify:
- Consistency with the constitution
- Completeness of acceptance criteria coverage
- Feasibility of the technical approach
- Any gaps or contradictions
```

**Example**:
```
/speckit.analyze Review this plan against the constitution and identify:
- Any violations of the 5 principles
- Missing dependencies or integration points
- Gaps in the testing strategy
- Assumptions that might not hold
```

**Output**: Analysis report with risks and recommendations

---

### 6. /speckit.tasks

**Purpose**: Break the implementation plan into actionable tasks with dependencies

**Where to use**: After plan is approved, to guide actual implementation

**How to invoke**:
```
/speckit.tasks Create a task breakdown for [feature] with:
- Clear phases (Foundation, P1, P2, Polish)
- Specific file paths and implementation details
- Dependency tracking (which tasks must complete first)
- Parallelizable tasks marked with [P]
- Test requirements for each task
```

**Example**:
```
/speckit.tasks Create a task breakdown for the Kubernetes skill:
- Phase 1: Foundation (types, utils, CLI setup)
- Phase 2: P1 scenarios (manifest parsing, analysis engine)
- Phase 3: P2 (improved reporting, caching)
- Mark tasks that can be done in parallel
- For each task, specify: what file, what to implement, what to test
```

**Output**: `.specify/specs/[feature]/tasks.md`

---

### 7. /speckit.implement

**Purpose**: Execute a specific task and generate code

**Where to use**: When actually implementing, one task at a time

**How to invoke**:
```
/speckit.implement Execute [TASK-ID] from the task breakdown:
- Implement [specific requirement]
- Create [file] with [functionality]
- Write tests for [behavior]
- Follow these conventions: [project conventions]
```

**Example**:
```
/speckit.implement Execute TASK-006 - Implement manifest parser:
- Create src/parser.ts with a function to parse K8s YAML manifests
- Handle errors for invalid YAML
- Return structured data that the analyzer can work with
- Write unit tests covering valid/invalid cases
- Use the same error handling patterns as other skills in the project
```

**Output**: Code implementation with tests

---

### 8. /speckit.checklist

**Purpose**: Create validation checklists for features

**Where to use**: When features are complete, to verify all requirements are met

**How to invoke**:
```
/speckit.checklist Create a validation checklist for [feature] covering:
- All acceptance criteria from the spec
- Test coverage requirements
- Documentation completeness
- Platform compatibility
- Constitution compliance
```

**Example**:
```
/speckit.checklist Create a validation checklist for the Kubernetes skill:
- [ ] Manifest parsing works with valid YAML
- [ ] Error handling for invalid manifests
- [ ] Suggestions provided for detected issues
- [ ] Works on Gemini, Copilot, Claude, Antigravity
- [ ] Tests > 80% coverage
- [ ] Documentation with examples
- [ ] Catalog entry created
- [ ] Build passes without errors
```

**Output**: `.specify/specs/[feature]/checklist.md`

---

## Workflow Examples

### Complete Spec-Driven Development Flow

#### Step 1: Constitution (Project Setup)
```
/speckit.constitution Create principles for the padrao-labs-agents project...
```

#### Step 2: Specify (Requirements)
```
/speckit.specify Create a specification for a Kubernetes inspection skill...
```

#### Step 3: Clarify (Address Ambiguities)
```
/speckit.clarify Review the spec and clarify what "issues" means...
```

#### Step 4: Plan (Technical Design)
```
/speckit.plan Create a technical plan for the Kubernetes skill...
```

#### Step 5: Analyze (Validate)
```
/speckit.analyze Review this plan against the constitution...
```

#### Step 6: Tasks (Break Down Work)
```
/speckit.tasks Create a task breakdown with phases and dependencies...
```

#### Step 7: Implement (Do the Work)
```
/speckit.implement Execute TASK-001 - Set up project structure
/speckit.implement Execute TASK-002 - Create type definitions
/speckit.implement Execute TASK-006 - Implement core parser
[... continue with each task ...]
```

#### Step 8: Checklist (Final Validation)
```
/speckit.checklist Create a validation checklist...
[... verify all items before merge ...]
```

---

## Tips for Different AI Agents

### Claude Code
- Claude works best with detailed context and specifications
- Use `/speckit` commands to maintain consistency
- Claude will ask clarifying questions - use those to refine specs
- Good at creating comprehensive type definitions and test suites

### GitHub Copilot
- Copilot excels at code completion but needs clear specs
- Use `/speckit.specify` to give Copilot context
- Refer to constitutional principles for style guidance
- Works well with incremental implementation tasks

### Cursor
- Cursor integrates well with spec documents as context
- Open `.specify/specs/[feature]/spec.md` as reference while coding
- Use `/speckit` to stay aligned with project standards

### Gemini CLI
- Gemini is good at breaking down large problems
- Use `/speckit.tasks` to get structured task lists
- Reference the constitution for design decisions

### Other Agents
- All agents benefit from clear specifications
- Always start with `/speckit.constitution` for guardrails
- Use `/speckit.specify` before implementing
- Reference approved plans during implementation

---

## Best Practices

1. **Always Start with Constitution**: Create `.specify/memory/constitution.md` first
2. **Never Skip Specification**: Don't code before `.specify/specs/[feature]/spec.md` exists
3. **Clarify Before Planning**: Resolve `[NEEDS CLARIFICATION]` items before technical planning
4. **Validate Against Constitution**: Use `/speckit.analyze` to catch issues early
5. **Break Into Tasks**: Never implement without a task breakdown
6. **One Task at a Time**: Complete and test one task before moving to the next
7. **Verify Acceptance**: Use checklists to ensure nothing is missed
8. **Document Decisions**: Record why you made specific technical choices in the plan

---

## File Locations

```
.specify/
├── memory/
│   └── constitution.md          # Project principles
├── specs/
│   └── [feature-name]/
│       ├── spec.md              # Requirements and user scenarios
│       ├── plan.md              # Technical design and architecture
│       ├── tasks.md             # Task breakdown and dependencies
│       ├── checklist.md         # Validation checklist
│       └── contracts/           # API/data contracts (optional)
├── templates/
│   ├── spec-template.md         # Template for new specs
│   ├── plan-template.md         # Template for plans
│   └── tasks-template.md        # Template for task breakdowns
└── scripts/                     # Automation scripts (optional)
```

---

## Next Steps

1. Review `.specify/memory/constitution.md` to understand project principles
2. Use `/speckit.specify` to create requirements for your feature
3. Use `/speckit.plan` to design the implementation
4. Use `/speckit.tasks` to plan your work
5. Implement each task using `/speckit.implement`
6. Validate completion with `/speckit.checklist`
